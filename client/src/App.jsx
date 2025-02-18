import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import ModulesPage from "./pages/modules/Modules";
import Games from "./pages/games/Games";
import GuessingGame from "./pages/games/guessing-game/Guess";
import HangmanGame from "./pages/games/hangman/Hangman";
import Scramble from "./pages/games/scramble/Scramble";
import TypingGame from "./pages/games/typing-game/Typing";
import DocsPage from "./pages/modules/Docs";
import CreateUnitPage from "./pages/modules/create-module/CreateUnit";
import JobPage from "./pages/job/Jobs";
import CheckJobPage from "./pages/job/CheckJob";
import CreateJobPage from "./pages/job/create-job/CreateJob";
import EditJobPage from "./pages/job/edit-job/EditJob";
import AccountsDashboard from "./pages/users/accounts-dashboard/AccountsDashboard";
import Profile from "./pages/profile/Profile";
import Edit from "./pages/modules/edit-module/Edit";
import Unit from "./pages/modules/Unit";
import CreateModulePage from "./pages/modules/create-module/CreateModule";
import JobHome from "./pages/job/Job-Home";
import ModulesDashboard from "./pages/users/accounts-dashboard/ModuleDashboard";
import Retrieve from "./pages/users/Retrieve";
import JobDashboard from "./pages/users/accounts-dashboard/JobDashboard";
import AnnouncementsDashboard from "./pages/users/accounts-dashboard/AnnouncementDashboard";
import Forum from "./pages/Forum/Forum";
import UserEmail from "./pages/email/user-email/UserEmail";
import AdminEmail from "./pages/email/admin-email/AdminEmail";



function App() {
  return (
    <div className="w-screen font-poppins">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/retrieve" element={<Retrieve />} />
        <Route path="/user/accounts-dashboard" element={<AccountsDashboard />} />
        <Route path="/user/modules-dashboard" element={<ModulesDashboard />} />
        <Route path="/user/jobs-dashboard" element={<JobDashboard />} />
        <Route path="/user/announcements-dashboard" element={<AnnouncementsDashboard />} />        

        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/modules/units/:id" element={<Unit />} />
        <Route path="/modules/units/docs/:id" element={<DocsPage />} />
        <Route path="/modules/create-module" element={<CreateModulePage />} />
        <Route path="/modules/create-unit/:id" element={<CreateUnitPage />} />
        <Route path="/modules/units/edit/:editPostID" element={<Edit />} />

        <Route path="/games" element={<Games />} />
        <Route path="/games/guessing-game" element={<GuessingGame />} />
        <Route path="/games/hangman" element={<HangmanGame />} />
        <Route path="/games/scramble" element={<Scramble />} />
        <Route path="/games/typing-game" element={<TypingGame />} />

        <Route path="/jobs-home" element={<JobHome />} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/jobs/jobDetails/:jobsID" element={<CheckJobPage />} />
        <Route path="/jobs/create-job" element={<CreateJobPage />} />
        <Route path="/jobs/edit-job/:jobEditID" element={<EditJobPage />} />

        <Route path="/forum" element={<Forum />} />


        <Route path="/user-email" element={<UserEmail />} />
        <Route path="/admin-email" element={<AdminEmail />} />
        
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </div>
  );
}

export default App;
