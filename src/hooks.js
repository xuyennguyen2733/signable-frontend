
import { useContext } from "react";
import { UserContext } from "./context/user";
import { useAuth } from "./context/auth";

import api from "./utils/api"

const useApi = () => {
  const { token } = useAuth();
  return api(token)
}

const useApiWithoutToken = () => {
  return api();
}

const useUser = () => useContext(UserContext);

export {
  useApi,
  useApiWithoutToken,
  useAuth,
  useUser
}



