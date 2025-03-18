import { useRouter } from "next/router";

const Dashboard = ({ users }) => {
  const router = useRouter();

  if (!users) {
    return (
      <>
        <h2>Welcome on your Dashboard</h2>
        <p>Nothing here yet</p>
      </>
    );
  }

  return (
    <div className="profile">
      <h2>Welcome on your Dashboard</h2>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.location}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
