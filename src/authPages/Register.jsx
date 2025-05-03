import { useContext, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import auth from "../firebase/firebase.init";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const { createUser } = useContext(AuthContexts);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!hasUpperCase)
      return "Password must have at least one uppercase letter.";
    if (!hasLowerCase)
      return "Password must have at least one lowercase letter.";
    if (!isLongEnough) return "Password must be at least 6 characters long.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const photoURL = e.target.photoURL.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      toast.error(validationError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const userCredential = await createUser(email, password);
      const registeredUser = userCredential.user;
      await updateProfile(registeredUser, {
        displayName: name,
        photoURL: photoURL,
      });

      const userResponse = await fetch(
        `https://buildbox-server-side.vercel.app/users`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            role: "user",
            photoURL: photoURL,
            displayName: name,
          }),
        }
      );
      const userResult = await userResponse.json();
      console.log("User Update Response:", userResult);

      setError(null);
      navigate("/login");
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user?.email;
      const userResponse = await fetch(
        `https://buildbox-server-side.vercel.app/users`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            role: "user",
            photoURL: user?.photoURL,
            displayName: user?.displayName,
          }),
        }
      );
      const userResult = await userResponse.json();
      console.log("User Update Response:", userResult);
      setError(null);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

          <form onSubmit={handleRegister}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="text"
                name="photoURL"
                placeholder="Photo URL"
                className="input input-bordered"
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}

          <div className="divider">OR</div>

          <div className="form-control">
            <button
              className="btn btn-outline btn-secondary"
              onClick={handleGoogleRegister}
            >
              Register with Google
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
