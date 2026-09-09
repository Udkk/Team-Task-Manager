const LoadingState = ({ label = 'Loading...' }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
      {label}
    </div>
  );
};

export default LoadingState;
