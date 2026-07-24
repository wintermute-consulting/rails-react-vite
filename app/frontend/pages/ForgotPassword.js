import { useState } from "react";
import { Link } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import AuthLayout, { buttonClass, fieldClass } from "~/components/AuthLayout";
import FormError from "~/components/FormError";
import { api } from "~/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/users/password", { user: { email } });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to set a new password."
      icon={EnvelopeIcon}
    >
      {sent ? (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          If that email exists, a reset link is on its way.
        </p>
      ) : (
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
          <button type="submit" className={buttonClass} disabled={submitting}>
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
      <p className="text-center text-sm">
        <Link className="text-indigo-600 hover:underline" to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
