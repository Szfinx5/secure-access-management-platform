import { useRouter } from "next/router";

const Profile = ({ user }) => {
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <div className="profile">
      <h2>Welcome on your profile page, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Location: {user.location}</p>
    </div>
  );
};

export default Profile;
