import { useState, useEffect } from "react";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/*  It can retrieve the accessToken from the cookie */
export const useDecodeToken = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = cookies.get("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return user;
};

export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "44" + cleaned.substring(1);
  } else if (cleaned.startsWith("44")) {
    return cleaned;
  }

  return cleaned;
};
