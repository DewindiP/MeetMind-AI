import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      toast.success("Your account has been created!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create your account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-navy">
          Create your account
        </h2>
        <p className="mt-2 text-text-secondary">
          Start organising your meetings with MeetMind-AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "name", label: "Full name", type: "text", auto: "name" },
          { name: "email", label: "Email address", type: "email", auto: "email" },
          { name: "password", label: "Password", type: "password", auto: "new-password" },
          { name: "confirmPassword", label: "Confirm password", type: "password", auto: "new-password" },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-2 block text-sm font-medium">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.auto}
              required
              minLength={field.name.includes("password") ? 8 : undefined}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-gold px-5 py-3 font-semibold text-brand-navy transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-navy hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
