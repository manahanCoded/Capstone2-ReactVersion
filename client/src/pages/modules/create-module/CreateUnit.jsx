import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ExitToApp } from "@mui/icons-material";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateUnitPage() {
  const [typeForm, setTypeForm] = useState("createModule");
  const [unitPlace, setUnitPlace] = useState([])
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    title: "",
    description: "",
    information: "",
    storage_section_id: "",
    publisher: ""
  });

  const { id } = useParams()

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
  
          setUserInfo((prev) => ({
            ...prev,
            publisher: data.id,
            storage_section_id: moduleData.data.listall[0].id,
          }));
        } else {
          setError("Module not found");
          setUnitPlace(null);
        }
      } catch (err) {
        console.error("An error occurred:", err);
        alert("Failed to fetch user profile.");
      }
    }
  
    handleCheckAdmin();
  }, [navigate, id]);
  

  const [isError, setError] = useState(null);


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

  const addDetails = async (event) => {
    event.preventDefault();

    if (!userInfo.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (userInfo.description.length < 50) {
      setError("Description must be at least 50 characters long.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/module/addModule`, {
        title: userInfo.title,
        description: userInfo.description,
        information: userInfo.information,
        storage_section_id: userInfo.storage_section_id,
        publisher: userInfo.publisher
      });

      if (res.data.success) {
        alert("Unit has been successfully created.")
        setTypeForm("createQuiz");
      } else {
        setError(res.data.error || "An error occurred while submitting the form.");
      }
    } catch (error) {

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("A File is to big try changing file.");
      }
    }
  };

  const [questions, setQuestions] = useState([
    { question_text: userInfo.title, option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: userInfo.title, option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: userInfo.title, option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: userInfo.title, option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    { question_text: userInfo.title, option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
  ]);

  // Handle changes for all fields (inputs and textareas)
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setQuestions(updatedQuestions);
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "" },
    ]);
  };

  // Handle removing a question
  const handleRemoveQuestion = (index) => {
    if (questions.length > 5) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } else {
      alert("You cannot remove more questions. At least 5 questions are required.");
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!userInfo.title) {
      alert("Please create a module first.");
      return; // Stop further execution if there's no module title
    }

    if (questions.length < 5) {
      alert("You must have at least 5 questions.");
      return;
    }

    const module_title = userInfo.title;


    const validQuestions = questions.filter((q) => q.question_text && q.question_text.trim() !== "");

    if (validQuestions.length < 5) {
      alert("Each question must have a valid question text.");
      return;
    }


    const updatedQuestions = validQuestions.map((question) => {
      const correctOptionMap = {
        option_a: 'A',
        option_b: 'B',
        option_c: 'C',
        option_d: 'D',
      };

      const correctOption = correctOptionMap[question.correct_option] || '';

      return { ...question, correct_option: correctOption };
    });

    try {
      const response = await axios.post(`${API_URL}/api/module/addQuestions`, {
        module_title,
        questions: updatedQuestions,
      });

      navigate(`/modules/units/${userInfo.storage_section_id}`);
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const [isEditingHTMLDescription, setIsEditingHTMLDescription] = useState(false);
  const [isEditingHTMLInformation, setIsEditingHTMLInformation] = useState(false);


  return (
    <div className="mt-14 container mx-auto ">
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
            {typeForm === "createQuiz" ? "No Questions" : "Discard"}
          </Link>
        </MaxWidthWrapper>
      </section>
      <form
        onSubmit={addDetails}
        className={typeForm === "createModule" ? " m-auto bg-white shadow-md rounded lg:px-8 pt-6 pb-8 mb-4" : "hidden"}
      >
        <MaxWidthWrapper>
          {/* Title Input */}
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

          {/* Description (Toggle between Quill and Raw HTML) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 mb-2">
              <EditorToolbar toolbarId="t1" />
              <button
                type="button"
                onClick={() =>
                  setIsEditingHTMLDescription(!isEditingHTMLDescription)
                }
                 className="text-sm bg-gray-600 text-white py-3 px-3 rounded hover:bg-gray-700"
              >
                {isEditingHTMLDescription ? "Switch to Editor" : "Edit HTML"}
              </button>
            </div>
            {isEditingHTMLDescription ? (
              <textarea
                className="w-full p-2 border rounded h-[70vh]"
                value={userInfo.description}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, description: e.target.value })
                }
                placeholder="Edit raw HTML here..."
              />
            ) : (
              <>
                <ReactQuill
                  theme="snow"
                  value={userInfo.description}
                  onChange={onDescription}
                  placeholder="Write something awesome..."
                  modules={modules("t1")}
                  formats={formats}
                  className="bg-white border rounded h-[70vh] overflow-y-auto"
                />
              </>
            )}

          </div>

          {/* Additional Information (Toggle between Quill and Raw HTML) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Additional Information
            </label>
            <div className="flex items-center gap-4 mb-2">
              <EditorToolbar toolbarId="t2" />
              <button
                type="button"
                onClick={() =>
                  setIsEditingHTMLInformation(!isEditingHTMLInformation)
                }
             className="text-sm bg-gray-600 text-white py-3 px-3 rounded hover:bg-gray-700"
              >
                {isEditingHTMLInformation ? "Switch to Editor" : "Edit HTML"}
              </button>
            </div>
            {isEditingHTMLInformation ? (
              <textarea
                className="w-full p-2 border rounded h-[70vh]"
                value={userInfo.information}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, information: e.target.value })
                }
                placeholder="Edit raw HTML here..."
              />
            ) : (
              <>
                <ReactQuill
                  theme="snow"
                  value={userInfo.information}
                  onChange={onInformation}
                  placeholder="Write something more..."
                  modules={modules("t2")}
                  formats={formats}
                  className="bg-white border rounded h-[70vh] overflow-y-auto"
                />
              </>
            )}
          </div>

          {isError && <div className="text-red-500 text-sm mb-4">{isError}</div>}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-red-900 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </MaxWidthWrapper>
      </form>

      <div className={typeForm === "createQuiz" ? "max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg" : "hidden"}>
        {userInfo.title ?
          <h2 className="text-2xl font-semibold text-center py-6">Create Questions for Unit: {userInfo.title} (Minimum of 5)</h2> :
          <h2 className="text-2xl font-semibold text-center py-6 text-red-800">Please create a Unit first.</h2>
        }

        <form onSubmit={handleSubmitQuestion}>
          {questions.map((question, index) => (
            <div key={index} className="my-6 border-b-[1px]">
              <div className="flex justify-between">
                <label className="block text-gray-700 font-bold mb-2">Question {index + 1}</label>
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
                <label className="block text-gray-700 font-bold mb-2">Correct Option</label>
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
              className="border-red-900 border-2 text-red-900 py-2 px-4 rounded-lg hover:text-white hover:bg-red-900 "
            >
              Add Question
            </button>

            {userInfo.title ? <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Submit Questions
            </button> :
              <button
                type="submit"
                className="bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Unit First
              </button>}
          </div>
        </form>
      </div>

    </div>
  );
}


