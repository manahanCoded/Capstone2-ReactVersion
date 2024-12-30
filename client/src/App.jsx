import { Routes, Route } from "react-router-dom";  // Import these
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import ModulesPage from "./pages/modules/Modules";
import Games from "./pages/games/Games";
import GuessingGame from "./pages/games/guessing-game/guess";
import HangmanGame from "./pages/games/hangman/Hangman";
import Scramble from "./pages/games/scramble/Scramble";
import TypingGame from "./pages/games/typing-game/Typing";
import Modules from "./pages/modules/Docs";
import { Toaster } from "@/components/ui/toaster"

import CreateModulePage from "./pages/modules/create-module/CreateModule";
import ForumPage from "./pages/forum/Forum";
import CheckJobPage from "./pages/forum/checkJob";
import CreateJobPage from "./pages/forum/create-job/CreateJob";
import EditJobPage from "./pages/forum/edit-job/EditJob";
import Email from "./pages/email/Email";
import AccountsDashboard from "./pages/users/accounts-dashboard/AccountsDashboard";
import Profile from "./pages/profile/Profile";
import Edit from "./pages/modules/edit-module/Edit";



function App() {
  return (
    <div className="w-screen font-poppins">
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/accounts-dashboard" element={<AccountsDashboard />} />

        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/modules/docs/:id" element={<Modules />} />
        <Route path="/modules/create-module" element={<CreateModulePage />} />
        <Route path="/modules/edit/:editPostID" element={<Edit />} />

        <Route path="/games" element={<Games />} />
        <Route path="/games/guessing-game" element={<GuessingGame />} />
        <Route path="/games/hangman" element={<HangmanGame />} />
        <Route path="/games/scramble" element={<Scramble />} />
        <Route path="/games/typing-game" element={<TypingGame />} />


        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/jobDetails/:jobsID" element={<CheckJobPage />} />
        <Route path="/forum/create-job" element={<CreateJobPage />} />
        <Route path="/forum/edit-Job/:jobEditID" element={<EditJobPage />} />

        <Route path="/email" element={<Email />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>
    </div>
  );
}

export default App;
