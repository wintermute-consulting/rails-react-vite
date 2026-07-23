export default function AuthLayout({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col items-center gap-2 text-center">
          {Icon && (
            <span className="rounded-full bg-indigo-50 p-3">
              <Icon className="h-6 w-6 text-indigo-600" />
            </span>
          )}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export const fieldClass =
  "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export const buttonClass =
  "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50";
