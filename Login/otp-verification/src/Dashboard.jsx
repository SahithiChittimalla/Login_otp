import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="container mt-5"><h2>Please login</h2></div>;

  return (
    <div className="container d-flex justify-content-center align-items-center"  style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: 400 }}>
        <h3>Welcome, {user.name} 👋</h3>
        <p><strong>Mobile:</strong> {user.phone}</p>
        <div className="d-grid mt-3">
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
