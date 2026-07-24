import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyIcon } from "@heroicons/react/24/outline";
import AuthLayout, { buttonClass, fieldClass } from "~/components/AuthLayout";
import FormError from "~/components/FormError";
import { api } from "~/lib/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordToken = params.get("reset_password_token");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.put("/users/password", {
        user: {
          reset_password_token: resetPasswordToken,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password" icon={KeyIcon}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormError message={error} />
        {!resetPasswordToken && (
          <FormError message="Missing reset token. Please use the link from your email." />
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            New password
          </label>
          <input
            type="password"
            className={fieldClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Confirm new password
          </label>
          <input
            type="password"
            className={fieldClass}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={buttonClass}
          disabled={submitting || !resetPasswordToken}
        >
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
      <p className="text-center text-sm">
        <Link className="text-indigo-600 hover:underline" to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
