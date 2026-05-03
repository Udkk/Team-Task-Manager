const toneClasses = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700'
};

const Card = ({ label, value, tone = 'blue' }) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:shadow-md">
      <div
        className={`mb-5 inline-flex rounded-md border px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
      >
        {label}
      </div>
      <p className="text-3xl font-semibold text-slate-950">{value}</p>
    </article>
  );
};

export default Card;
