import Login from "@/components/Login";
import Navbar from "../components/Navbar.js";

const LoginPage = () => {
  return (
    <>
      <Navbar from={"login"} />
      <Login />
    </>
  );
};

export default LoginPage;
