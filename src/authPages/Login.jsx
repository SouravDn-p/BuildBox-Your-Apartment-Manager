import { useContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import auth from "../firebase/firebase.init";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContexts } from "../authProvider/AuthProvider";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, signInUser } = useContext(AuthContexts);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInUser(email, password)
      .then((userCredential) => {
        const user = { email: userCredential.user?.email };
        axios
          .post("https://buildbox-server-side.vercel.app/jwt", user, {
            withCredentials: true,
          })
          .then((response) => {
            console.log("JWT Response:123", response.data);
            localStorage.setItem("token", response.data.token);
          });
        setUser(userCredential.user);

        setError(null);
        navigate(from);
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.error("Login error:", err.message);
        setError(err.message);
        toast.error(err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

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
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = {
        email: result.user?.email,
        name: result.user?.displayName,
      };
      const jwtResponse = await axios.post(
        "https://buildbox-server-side.vercel.app/jwt",
        user,
        {
          withCredentials: true,
        }
      );
      console.log("JWT Response:", jwtResponse.data);
      localStorage.setItem("token", jwtResponse.data.token);
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

      setUser(result.user);
      setError(null);
      toast.success("Google Sign-In successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(from);
    } catch (err) {
      console.error("Google Sign-In error:", err.message);
      setError(err.message);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, from, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {user ? (
            <div className="text-center">
              <p className="mb-2">
                Welcome, {user?.displayName || user?.email}
              </p>
              <Link className="btn btn-secondary" to="/">
                Home
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailPasswordLogin}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input input-bordered"
                    required
                  />
                  <label className="label">
                    <span
                      className="label-text-alt link link-hover"
                      onClick={() =>
                        navigate("/forgot-password", { state: { email } })
                      }
                    >
                      Forgot password?
                    </span>
                  </label>
                </div>

                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    Login
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
                  onClick={handleGoogleSignIn}
                >
                  Login with Google
                </button>
              </div>

              <div className="form-control">
                <Link to="/register" className="btn btn-accent">
                  Register First
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
