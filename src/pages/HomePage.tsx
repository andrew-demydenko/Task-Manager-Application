import { useEffect } from "react";
import { getUser } from "@/services/userService";

export default function HomePage() {
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser("admin");
      console.log("User fetched:", user);
    };

    fetchUser();
  }, []);

  return <div className="bg-black text-white">Home Page</div>;
}
