import { createContext, useContext, useState } from "react";

const RecoveryContext = createContext();

function RecoveryProvider({ children }) {
  const [page, setPage] = useState("request");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const contextValue = {
    page,
    username,
    email,
    otp,
    setPage,
    setUsername,
    setEmail,
    setOtp,
  };

  return (
    <RecoveryContext.Provider value={contextValue}>
      {children}
    </RecoveryContext.Provider>
  );
}

// custom hook
const useRecovery = () => useContext(RecoveryContext);

export { RecoveryProvider, useRecovery };
