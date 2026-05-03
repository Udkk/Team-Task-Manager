import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import AuthPage from '../components/AuthPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const signupFields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    autoComplete: 'name',
    required: true
  },
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
    autoComplete: 'new-password',
    minLength: 6,
    required: true
  }
];

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (apiError) {
      const validationMessage = apiError.response?.data?.errors
        ?.map((item) => item.message)
        .join(', ');
      const networkMessage =
        apiError.code === 'ERR_NETWORK'
          ? 'Backend API is not reachable. Start the server on port 5000 and make sure MongoDB is running.'
          : '';

      setError(
        validationMessage ||
          networkMessage ||
          apiError.response?.data?.message ||
          'Unable to create account'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPage
      panelHeading="Welcome Back!"
      panelSubtext="Sign in to continue managing projects, tasks, and team priorities in one focused workspace."
      panelButtonLabel="Sign In"
      panelButtonTo="/login"
      title="Create Account"
      fields={signupFields}
      values={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
      submitLabel="Sign Up"
      submittingLabel="Creating..."
      isSubmitting={isSubmitting}
      footerText="Already registered?"
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
    />
  );
};

export default Signup;
