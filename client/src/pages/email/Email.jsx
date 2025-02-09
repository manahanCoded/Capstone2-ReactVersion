import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminEmail from "./admin-email/AdminEmail";
import UserEmail from "./user-email/UserEmail";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Email() {
  const navigate = useNavigate();
  const [checkAdmin, setCheckAdmin] = useState(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/user/login");
          return;
        }

        const data = await res.json();
        setCheckAdmin(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            navigate("/user/login");
          }
        } else {
          alert("Failed to fetch user profile.");
          console.error(err);
        }
      }
    }

    checkUser();
  }, []);

  if (checkAdmin?.role === "admin") {
    return <AdminEmail />;
  } else {
    return <UserEmail />;
  }

}
