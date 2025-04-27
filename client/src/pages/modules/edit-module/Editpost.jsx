import React, { useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ExitToApp } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditPost({ postList, editPostID }) {
  const navigate = useNavigate();
  const [checkAdminData, setCheckAdmin] = useState(null);

  const initialPostData = postList?.[0] || { title: "", description: "", information: "" };
  const [unitInfo, setUnitInfo] = useState(initialPostData);
  const [isError, setError] = useState(null);
  const [questions, setQuestions] = useState([
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" }
  ]);

  const [isRawHtmlDescription, setIsRawHtmlDescription] = useState(false);
  const [isRawHtmlInformation, setIsRawHtmlInformation] = useState(false);

  const [typeForm, setTypeForm] = useState("createModule");
  const [isLoading, setIsLoading] = useState(false);

  // Confirmation dialog states
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openQuestionSaveDialog, setOpenQuestionSaveDialog] = useState(false);
  const [openQuestionDeleteDialog, setOpenQuestionDeleteDialog] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    async function handleCheckAdmin() {
      setIsLoading(true);
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
        }
      } catch (err) {
        console.error("An error occurred:", err);
      } finally {
        setIsLoading(false);
      }
    }

    handleCheckAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!unitInfo.id) return;
    async function fetchQuestions() {
      try {
        const res = await axios.get(
          `${API_URL}/api/module/allQuestions?id=${encodeURIComponent(unitInfo.id)}`
        );
        setQuestions(res.data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, [unitInfo.id]);

  const onChangeValue = (e) => {
    setUnitInfo({
      ...unitInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onDescriptionChange = (value) => {
    setUnitInfo({
      ...unitInfo,
      description: value,
    });
  };

  const onInformationChange = (value) => {
    setUnitInfo({
      ...unitInfo,
      information: value,
    });
  };

  const toggleRawHtmlDescription = () => {
    setIsRawHtmlDescription(!isRawHtmlDescription);
  };

  const toggleRawHtmlInformation = () => {
    setIsRawHtmlInformation(!isRawHtmlInformation);
  };

  const validateForm = () => {
    if (!unitInfo.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!unitInfo.description || unitInfo.description.length < 50) {
      setError("Description must be at least 50 characters");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setOpenSaveDialog(true);
  };

  const confirmSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/module/editModule`, {
        title: unitInfo.title,
        description: unitInfo.description,
        information: unitInfo.information,
        ids: editPostID,
      });

      if (response.data.success === true) {
        setSnackbar({
          open: true,
          message: "Module updated successfully!",
          severity: "success"
        });
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to edit module",
        severity: "error"
      });
      console.error("Error editing module:", error);
    } finally {
      setIsLoading(false);
      setOpenSaveDialog(false);
    }
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/api/module/deleteModules/${editPostID}`);

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Module deleted successfully!",
          severity: "success"
        });
        setTimeout(() => navigate(-1), 1500);
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete module",
          severity: "error"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting module",
        severity: "error"
      });
      console.error("Error deleting module:", error);
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  // Quiz Edit Section
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index][name] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: null,
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
      },
    ]);
  };

  const handleRemoveQuestionClick = (index, question_id) => {
    if (questions.length <= 5) {
      setSnackbar({
        open: true,
        message: "Minimum of 5 questions required",
        severity: "error"
      });
      return;
    }
    setQuestionToDelete({ index, question_id });
    setOpenQuestionDeleteDialog(true);
  };


  const confirmQuestionDelete = async () => {
    const { index, question_id } = questionToDelete;

    if (question_id) {
      try {
        const response = await axios.delete(`${API_URL}/api/module/deleteQuestion/${question_id}`);
        if (response.status === 200) {
          const updatedQuestions = questions.filter((_, i) => i !== index);
          setQuestions(updatedQuestions);
          setSnackbar({
            open: true,
            message: "Question deleted successfully!",
            severity: "success"
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete question",
            severity: "error"
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error deleting question",
          severity: "error"
        });
        console.error("Error deleting question:", error);
      }
    } else {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }

    setOpenQuestionDeleteDialog(false);
    setQuestionToDelete(null);
  };

  const validateQuestions = () => {
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

      const options = ["A", "B", "C", "D"];
      if (!options.includes(question.correct_option)) {
        setSnackbar({
          open: true,
          message: `Question "${question.question_text}" must have a valid correct option (A, B, C, or D)`,
          severity: "error"
        });
        return false;
      }

      for (const opt of ["option_a", "option_b", "option_c", "option_d"]) {
        if (!question[opt].trim()) {
          setSnackbar({
            open: true,
            message: `Question "${question.question_text}" must have all options filled`,
            severity: "error"
          });
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();

    if (!validateQuestions()) return;

    setOpenQuestionSaveDialog(true);
  };

  const confirmQuestionSave = async () => {
    setIsLoading(true);
    try {
      const requestBody = { module_id: unitInfo.id, questions };
      const response = await axios.post(`${API_URL}/api/module/updateQuestions`, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      setSnackbar({
        open: true,
        message: "Questions updated successfully!",
        severity: "success"
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error updating questions",
        severity: "error"
      });
      console.error("Error updating questions:", error.response?.data || error);
    } finally {
      setIsLoading(false);
      setOpenQuestionSaveDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="mx-auto">
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
              className={typeForm === "createQuiz" ? "px-4 flex items-center cursor-pointer text-white bg-red-900 " : "px-4 flex items-center cursor-pointer"}
              onClick={() => setTypeForm("createQuiz")}
            >
              <p>Create Quiz</p>
            </div>
          </div>

          <Link
            to={`/modules/units/${unitInfo.storage_section_id}`}
            className="flex gap-1 items-center p-2 rounded-lg border-2 border-red-900 text-red-900 hover:bg-red-900 hover:border-red-900 hover:text-white"
          >
            <ExitToApp />
            {typeForm === "createQuiz" ? "Go back" : "Discard"}
          </Link>
        </MaxWidthWrapper>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress color="error" />
        </div>
      ) : (
        <div>
          {typeForm === "createModule" ? (
            <div className="row">
              <form onSubmit={handleSubmit} className="bg-white shadow-md rounded md:px-8 pt-6 pb-8 ">
                <MaxWidthWrapper>
                  <div className="w-full flex items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold mb-4">Edit</h3>
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="bg-red-800 py-2 px-4 rounded-md text-white hover:bg-red-900"
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={unitInfo.title}
                        onChange={onChangeValue}
                        className="form-control w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Title"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-4 mb-2">
                        <EditorToolbar toolbarId="t1" />
                        <button
                          type="button"
                          onClick={toggleRawHtmlDescription}
                          className="text-sm bg-gray-600 text-white py-3 px-3 rounded hover:bg-gray-700"
                        >
                          {isRawHtmlDescription ? "Switch to Editor" : "Edit HTML"}
                        </button>
                      </div>
                      {isRawHtmlDescription ? (
                        <textarea
                          value={unitInfo.description}
                          onChange={(e) => onDescriptionChange(e.target.value)}
                          className="form-control w-full h-[70vh] shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      ) : (
                        <ReactQuill
                          theme="snow"
                          value={unitInfo.description}
                          onChange={onDescriptionChange}
                          placeholder="Write something awesome..."
                          modules={modules("t1")}
                          formats={formats}
                          className="h-[70vh] overflow-y-auto "
                        />
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">
                        Additional Information
                      </label>
                      <div className="flex items-center gap-4 mb-2">
                        <EditorToolbar toolbarId="t2" />
                        <button
                          type="button"
                          onClick={toggleRawHtmlInformation}
                          className="text-sm bg-gray-600 text-white py-3 px-3 rounded hover:bg-gray-700"
                        >
                          {isRawHtmlInformation ? "Switch to Editor" : "Edit HTML"}
                        </button>
                      </div>
                      {isRawHtmlInformation ? (
                        <textarea
                          value={unitInfo.information}
                          onChange={(e) => onInformationChange(e.target.value)}
                          className="form-control w-full h-[70vh] shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      ) : (
                        <ReactQuill
                          theme="snow"
                          value={unitInfo.information}
                          onChange={onInformationChange}
                          placeholder="Write something awesome..."
                          modules={modules("t2")}
                          formats={formats}
                          className="h-[70vh] overflow-y-auto"
                        />
                      )}
                    </div>

                    {isError && (
                      <div className="mb-4 text-red-600 font-medium">
                        {isError}
                      </div>
                    )}

                    <div className="form-group col-sm-12 text-right">
                      <button
                        type="submit"
                        className="bg-red-900 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </MaxWidthWrapper>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuestion} className="p-6 bg-white rounded-lg shadow">
              {questions.map((question, index) => {

                return (
                  <div key={index} className="my-6 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-gray-700 font-bold">
                        Question {index + 1}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestionClick(index, question.question_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      name="question_text"
                      value={question.question_text}
                      onChange={(e) => handleChange(e, index)}
                      required
                      className="w-full border rounded px-3 py-2 mb-2"
                      placeholder="Enter question here"
                    />
                    {["option_a", "option_b", "option_c", "option_d"].map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        name={opt}
                        value={question[opt]}
                        onChange={(e) => handleChange(e, index)}
                        required
                        className="w-full border rounded px-3 py-2 mb-2"
                        placeholder={`Option ${opt.split("_")[1].toUpperCase()}`}
                      />
                    ))}
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold">Correct Option</label>
                      <select
                        name="correct_option"
                        value={question.correct_option ?? ""}
                        onChange={(e) => handleChange(e, index)}
                        required
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="" disabled>
                          {question.correct_option ? `Current: ${question.correct_option}` : "Select Correct Option"}
                        </option>
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>
                  </div>
                )
              })}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="border-red-900 border-2 text-red-900 py-2 px-4 rounded-lg hover:bg-red-900 hover:text-white"
                >
                  Add Question
                </button>

                {unitInfo.title ? (
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Submit Questions"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-red-800 text-white font-bold py-2 px-4 rounded"
                  >
                    Create Unit First
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {/* Delete Unit Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to permanently delete this unit?
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">
                "{unitInfo.title}"
              </p>
              <p className="text-red-600 mt-2">
                Warning: This action cannot be undone and will permanently this Unit.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Unit Confirmation Dialog */}
      <Dialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold">Confirm Changes</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to save these changes to the unit?
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800">
                "{unitInfo.title}"
              </p>
              <p className="text-blue-600 mt-2">
                All changes will be immediately visible to users.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpenSaveDialog(false)}
            color="primary"
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={confirmSave} color="primary" variant="contained">
            Confirm Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Question Confirmation Dialog */}
      <Dialog
        open={openQuestionDeleteDialog}
        onClose={() => setOpenQuestionDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this question?
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              {questionToDelete && (
                <p className="font-semibold text-red-800">"{questions[questionToDelete.index]?.question_text}"</p>
              )}
              <p className="text-red-600 mt-2">
                Warning: This action cannot be undone and will permanently delete this unit question.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setOpenQuestionDeleteDialog(false)}
            color="primary"
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={confirmQuestionDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Questions Confirmation Dialog */}
      <Dialog open={openQuestionSaveDialog} onClose={() => setOpenQuestionSaveDialog(false)}>
        <DialogTitle>Confirm Save Questions</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to save all question changes?</p>
          <p className="mt-2">This will update {questions.length} questions.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuestionSaveDialog(false)}
            color="primary"
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={confirmQuestionSave} color="primary" variant="contained">
            Save Questions
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}