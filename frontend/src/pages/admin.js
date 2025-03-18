import axios from "axios";
import Profile from "@/components/Profile.js";
import Navbar from "@/components/Navbar.js";
import Dashboard from "@/components/Admin";

const AdminPage = ({ users }) => {
  return (
    <>
      <Navbar from={"admin"} />
      <Dashboard users={users} />
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
    // Send the access token to the backend API to verify it
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // If token is valid and belongs to an admin, return the users data as props
    return {
      props: {
        users: response?.data?.message,
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

export default AdminPage;
