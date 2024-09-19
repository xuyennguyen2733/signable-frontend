import { useNavigate } from "react-router-dom";
import "./PasswordRecovery.css";

function ChangeSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <h1>Password Changed Successfully!</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            style={{ margin: "0.5rem" }}
            onClick={() => navigate("/login")}
          >
            Go back to login page
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeSuccessPage;
