import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setMessage(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded-lg"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && (
        <p className="text-center mt-4 text-red-600 font-medium">{message}</p>
      )}

      <p className="text-center mt-4 text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:underline"
        >
          Register here
        </button>
      </p>
    </div>
  );
}
