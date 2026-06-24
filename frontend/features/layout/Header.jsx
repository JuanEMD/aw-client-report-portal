import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <a href="/clients" className="header__logo"><h1>AW Client Report Portal</h1></a>
      {user && (
        <div className="header__user">
          <span className="header__username">{user.display_name}</span>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      )}
    </header>
  );
}
