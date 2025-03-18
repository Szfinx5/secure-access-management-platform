import axios from "axios";
import Profile from "@/components/Profile.js";
import Navbar from "@/components/Navbar.js";

const ProfilePage = ({ user }) => {
  return (
    <>
      <Navbar from={"profile"} />
      <Profile user={user} />
    </>
  );
};

// Server-side function to fetch user data
export async function getServerSideProps(context) {
  const { req, res } = context;
  const accessToken = req.cookies.accessToken || "";

  // If no access token, redirect to login page
  if (!accessToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    // Send the access token to backend API to verify it
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // If token is valid, return the user data as props
    return {
      props: {
        user: response?.data?.message,
      },
    };
  } catch (error) {
    console.error("Error verifying access token:", error);

    // If token verification fails, redirect to login page
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default ProfilePage;
