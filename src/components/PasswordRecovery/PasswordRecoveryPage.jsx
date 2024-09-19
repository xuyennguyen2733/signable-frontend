import { RecoveryProvider, useRecovery } from "../../context/recovery";
import RequestPage from "./RequestPage";
import VerificationPage from "./VerificationPage";
import ResetPage from "./ResetPage";
import ChangeSuccessPage from "./ChangeSuccessPage";

function PageNavigator() {
  const { page, setPage } = useRecovery();
  switch (page) {
    case "request": {
      return <RequestPage />;
    }
    case "verification": {
      return <VerificationPage />;
    }
    case "reset": {
      return <ResetPage />;
    }
    case "success": {
      return <ChangeSuccessPage />;
    }
  }
}
function PasswordRecoveryPage() {
  return (
    <RecoveryProvider>
      <PageNavigator></PageNavigator>
    </RecoveryProvider>
  );
}

export default PasswordRecoveryPage;
