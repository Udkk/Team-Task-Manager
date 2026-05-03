const FormContainer = ({ children, className = '', title }) => {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-slate-950">{title}</h3>
      )}
      {children}
    </section>
  );
};

export default FormContainer;
