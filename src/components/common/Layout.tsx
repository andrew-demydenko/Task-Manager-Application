import { useNavigate, Link } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/providers/AuthProvider";

interface Layout {
  children: ReactNode;
}

export default function Layout({ children }: Layout) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <nav className="bg-gray-800 py-4 px-6">
        <div className="w-full flex justify-between items-center">
          <Link
            to="/projects"
            className="text-white hover:underline hover: text-lg font-bold"
          >
            Projects
          </Link>
          <div>
            <span className="text-white mr-4">{user ? user.name : ""}</span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
