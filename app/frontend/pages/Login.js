import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import AuthLayout, { buttonClass, fieldClass } from "~/components/AuthLayout";
import FormError from "~/components/FormError";
import { useAuth } from "~/lib/auth";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign in" icon={LockClosedIcon}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormError message={error} />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className={fieldClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={buttonClass} disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div className="flex justify-between text-sm">
        <Link className="text-indigo-600 hover:underline" to="/signup">
          Create an account
        </Link>
        <Link className="text-indigo-600 hover:underline" to="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </AuthLayout>
  );
}
