import { updatePassword } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContexts } from "../../providers/AuthProvider";
import { useContext, useState } from "react";

const ForgetPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContexts); // Get the logged-in user from context
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const emailFromState = location.state?.email || "";

  const handleResetPassword = async (e) => {
    try {
      await updatePassword(user, newPassword);
      setError(null);
      setSuccessMessage("Password updated successfully!");
    } catch (err) {
      console.error("Error updating password:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Reset Password
          </h2>
          <form>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                defaultValue={emailFromState}
                placeholder="Email"
                className="input input-bordered"
                required
              />

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="input input-bordered"
                  required
                />
              </div>
            </div>
            <div className="form-control mt-6">
              <Link
                to={"/login"}
                type="button"
                className="btn btn-primary"
                onClick={handleResetPassword}
              >
                Reset Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
