import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MaxWidthWrapper from "./MaxWidthWrapper";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(false);

  const location = useLocation();

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    }
    checkUser();
  }, []);

  function openProfile() {
    setProfile(!profile);
  }

  async function Logout_User() {
    try {
      const response = await fetch("http://localhost:5000/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }

      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  return (
    <nav className="fixed inset-0 h-14 z-50">
      <MaxWidthWrapper className="h-14 flex justify-between items-center bg-white border-b-2">
        <Link
          to="/"
          className="flex flex-row items-center justify-center text-xl font-semibold text-red-900"
        >
          <img
            className="h-14"
            src="https://substackcdn.com/image/fetch/w_96,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F051da1ed-7e17-4ab0-9645-3510a8958a7a_1000x1000.png"
            alt="Crypto Warriors"
          />
          Crypto Warriors
        </Link>
        <div className="h-full pt-4 flex justify-between items-center gap-12">
          <Link
            to="/modules"
            className={
              location.pathname === "/modules"
                ? "px-2 h-full md:block hidden border-b-[3px] border-red-900"
                : "px-2 h-full md:block hidden hover:border-b-[3px] border-red-900"
            }
          >
            Modules
          </Link>
          <Link
            to="/games"
            className={
              location.pathname === "/games"
                ? "px-2 h-full md:block hidden border-b-[3px] border-red-900"
                : "px-2 h-full md:block hidden hover:border-b-[3px] border-red-900"
            }
          >
            Games
          </Link>
          <Link
            to="/forum"
            className={
              location.pathname === "/forum"
                ? "px-2 h-full md:block hidden border-b-[3px] border-red-900"
                : "px-2 h-full md:block hidden hover:border-b-[3px] border-red-900"
            }
          >
            Forum
          </Link>
          <Link
            to="/quetion"
            className={
              location.pathname === "/quetion"
                ? "px-2 h-full md:block hidden border-b-[3px] border-red-900"
                : "px-2 h-full md:block hidden hover:border-b-[3px] border-red-900"
            }
          >
            Q&A
          </Link>
        </div>
        {user ? (
          <div>
            <button
              className="h-full hover:text-red-900"
              onClick={openProfile}
            >
              <ArrowDropDownIcon />
              {user.email}
            </button>
            <section
              className={
                profile ? "absolute top-14 md:right-7 right-2" : "hidden"
              }
            >
              <div className="flex w-60 py-2 flex-col items-center bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                {user.role === "admin" ? (
                  <Link
                    to={`/modules/create-module`}
                    onClick={openProfile}
                    className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                  >
                    <p className=" group-hover:text-white">
                      Create Module
                    </p>
                    <ExitToAppIcon className="group-hover:text-white" />
                  </Link>
                ) : null}
                {user.role === "admin" ? (
                  <Link
                    to={`/forum/create-job`}
                    onClick={openProfile}
                    className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                  >
                    <p className="line line-clamp-1 group-hover:text-white">
                      Create Job/ Announcement
                    </p>
                    <ExitToAppIcon className="group-hover:text-white" />
                  </Link>
                ) : null}
                {user.role === "admin" ? (
                  <Link
                    to={`/user/accounts-dashboard`}
                    onClick={openProfile}
                    className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                  >
                    <p className=" group-hover:text-white">
                      Application Dashboard
                    </p>
                    <ExitToAppIcon className="group-hover:text-white" />
                  </Link>
                ) : null}
                <Link
                  to={`/email`}
                  onClick={openProfile}
                  className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                >
                  <p className=" group-hover:text-white">Email</p>
                  <ExitToAppIcon className="group-hover:text-white" />
                </Link>
                <Link
                  to={`/profile`}
                  onClick={openProfile}
                  className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                >
                  <p className=" group-hover:text-white">Profile</p>
                  <ExitToAppIcon className="group-hover:text-white" />
                </Link>
                <div
                  className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                  onClick={Logout_User}
                >
                  <p className=" group-hover:text-white">Logout</p>
                  <ExitToAppIcon className="group-hover:text-white" />
                </div>
              </div>
            </section>
          </div>
        ) : (
          <Link
            to="/user/login"
            className="py-2 px-4 rounded bg-red-900 hover:bg-red-950 text-white"
          >
            Login
          </Link>
        )}
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
