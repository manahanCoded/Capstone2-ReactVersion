import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MaxWidthWrapper from "./MaxWidthWrapper";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axios from "axios";
import "react-quill-new/dist/quill.snow.css"

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(false);
  const location = useLocation();

  const [displayAnnouncement, setDisplayAnnouncement] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [notification, setNotification] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate()

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
        setUser(null);
      }
    }
    checkUser();
  }, [navigate]);

  function openProfile() {
    setProfile(!profile);
    setNotification(false)
  }

  function openNotification() {
    setNotification(!notification)
    setProfile(false);
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


  useEffect(() => {
    const fetchAllAnnouncement = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/announcement/allAnnouncements");

        if (res.status === 200) {
          setDisplayAnnouncement(res.data);
        } else {
          console.error("Failed to fetch all announcements");
        }
      } catch (error) {
        console.error("Error fetching all announcements:", error);
      }
    };

    fetchAllAnnouncement();
  }, []);


  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <nav className="fixed inset-0 h-14 z-50">
      <MaxWidthWrapper className="h-14 flex justify-between items-center bg-white border-b-[1px] border-gray-400">
        <Link
          to="/"
          className="flex flex-row items-center justify-center text-xl font-semibold text-red-900"
        >
          <img
            className="h-6"
            src="/Icons/LOGO_Maroon.png"
            alt="Crypto Warriors"
          />
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
            to="/jobs-home"
            className={
              location.pathname === "/jobs" || location.pathname === "/jobs-home"
                ? "px-2 h-full md:block hidden border-b-[3px] border-red-900"
                : "px-2 h-full md:block hidden hover:border-b-[3px] border-red-900"
            }
          >
            Jobs
          </Link>
          <Link
            to="/quetion-answer"
            className={
              location.pathname === "/quetion-answer"
                ? "px-2 h-full md:block hidden border-b-[3px] border-red-900"
                : "px-2 h-full md:block hidden hover:border-b-[3px] border-red-900"
            }
          >
            Q&A
          </Link>
        </div>
        {user ? (
          <div className="flex flex-row py-2 items-center gap-x-4">
            <button
              className="h-10 w-10 rounded-full bg-gray-200"
              onClick={openNotification}
            >
              {notification ?
                <NotificationsIcon  />
                :
                <NotificationsNoneIcon  />
              }
            </button>
            <div>
            <button
              className="relative h-14 hover:text-red-900"
              onClick={openProfile}
            >
              {
                user.image ?
                  <img
                    src={`data:${user.file_mime_type};base64,${user.image}`
                    }
                    className="h-10 w-10 object-cover rounded-full"
                    alt="Profile Picture"
                  /> :
                  <AccountCircleIcon style={{ width: "2.5rem", height: "2.5rem", color: "rgb(69 10 10 / var(--tw-text-opacity, 1))" }} />
              }
            </button>
              <ExpandMoreIcon className="absolute p-0.5 bottom-1 md:right-6 right-2 rounded-full bg-slate-100"/>
            </div>
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
                    to={`/jobs/create-job`}
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
                  className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center cursor-pointer py-2 px-4 group hover:bg-red-900"
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
            className="text-sm py-2 px-4 rounded bg-red-900 hover:bg-red-950 text-white"
          >
            Login
          </Link>
        )}
      </MaxWidthWrapper>
      {notification ?
        <div className="absolute top-14 md:right-7 right-2 text-xs h-40 overflow-y-auto border-gray-300 border-[1px]">
          {displayAnnouncement.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              className="p-4 border-y-[1px] bg-white shadow-lg  cursor-pointer "
            >
              <h2 className="font-semibold">{announcement.title}</h2>
              <p className="text-gray-600 truncate">{announcement.content}</p>
            </div>
          ))}
        </div>
        :
        null
      }

      {isModalOpen && (
        <section className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="h-[60vh] bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{selectedAnnouncement?.title}</h2>
            <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: selectedAnnouncement.description }}></p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </section>
      )}

    </nav>
  );
};

export default Navbar;
