import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function HomePage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login("fake_token");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/projects");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container h-screen mx-auto p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>

      <button
        onClick={handleLogin}
        className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded"
      >
        Authorization
      </button>
    </div>
  );
}
