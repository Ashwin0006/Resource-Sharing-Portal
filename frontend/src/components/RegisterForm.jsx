import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
    else {
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="hexagon-wrapper">
      <div className="hexagon-content">
        <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-pink-400/50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-6 text-white font-medium bg-red-500/20 p-2 rounded-lg border border-red-400/50">{message}</p>
        )}

        <p className="text-center mt-6 text-white">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-white hover:text-yellow-300 underline transition-colors duration-200"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
