
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Users } from 'lucide-react';

import Alert from './Alert.jsx';

const baseInputClassName =
  'mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60';

const AuthInput = ({ label, ...inputProps }) => {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300">{label}</span>
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
    <section className="relative hidden min-h-[680px] overflow-hidden bg-slate-950 px-10 py-12 text-white md:flex md:flex-col md:justify-between">
      {/* Decorative background */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
            <ShieldCheck className="text-cyan-400" size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Team Task Manager
            </p>
            <p className="text-xs text-slate-500">
              Work smarter. Stay organized.
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400">
          <Users size={14} />
          <span>Team workspace</span>
        </div>

        <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
          {heading}
        </h2>

        <p className="mt-5 text-sm leading-7 text-slate-400">
          {subtext}
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 size={17} className="shrink-0 text-cyan-400" />
            Organize projects and tasks
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 size={17} className="shrink-0 text-cyan-400" />
            Collaborate with your team
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 size={17} className="shrink-0 text-cyan-400" />
            Track progress in one place
          </div>
        </div>

        <Link
          className="mt-9 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-400"
          to={buttonTo}
        >
          {buttonLabel}
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="relative flex items-center gap-2 text-xs text-slate-600">
        <ShieldCheck size={14} />
        Secure team workspace
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
    <section className="flex min-h-[680px] items-center justify-center bg-slate-900 px-6 py-10 sm:px-10 lg:px-12">
      <div className="w-full max-w-md">
        {/* Mobile branding */}
        <div className="mb-10 flex items-center gap-3 md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <ShieldCheck size={21} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Team Task Manager
            </p>
            <p className="text-xs text-slate-500">
              Work smarter. Stay organized.
            </p>
          </div>
        </div>

        <div className="mb-8">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {title === 'Sign In'
              ? 'Welcome back. Sign in to continue to your workspace.'
              : 'Create your account and start managing your work.'}
          </p>
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}

            {!isSubmitting && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          {footerText}{' '}
          <Link
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
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
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_35%)]" />

      {backgroundImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Auth container */}
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40 md:grid-cols-2">
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
