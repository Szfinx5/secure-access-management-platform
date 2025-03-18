import Link from "next/link";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import cookies from "js-cookie";
import { logout } from "@/store/authSlice";
import { useDecodeToken } from "@/utils/helpers";
import { setUser } from "../store/authSlice.js";

const Navbar = ({ from }) => {
  const dispatch = useDispatch();
  const userFromToken = useDecodeToken();
  const accessToken = cookies.get("accessToken");

  /* TODO: When the user refresh the page on the homepage, 
    the Redux state is wiped and the Navbar will treat it as a guest */
  let { user } = useSelector((state) => state.auth);
  if ((from === "profile" || from === "admin") && !user) {
    dispatch(setUser({ user: userFromToken, accessToken }));
  }

  /*  Depending on the user type, 
      we are setting the links to be displayed in the navbar */
  const links = useMemo(() => {
    const guestLinks = {
      home: [
        { text: "Login", path: "/login" },
        { text: "Register", path: "/register" },
      ],
      login: [
        { text: "Home", path: "/" },
        { text: "Register", path: "/register" },
      ],
      register: [
        { text: "Home", path: "/" },
        { text: "Login", path: "/login" },
      ],
    };

    const userLinks = {
      home: [
        { text: "Profile", path: "/profile" },
        { text: "Logout", path: "/" },
      ],
      profile: [
        { text: "Home", path: "/" },
        { text: "Logout", path: "/" },
      ],
    };

    const adminLinks = {
      home: [
        { text: "Profile", path: "/profile" },
        { text: "Dashboard", path: "/admin" },
        { text: "Logout", path: "/" },
      ],
      profile: [
        { text: "Home", path: "/" },
        { text: "Dashboard", path: "/admin" },
        { text: "Logout", path: "/" },
      ],
      admin: [
        { text: "Home", path: "/" },
        { text: "Profile", path: "/profile" },
        { text: "Logout", path: "/" },
      ],
    };

    if (user) {
      if (user?.role === "admin") {
        return adminLinks[from] || [];
      } else {
        return userLinks[from] || [];
      }
    } else {
      return guestLinks[from] || [];
    }
  }, [user, from]);

  const handleLogout = useCallback(async () => {
    if (links.some((link) => link.text === "Logout")) {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        withCredentials: true,
      });
      /* Removing the access cokie and calling the /logout for removing the refreshToken too  */
      cookies.remove("accessToken");
      dispatch(logout());
    }
  }, [dispatch, links]);

  return (
    <div className="navbar">
      <h1>2FA platform</h1>
      <div
        className="links"
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
      >
        {links.map(({ text, path }) => (
          <Link
            key={text}
            href={path}
            onClick={text === "Logout" ? handleLogout : null}
            style={{ minWidth: "80px", textAlign: "center" }}
          >
            {text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
