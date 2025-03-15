import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MaxWidthWrapper from './MaxWidthWrapper'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import 'react-quill-new/dist/quill.snow.css'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(false)
  const location = useLocation()

  const [displayAnnouncement, setDisplayAnnouncement] = useState([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [notification, setNotification] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [menu, setMenu] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch(`${API_URL}/api/user/profile`, {
          method: 'GET',
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      }
    }
    checkUser()
  }, [navigate])

  function openProfile() {
    setProfile(!profile)
    setNotification(false)
  }

  function openNotification() {
    setNotification(!notification)
    setProfile(false)
  }

  async function Logout_User() {
    try {
      const response = await fetch(`${API_URL}/api/user/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`)
      }

      window.location.reload()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  useEffect(() => {
    const fetchAllAnnouncement = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/announcement/allAnnouncements`
        )

        if (res.status === 200) {
          setDisplayAnnouncement(res.data.announcement)
        } else {
          console.error('Failed to fetch all announcements')
        }
      } catch (error) {
        console.error('Error fetching all announcements:', error)
      }
    }

    fetchAllAnnouncement()
  }, [])

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAnnouncement(null)
  }


  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  function timeAgo(timestamp) {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""}  ago`;
    }
    return "Just now";
  }


  return (
    <nav className="fixed inset-0 h-14 z-50">
      <div className="h-14 px-3.5 md:px-8 flex justify-between items-center bg-white border-b-[1px] border-gray-400">
        <div className='flex flex-row gap-2 items-center md:hidden'>
          <div className={`relative p-1 rounded-full cursor-pointer hover:bg-gray-300 md:hidden`}>
            <MenuOutlinedIcon
              style={{ fontSize: "1.5rem" }}
              onClick={() => setMenu(!menu)} />
            <div className={`${menu ? "block" : "hidden"} w-36 absolute top-11 left-0 z-30 flex flex-col  rounded-lg overflow-hidden text-sm bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]`}>
              <Link
                to="/modules"
                className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                Modules
              </Link>
              <Link
                to="/games"
                className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                Games
              </Link>
              <a
                href="https://cryptowarriorssimulation.netlify.app/"
                className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                Demo
              </a>
              <Link
                to="/jobs-home"
                className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                Jobs
              </Link>
              <Link
                to="/forum"
                className="flex flex-row items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                Forum
              </Link>
            </div>
          </div>
          <Link
            to="/"
            className=""
          >
            <img
              className="h-12 md:hidden"
              src="/IMG_Jobs/icon_maroon.png"
              alt="Crypto Warriors"
            />
          </Link>
        </div>
        <Link
          to="/"
          className=""
        >
          <img
            className="h-6 hidden md:block"
            src="/Icons/LOGO_Maroon.png"
            alt="Crypto Warriors"
          />
        </Link>
        <div className="h-full pt-4 flex justify-between items-center gap-12">
          <Link
            to="/modules"
            className={
              location.pathname === '/modules'
                ? 'px-2 h-full md:block hidden border-b-[3px] border-red-900'
                : 'px-2 h-full md:block hidden hover:border-b-[3px] border-red-900'
            }
          >
            Modules
          </Link>
          <Link
            to="/games"
            className={
              location.pathname === '/games'
                ? 'px-2 h-full md:block hidden border-b-[3px] border-red-900'
                : 'px-2 h-full md:block hidden hover:border-b-[3px] border-red-900'
            }
          >
            Games
          </Link>
          <a
            href="https://cryptowarriorssimulation.netlify.app/"
            className="px-2 h-full md:block hidden hover:border-b-[3px] border-red-900"
          >
            Demo
          </a>
          <Link
            to="/jobs-home"
            className={
              location.pathname === '/jobs' ||
                location.pathname === '/jobs-home'
                ? 'px-2 h-full md:block hidden border-b-[3px] border-red-900'
                : 'px-2 h-full md:block hidden hover:border-b-[3px] border-red-900'
            }
          >
            Jobs
          </Link>
          <Link
            to="/forum"
            className={
              location.pathname === '/forum'
                ? 'px-2 h-full md:block hidden border-b-[3px] border-red-900'
                : 'px-2 h-full md:block hidden hover:border-b-[3px] border-red-900'
            }
          >
            Forum
          </Link>
        </div>
        {user ? (
          <div className="flex flex-row py-2 items-center gap-x-4">
            <button
              className="h-10 w-10 rounded-full bg-gray-200"
              onClick={openNotification}
            >
              {notification ? <NotificationsIcon /> : <NotificationsNoneIcon />}
            </button>
            <div>
              <button
                className="relative h-14 hover:text-red-900"
                onClick={openProfile}
              >
                {user.image ? (
                  <img
                    src={`data:${user.file_mime_type};base64,${user.image}`}
                    className="h-10 w-10 object-cover rounded-full"
                    alt="Profile Picture"
                  />
                ) : (
                  <AccountCircleIcon
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                    }}
                  />
                )}
              </button>
              <ExpandMoreIcon className="absolute p-0.5 bottom-1 md:right-6 right-2 rounded-full bg-slate-100" />
            </div>
            <section
              className={
                profile ? 'absolute top-14 md:right-7 right-2' : 'hidden'
              }
            >
              <div className="flex w-60  flex-col items-center rounded-lg overflow-hidden bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                {user.role === 'admin' ? (
                  <Link
                    to={`/modules/create-module`}
                    onClick={openProfile}
                    className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                  >
                    <p className=" group-hover:text-white">Create Module</p>
                    <ExitToAppIcon className="group-hover:text-white" />
                  </Link>
                ) : null}
                {user.role === 'admin' ? (
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
                {user.role === 'admin' ? (
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
                {user.role === 'admin' ? (
                  <Link
                    to={`/admin-email`}
                    onClick={openProfile}
                    className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                  >
                    <p className=" group-hover:text-white">Email</p>
                    <ExitToAppIcon className="group-hover:text-white" />
                  </Link>
                ) : (
                  <Link
                    to={`/user-email`}
                    onClick={openProfile}
                    className="text-sm w-full border-b-[1px] border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-red-900"
                  >
                    <p className=" group-hover:text-white">Email</p>
                    <ExitToAppIcon className="group-hover:text-white" />
                  </Link>
                )}
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
      </div>
      {
        notification && (
          <section className='absolute py-1 top-14 right-20 text-xs rounded-lg  bg-white overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <div className="max-h-60 w-60 overflow-y-auto">
            {displayAnnouncement.map((announcement) => (
              <div
                key={announcement.id}
                onClick={() => {
                  setNotification(false)
                  handleAnnouncementClick(announcement)
                }}
                className="text-sm w-full border-b cursor-pointer border-gray-300 flex flex-row justify-between items-center py-2 px-4 group hover:bg-gray-100"
              >
                <h2 className=" truncate line-clamp-1">{announcement.title}</h2>
              </div>
            ))}
          </div>
          </section>
        )
      }

      {
        isModalOpen && (
          <MaxWidthWrapper className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
            <div className="h-[42rem] lg:w-[80vw] w-full bg-white  rounded-lg shadow-lg  ">
              <section className='flex flex-row justify-between border-b px-6 py-2 pt-3 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                <h3 className='text-xl font-bold tracking-wide text-red-900'>Notification</h3>
                <button
                  onClick={closeModal}
                  className="p-1 cursor-pointer  rounded-full hover:bg-gray-300"
                >
                  <CloseIcon />
                </button>
              </section>
              <section className='h-full w-full flex md:flex-row flex-col md:py-4 px-2 py-1 gap-2'>
                <div className="relative ">

                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-full flex justify-between items-center mb-2 p-3 bg-white rounded-lg border border-gray-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                  >
                    <span>{selectedAnnouncement?.title? selectedAnnouncement.title: "Announcement"}</span>
                    {isOpen ? <ExpandMoreIcon size={20} /> : <ExpandLessIcon size={20} />}
                  </button>
                  <div className={`md:h-[90%] h-[60%] md:block hidden overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}>
                  <div className={`h-full overflow-y-scroll md:pr-3 md:block w-full `}>
                    {displayAnnouncement.map((announcement) => (
                      <div
                        key={announcement.id}
                        onClick={() => {
                          setIsOpen(!isOpen)
                          handleAnnouncementClick(announcement)
                        }}
                        className="md:w-56 w-full overflow-hidden text-sm border-b border-gray-300 cursor-pointer flex flex-row justify-between gap-2 items-center py-2 px-4 group hover:bg-red-900"
                      >
                        <div className="flex flex-row gap-2 items-center">
                          {announcement?.image ? (
                            <img
                              src={announcement?.image}
                              className="h-10 w-10 object-cover rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                              alt="Profile Picture"
                            />
                          ) : (
                            <AccountCircleIcon
                              style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                              }}
                            />
                          )}
                          <div className="text-xs">
                            <p className="group-hover:text-white font-bold truncate line-clamp-1">
                              {announcement.name ? announcement.name : announcement.email}
                            </p>
                            <p className="group-hover:text-white break-words line-clamp-1">{announcement.title}</p>
                            <p className="group-hover:text-white text-gray-500 text-[0.7rem] truncate line-clamp-1">
                              {timeAgo(announcement.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                  <div className={`md:h-[90%] h-[60%]  md:hidden block  overflow-hidden ${isOpen ? 'block' : 'hidden'} shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}>
                  <div className={`h-full overflow-y-scroll md:pr-3 md:block w-full `}>
                    {displayAnnouncement.map((announcement) => (
                      <div
                        key={announcement.id}
                        onClick={() => {
                          setIsOpen(!isOpen)
                          handleAnnouncementClick(announcement)
                        }}
                        className="md:w-56 w-full overflow-hidden text-sm border-b border-gray-300 cursor-pointer flex flex-row justify-between gap-2 items-center py-2 px-4 group hover:bg-red-900"
                      >
                        <div className="flex flex-row gap-2 items-center">
                          {announcement?.image ? (
                            <img
                              src={announcement?.image}
                              className="h-10 w-10 object-cover rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                              alt="Profile Picture"
                            />
                          ) : (
                            <AccountCircleIcon
                              style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                color: 'rgb(69 10 10 / var(--tw-text-opacity, 1))',
                              }}
                            />
                          )}
                          <div className="text-xs">
                            <p className="group-hover:text-white font-bold truncate line-clamp-1">
                              {announcement.name ? announcement.name : announcement.email}
                            </p>
                            <p className="group-hover:text-white break-words line-clamp-1">{announcement.title}</p>
                            <p className="group-hover:text-white text-gray-500 text-[0.7rem] truncate line-clamp-1">
                              {timeAgo(announcement.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
                <div className='h-full w-full py-4'>
                  <div className="md:h-[90%] h-[80%]  w-full flex-1 px-2 overflow-y-auto">
                    {selectedAnnouncement ? (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {selectedAnnouncement.title}
                        </h2>
                        <div
                          className="prose text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: selectedAnnouncement.description,
                          }}
                        ></div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a notification to view details.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </MaxWidthWrapper>
        )
      }
    </nav >
  )
}

export default Navbar
