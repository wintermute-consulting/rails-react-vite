import { Link } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { buttonClass } from "~/components/AuthLayout";
import { useAuth } from "~/lib/auth";

export default function Home() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="p-8 text-gray-500">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Rails + React + Vite
      </h1>

      {user ? (
        <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-gray-700">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
          <button className={buttonClass} onClick={signOut}>
            <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            to="/login"
          >
            Sign in
          </Link>
          <Link
            className="rounded-md px-4 py-2 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-600 hover:bg-indigo-50"
            to="/signup"
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
