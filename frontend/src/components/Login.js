/* eslint-disable react/no-unescaped-entities */
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import cookies from "js-cookie";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice.js";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        /* Making sure the email/username is case insensitive */
        const payload = {
          ...formData,
          email: formData.email.toLowerCase().trim(),
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
          payload,
          {
            withCredentials: true,
          }
        );
        /* Setting the user details in Redux for frontend access and cookie for backend access */
        const { accessToken, user } = response.data.message;
        dispatch(setUser({ user, accessToken }));
        cookies.set("accessToken", accessToken, { expires: 1, path: "/" });
        router.push("/profile");
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, formData, router]
  );

  return (
    <div className="login">
      <h2>Login</h2>
      <p>Please enter your email and password to access your task list.</p>
      <form onSubmit={handleSubmit}>
        <label>Email address:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : "Login"}
        </button>

        <div className="new-account">
          Haven't got an account yet?
          <br />
          <Link href="/register" className="register-link">
            Click here to register.
          </Link>
        </div>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
