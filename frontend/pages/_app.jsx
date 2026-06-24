import { AuthProvider } from '../context/AuthContext';
import { ClientProvider } from '../context/ClientContext';
import Layout from '../features/layout/Layout';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../features/auth/LoginForm';
import '../styles/globals.css';

function AppContent({ Component, pageProps }) {
  const { user, loading } = useAuth();

  if (loading) return <Layout><div className="loading">Loading...</div></Layout>;
  if (!user) return <LoginForm />;

  return (
    <ClientProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClientProvider>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}
