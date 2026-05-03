const styles = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700'
};

const Alert = ({ children, type = 'success' }) => {
  if (!children) {
    return null;
  }

  return (
    <div className={`mb-6 rounded-md border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
};

export default Alert;
