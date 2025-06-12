import { useEffect } from "react";
import { getUser } from "@/services/userService";
import { NavLink } from "react-router";

export default function HomePage() {
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser("admin");
      console.log("User fetched:", user);
    };

    fetchUser();
  }, []);

  return (
    <div>
      Home Page
      <div>
        <NavLink className="text-blue-500 hover:underline" to="/projects">
          Projects
        </NavLink>
      </div>
    </div>
  );
}
