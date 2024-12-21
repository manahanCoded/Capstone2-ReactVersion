import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminEmail from "./admin-email/AdminEmail";
import UserEmail from "./user-email/UserEmail";

export default function Email() {
  const navigate = useNavigate(); 
  const [checkAdmin, setCheckAdmin] = useState(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
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
  }, [navigate]); 

  if (checkAdmin?.role === "admin") {
    return <AdminEmail />;
  } else {
    return <UserEmail />;
  }
}
