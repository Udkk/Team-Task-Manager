import { Link } from 'react-router-dom';

import Alert from './Alert.jsx';

const baseInputClassName =
  'mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-950 outline-none hover:border-gray-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-50 disabled:cursor-not-allowed disabled:bg-gray-50';

const AuthInput = ({ label, ...inputProps }) => {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input className={baseInputClassName} {...inputProps} />
    </label>
  );
};

const BrandingPanel = ({
  heading,
  subtext,
  buttonLabel,
  buttonTo
}) => {
  return (
    <section className="flex min-h-[260px] flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-12 text-center text-white md:min-h-[620px]">
      <div className="max-w-sm">
        <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/85">{subtext}</p>
        <Link
          className="mt-8 inline-flex rounded-full border border-white/80 px-8 py-3 text-sm font-semibold text-white hover:bg-white hover:text-teal-700"
          to={buttonTo}
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
};

const FormPanel = ({
  eyebrow,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  error,
  submitLabel,
  submittingLabel,
  isSubmitting,
  footerText,
  footerLinkLabel,
  footerLinkTo
}) => {
  return (
    <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-normal text-teal-700">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-gray-950">
            {title}
          </h1>
        </div>

        <Alert type="error">{error}</Alert>

        <form className="space-y-5" onSubmit={onSubmit}>
          {fields.map((field) => (
            <AuthInput
              key={field.name}
              {...field}
              value={values[field.name]}
              onChange={onChange}
              disabled={isSubmitting}
            />
          ))}

          <button
            className="w-full rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {footerText}{' '}
          <Link
            className="font-semibold text-teal-700 hover:text-teal-800"
            to={footerLinkTo}
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
};

const AuthPage = ({
  eyebrow = 'Task Manager',
  backgroundImage,
  panelHeading,
  panelSubtext,
  panelButtonLabel,
  panelButtonTo,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  error,
  submitLabel,
  submittingLabel,
  isSubmitting,
  footerText,
  footerLinkLabel,
  footerLinkTo
}) => {
  const hasBackgroundImage = Boolean(backgroundImage);

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8 ${
        hasBackgroundImage ? 'bg-slate-900' : 'bg-gray-100'
      }`}
    >
      {hasBackgroundImage && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-950/30"
          />
        </>
      )}

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white/95 shadow-2xl ring-1 ring-white/40 backdrop-blur md:grid-cols-2">
        <BrandingPanel
          heading={panelHeading}
          subtext={panelSubtext}
          buttonLabel={panelButtonLabel}
          buttonTo={panelButtonTo}
        />
        <FormPanel
          eyebrow={eyebrow}
          title={title}
          fields={fields}
          values={values}
          onChange={onChange}
          onSubmit={onSubmit}
          error={error}
          submitLabel={submitLabel}
          submittingLabel={submittingLabel}
          isSubmitting={isSubmitting}
          footerText={footerText}
          footerLinkLabel={footerLinkLabel}
          footerLinkTo={footerLinkTo}
        />
      </div>
    </main>
  );
};

export default AuthPage;
