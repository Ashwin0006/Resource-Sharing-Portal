import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { register } = useAuth();

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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const result = await register(
      formData.username, 
      formData.email, 
      formData.password
    );
    
    if (!result.success) {
      setMessage(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-2 rounded-lg"
          required
        />

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border p-2 rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && (
        <p className="text-center mt-4 text-red-600 font-medium">{message}</p>
      )}

      <p className="text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline"
        >
          Login here
        </button>
      </p>
    </div>
  );
}
