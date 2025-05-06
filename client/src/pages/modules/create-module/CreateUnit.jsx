import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ExitToApp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateUnitPage() {
  const [typeForm, setTypeForm] = useState("createModule");
  const [unitPlace, setUnitPlace] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState({
    title: "",
    description: "",
    information: "",
    storage_section_id: "",
    publisher: ""
  });

  const [questions, setQuestions] = useState([
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
  ]);

  // State for dialogs and loading
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Check admin status and fetch module data
  useEffect(() => {
    async function handleCheckAdmin() {
      try {
        const res = await fetch(`${API_URL}/api/user/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/user/login");
          return;
        }

        const data = await res.json();
        if (data.role === "client") {
          navigate("/modules");
          return;
        }

        const moduleData = await axios.get(`${API_URL}/api/module/allModule-storage/${id}`);
        if (moduleData.data.success) {
          setUnitPlace(moduleData.data.listall[0]);
          setUserInfo(prev => ({
            ...prev,
            publisher: data.id,
            storage_section_id: moduleData.data.listall[0].id,
          }));
        } else {
          setSnackbar({
            open: true,
            message: "Module not found",
            severity: "error"
          });
          setUnitPlace(null);
        }
      } catch (err) {
        console.error("An error occurred:", err);
        setSnackbar({
          open: true,
          message: "Failed to fetch user profile",
          severity: "error"
        });
      }
    }

    handleCheckAdmin();
  }, [navigate, id]);

  const onChangeValue = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onDescription = (value) => {
    setUserInfo({ ...userInfo, description: value });
  };

  const onInformation = (value) => {
    setUserInfo({ ...userInfo, information: value });
  };


  const validateModule = () => {
    if (!userInfo.title.trim()) {
      setSnackbar({
        open: true,
        message: "Title is required",
        severity: "error"
      });
      return false;
    }
    if (userInfo.description.length < 50) {
      setSnackbar({
        open: true,
        message: "Description must be at least 50 characters long",
        severity: "error"
      });
      return false;
    }
    if (userInfo.information.length < 50) {
      setSnackbar({
        open: true,
        message: "Information must be at least 50 characters long",
        severity: "error"
      });
      return false;
    }
    return true;
  };


  const handleModuleSubmit = (e) => {
    e.preventDefault();
    if (!validateModule()) return;
    setOpenModuleDialog(true);
  };


  const confirmCreateModule = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/module/addModule`, {
        title: userInfo.title,
        description: userInfo.description,
        information: userInfo.information,
        storage_section_id: userInfo.storage_section_id,
        publisher: userInfo.publisher
      });

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: "Unit created successfully!",
          severity: "success"
        });
        setTypeForm("createQuiz");
      } else {
        setSnackbar({
          open: true,
          message: res.data.error || "Failed to create unit",
          severity: "error"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to create unit",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
      setOpenModuleDialog(false);
    }
  };


  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 5) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } else {
      setSnackbar({
        open: true,
        message: "Minimum of 5 questions required",
        severity: "error"
      });
    }
  };


  const validateQuiz = () => {
    if (!userInfo.title) {
      setSnackbar({
        open: true,
        message: "Please create a module first",
        severity: "error"
      });
      return false;
    }
    if (questions.length < 5) {
      setSnackbar({
        open: true,
        message: "Minimum of 5 questions required",
        severity: "error"
      });
      return false;
    }

    for (const question of questions) {
      if (!question.question_text.trim()) {
        setSnackbar({
          open: true,
          message: "All questions must have text",
          severity: "error"
        });
        return false;
      }
      if (!question.correct_option) {
        setSnackbar({
          open: true,
          message: "All questions must have a correct option selected",
          severity: "error"
        });
        return false;
      }
      for (const opt of ["option_a", "option_b", "option_c", "option_d"]) {
        if (!question[opt].trim()) {
          setSnackbar({
            open: true,
            message: "All options must be filled for each question",
            severity: "error"
          });
          return false;
        }
      }
    }
    return true;
  };


  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!validateQuiz()) return;
    setOpenQuizDialog(true);
  };


  const confirmCreateQuiz = async () => {
    setIsLoading(true);
    try {
      const module_title = userInfo.title;
      const validQuestions = questions.map(question => ({
        ...question,
        correct_option: {
          option_a: 'A',
          option_b: 'B',
          option_c: 'C',
          option_d: 'D',
        }[question.correct_option] || ''
      }));

      const response = await axios.post(`${API_URL}/api/module/addQuestions`, {
        module_title,
        questions: validQuestions,
      });

      setSnackbar({
        open: true,
        message: "Quiz created successfully!",
        severity: "success"
      });
      setTimeout(() => navigate(`/modules/units/${userInfo.storage_section_id}`), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to create quiz",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
      setOpenQuizDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [isEditingHTMLDescription, setIsEditingHTMLDescription] = useState(false);
  const [isEditingHTMLInformation, setIsEditingHTMLInformation] = useState(false);

  return (
    <div className="mt-14 container mx-auto">
    
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

 
      <section className="text-sm">
        <MaxWidthWrapper className="h-16 flex justify-between items-center border-b-2">
          <div className="h-16 flex flex-row">
            <div
              className={typeForm === "createModule" ? "px-4 flex items-center cursor-pointer text-white bg-red-900" : "px-4 flex items-center cursor-pointer"}
              onClick={() => setTypeForm("createModule")}
            >
              <p>Create Unit</p>
            </div>
            <div
              className={typeForm === "createQuiz" ? "px-4 flex items-center cursor-pointer text-white bg-red-900" : "px-4 flex items-center cursor-pointer"}
              onClick={() => {
                if (!userInfo.title) {
                  setSnackbar({
                    open: true,
                    message: "Please create a unit first",
                    severity: "error"
                  });
                  return;
                }
                setTypeForm("createQuiz");
              }}
            >
              <p>Create Quiz</p>
            </div>
          </div>

          <Link
            to={`/modules/units/${userInfo.storage_section_id}`}
            className="flex gap-1 items-center p-2 rounded-lg border-2 border-red-900 text-red-900 hover:bg-red-900 hover:border-red-900 hover:text-white"
          >
            <ExitToApp />
            {typeForm === "createQuiz" ? "No Questions" : "Discard"}
          </Link>
        </MaxWidthWrapper>
      </section>


      <form
        onSubmit={handleModuleSubmit}
        className={typeForm === "createModule" ? "m-auto bg-white shadow-md rounded lg:px-8 pt-6 pb-8 mb-4" : "hidden"}
      >
        <MaxWidthWrapper>
    
          <div className="mb-4">
            <h3 className="text-3xl mb-6 font-semibold">{unitPlace.name}</h3>
            <label className="block text-gray-700 font-semibold mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={userInfo.title}
              onChange={onChangeValue}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Unit title"
              required
            />
          </div>


          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 mb-2">
              <EditorToolbar toolbarId="t1" />
              <button
                type="button"
                onClick={() => setIsEditingHTMLDescription(!isEditingHTMLDescription)}
                className="text-sm bg-gray-600 text-white py-3 px-3 rounded hover:bg-gray-700"
              >
                {isEditingHTMLDescription ? "Switch to Editor" : "Edit HTML"}
              </button>
            </div>
            {isEditingHTMLDescription ? (
              <textarea
                className="w-full p-2 border rounded h-[70vh]"
                value={userInfo.description}
                onChange={(e) => setUserInfo({ ...userInfo, description: e.target.value })}
                placeholder="Edit raw HTML here..."
              />
            ) : (
              <ReactQuill
                theme="snow"
                value={userInfo.description}
                onChange={onDescription}
                placeholder="Write something awesome..."
                modules={modules("t1")}
                formats={formats}
                className="bg-white border rounded h-[70vh] overflow-y-auto"
              />
            )}
          </div>


          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Information
            </label>
            <div className="flex items-center gap-4 mb-2">
              <EditorToolbar toolbarId="t2" />
              <button
                type="button"
                onClick={() => setIsEditingHTMLInformation(!isEditingHTMLInformation)}
                className="text-sm bg-gray-600 text-white py-3 px-3 rounded hover:bg-gray-700"
              >
                {isEditingHTMLInformation ? "Switch to Editor" : "Edit HTML"}
              </button>
            </div>
            {isEditingHTMLInformation ? (
              <textarea
                className="w-full p-2 border rounded h-[70vh]"
                value={userInfo.information}
                onChange={(e) => setUserInfo({ ...userInfo, information: e.target.value })}
                placeholder="Edit raw HTML here..."
              />
            ) : (
              <ReactQuill
                theme="snow"
                value={userInfo.information}
                onChange={onInformation}
                placeholder="Write something more..."
                modules={modules("t2")}
                formats={formats}
                className="bg-white border rounded h-[70vh] overflow-y-auto"
              />
            )}
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-red-900 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-800"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Unit"}
            </button>
          </div>
        </MaxWidthWrapper>
      </form>


      <div className={typeForm === "createQuiz" ? "max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg" : "hidden"}>
        {userInfo.title ? (
          <h2 className="text-2xl font-semibold text-center py-6">
            Create Questions for Unit: {userInfo.title} (Minimum of 5)
          </h2>
        ) : (
          <h2 className="text-2xl font-semibold text-center py-6 text-red-800">
            Please create a Unit first.
          </h2>
        )}

        <form onSubmit={handleQuizSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="my-6 border-b-[1px]">
              <div className="flex justify-between">
                <label className="block text-gray-700 font-bold mb-2">
                  Question {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove Question
                </button>
              </div>
              <input
                type="text"
                name="question_text"
                value={question.question_text}
                onChange={(e) => handleChange(e, index)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                placeholder="Enter your question here"
              />
              <input
                type="text"
                name="option_a"
                value={question.option_a}
                onChange={(e) => handleChange(e, index)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                placeholder="Option A"
              />
              <input
                type="text"
                name="option_b"
                value={question.option_b}
                onChange={(e) => handleChange(e, index)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                placeholder="Option B"
              />
              <input
                type="text"
                name="option_c"
                value={question.option_c}
                onChange={(e) => handleChange(e, index)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                placeholder="Option C"
              />
              <input
                type="text"
                name="option_d"
                value={question.option_d}
                onChange={(e) => handleChange(e, index)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                placeholder="Option D"
              />
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Correct Option
                </label>
                <select
                  name="correct_option"
                  required
                  value={question.correct_option}
                  onChange={(e) => handleChange(e, index)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                >
                  <option value="">Select Correct Option</option>
                  <option value="option_a">Option A</option>
                  <option value="option_b">Option B</option>
                  <option value="option_c">Option C</option>
                  <option value="option_d">Option D</option>
                </select>
              </div>
            </div>
          ))}

          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="border-red-900 border-2 text-red-900 py-2 px-4 rounded-lg hover:text-white hover:bg-red-900"
            >
              Add Question
            </button>

            {userInfo.title ? (
              <button
                type="submit"
                className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Submit Questions"}
              </button>
            ) : (
              <button
                type="button"
                className="bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setTypeForm("createModule")}
              >
                Create Unit First
              </button>
            )}
          </div>
        </form>
      </div>

 
      <Dialog
        open={openModuleDialog}
        onClose={() => setOpenModuleDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold">Confirm Unit Creation</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to create this unit?
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800">
                "{userInfo.title}"
              </p>
              <p className="text-blue-600 mt-2">
                This will create a new learning unit that will be immediately visible to users.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setOpenModuleDialog(false)}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmCreateModule}
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? "Creating..." : "Confirm Creation"}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openQuizDialog}
        onClose={() => setOpenQuizDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold">Confirm Quiz Creation</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to create this quiz?
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800">
                For Unit: "{userInfo.title}"
              </p>
              <p className="text-blue-600 mt-2">
                This will create {questions.length} questions that will be immediately available for the unit.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setOpenQuizDialog(false)}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmCreateQuiz}
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? "Creating..." : "Confirm Creation"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}