import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-form__title">AW Client Report Portal</h1>
      {error && <p className="login-form__error">{error}</p>}
      <Input label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" variant="primary">Sign in</Button>
    </form>
  );
}
