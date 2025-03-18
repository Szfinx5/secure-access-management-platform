import { useState, useCallback } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "../store/authSlice.js";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    phone: "",
    location: "",
    role: "user",
  });
  const { name, email, password, confPassword, phone, location, role } =
    formData;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      /* Password validation. Forcing the user to have a strong password */
      const isPasswordValid = () => {
        const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (password.match(passw)) {
          if (password === confPassword) {
            return true;
          } else {
            setError("The password doesn't match");
            return false;
          }
        } else {
          setError(
            `Password needs to be between 6 to 20 characters and contain at least one numeric digit, one uppercase, and one lowercase letter.`
          );
          return false;
        }
      };

      if (!isPasswordValid()) return;

      setIsLoading(true);

      try {
        /* Making sure the email/username is case insensitive */
        const payload = {
          ...formData,
          email: formData.email.toLowerCase().trim(),
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
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
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password, confPassword, name, email, phone, location, role]
  );

  return (
    <div className="register">
      <h2>Register</h2>
      <p>Please enter your email, password, and name to create your account.</p>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <label>Email address:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <label>Confirm password:</label>
        <input
          type="password"
          name="confPassword"
          value={confPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <label>Phone number:</label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <label>Location:</label>
        <input
          type="test"
          name="location"
          value={location}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <label>Role:</label>
        <select
          name="role"
          value={role}
          onChange={handleChange}
          required
          disabled={isLoading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
