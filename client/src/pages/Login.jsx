import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import AuthPage from '../components/AuthPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import loginBackground from '../assets/login-background.svg';

const loginFields = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    required: true
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
    required: true
  }
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
          'Unable to sign in with those credentials'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPage
      backgroundImage={loginBackground}
      panelHeading="New Here?"
      panelSubtext="Create an account to plan work, organize projects, and keep your team moving with less noise."
      panelButtonLabel="Create Account"
      panelButtonTo="/signup"
      title="Sign In"
      fields={loginFields}
      values={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      submitLabel="Sign In"
      submittingLabel="Signing in..."
      isSubmitting={isSubmitting}
      footerText="New here?"
      footerLinkLabel="Create account"
      footerLinkTo="/signup"
    />
  );
};

export default Login;
