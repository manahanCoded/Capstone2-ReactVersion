import React, { useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ExitToApp } from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditPost({ postList, editPostID }) {
  const navigate = useNavigate();
  const [checkAdminData, setCheckAdmin] = useState(null);

  const initialPostData = postList?.[0] || { title: "", description: "", information: "" };
  const [userInfo, setUserInfo] = useState(initialPostData);
  const [isError, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [isRawHtmlDescription, setIsRawHtmlDescription] = useState(false);
  const [isRawHtmlInformation, setIsRawHtmlInformation] = useState(false);

  const [typeForm, setTypeForm] = useState("createModule");
  const [isLoading, setIsLoading] = useState(false);

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
    if (!userInfo.id) return; 
    async function fetchQuestions() {
      try {
        const res = await axios.get(
          `${API_URL}/api/module/allQuestions?id=${encodeURIComponent(userInfo.id)}`
        );
        setQuestions(res.data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, [userInfo.id]); // Depend only on userInfo.id





  const onChangeValue = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onDescriptionChange = (value) => {
    setUserInfo({
      ...userInfo,
      description: value,
    });
  };

  const onInformationChange = (value) => {
    setUserInfo({
      ...userInfo,
      information: value,
    });
  };

  const toggleRawHtmlDescription = () => {
    setIsRawHtmlDescription(!isRawHtmlDescription);
  };

  const toggleRawHtmlInformation = () => {
    setIsRawHtmlInformation(!isRawHtmlInformation);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userInfo.description.length < 50) {
      setError("Required: Add description with a minimum length of 50 characters.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/module/editModule`, {
        title: userInfo.title,
        description: userInfo.description,
        information: userInfo.information,
        ids: editPostID,
      });

      if (response.data.success === true) {
        alert("Edit successfull.")
        navigate(-1);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to edit module.");
      console.error("Error editing module:", error);
    }
  };

  const deleteModule = async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/module/deleteModules/${editPostID}`);

      if (response.status === 200) {
        alert("Delete successfull.")
        navigate(-1);
      } else {
        console.error("Failed to delete module");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
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


  const handleRemoveQuestion = async (index, question_id) => {
    if (question_id) {
      try {
        const response = await axios.delete(`${API_URL}/api/module/deleteQuestion/${question_id}`);
        if (response.status === 200) {
          const updatedQuestions = questions.filter((_, i) => i !== index);
          setQuestions(updatedQuestions);
        } else {
          alert("Failed to delete question.");
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Error deleting question.");
      }
    } else {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };


  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    const allowedOptions = ["A", "B", "C", "D"];

    const validatedQuestions = questions.map((q) => {
      if (!allowedOptions.includes(q.correct_option)) {
        alert(`Error: Invalid correct option for question "${q.question_text}". Must be A, B, C, or D.`);
        throw new Error("Invalid correct_option");
      }
      return q;
    });

    const requestBody = { module_id: userInfo.id, questions: validatedQuestions };

    try {
      const response = await axios.post(`${API_URL}/api/module/updateQuestions`, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Questions updated successfully!");

    } catch (error) {
      console.error(" Error updating questions:", error.response?.data || error);
      alert("Error updating questions.");
    }
  };




  return (
    <div className=" mx-auto">
      <section className="text-sm">
        <MaxWidthWrapper className="h-16 flex justify-between items-center border-b-2">
          <div className="h-16  flex flex-row">
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
            to={`/modules/units/${userInfo.storage_section_id}`}
            className=" flex gap-1 items-center p-2  rounded-lg border-2 border-red-900 text-red-900 hover:bg-red-900 hover:border-red-900 hover:text-white"
          >
            <ExitToApp />
            {typeForm === "createQuiz" ? "Go back" : "Discard"}
          </Link>
        </MaxWidthWrapper>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-700"></div>
        </div>
      ) : (
        <div>
          {typeForm === "createModule" ?
            <div className="row">
              <form onSubmit={handleSubmit} className="bg-white shadow-md rounded md:px-8 pt-6 pb-8 ">
                <MaxWidthWrapper>
                  <div className="w-full flex items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold mb-4">Edit</h3>
                    <button
                      type="button"
                      onClick={deleteModule}
                      className="bg-red-800 py-2 px-4 rounded-md text-white hover:bg-red-900"
                    >
                      Delete
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
                        value={userInfo.title}
                        onChange={onChangeValue}
                        className="form-control w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Title"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">
                        Descriptioasdasdn <span className="text-red-500">*</span>
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
                          value={userInfo.description}
                          onChange={(e) => onDescriptionChange(e.target.value)}
                          className="form-control w-full h-[70vh] shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      ) : (
                        <ReactQuill
                          theme="snow"
                          value={userInfo.description}
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
                          value={userInfo.information}
                          onChange={(e) => onInformationChange(e.target.value)}
                          className="form-control w-full h-[70vh] shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      ) : (
                        <ReactQuill
                          theme="snow"
                          value={userInfo.information}
                          onChange={onInformationChange}
                          placeholder="Write something awesome..."
                          modules={modules("t2")}
                          formats={formats}
                          className="h-[70vh] overflow-y-auto"
                        />
                      )}
                    </div>

                    {isError && <div className="errors">{isError}</div>}

                    <div className="form-group col-sm-12 text-right">
                      <button
                        type="submit"
                        className="bg-red-900 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </MaxWidthWrapper>
              </form>
            </div>
            : <form onSubmit={handleSubmitQuestion} className="p-6 bg-white rounded-lg shadow">
              {questions.map((question, index) => (
                <div key={index} className="my-6 border-b pb-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-gray-700 font-bold">
                      Question {index + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index, question.question_id)}
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
                      value={question.correct_option ?? ""} // Ensure existing value is shown
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
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="border-red-900 border-2 text-red-900 py-2 px-4 rounded-lg hover:bg-red-900 hover:text-white"
                >
                  Add Question
                </button>

                {userInfo.title ? (
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Submit Questions
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
          }
        </div>
      )}
    </div>

  );
};


