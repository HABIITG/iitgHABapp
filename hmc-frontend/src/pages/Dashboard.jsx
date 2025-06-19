import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{user.hostel_name}</h2>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};
