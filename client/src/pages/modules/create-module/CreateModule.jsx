import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ExitToApp } from "@mui/icons-material";
import { Link } from "react-router-dom";

function CreateModulePage() {
  const [typeForm, setTypeForm] = useState("createModule");

  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        navigate("/user/login");
      }
    }
    checkUser();
  }, [navigate]);

  const [userInfo, setUserInfo] = useState({
    title: "",
    description: "",
    information: "",
  });

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
      const res = await axios.post("http://localhost:5000/api/module/addModule", {
        title: userInfo.title,
        description: userInfo.description,
        information: userInfo.information,
      });

      if (res.data.success) {
        setTypeForm("createQuiz");
      } else {
        setError("An error occurred while submitting the form.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while submitting the form.");
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
  
    // Ensure all questions have valid question_text
    const validQuestions = questions.filter((q) => q.question_text && q.question_text.trim() !== "");
  
    if (validQuestions.length < 5) {
      alert("Each question must have a valid question text.");
      return;
    }
  
    // Map correct_option values from 'option_a', 'option_b', etc. to 'A', 'B', 'C', 'D'
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
      const response = await axios.post("http://localhost:5000/api/module/addQuestions", {
        module_title,
        questions: updatedQuestions,
      });
  
      navigate("/modules");
    } catch (error) {
      console.error("Axios error:", error);
    }
  };
  

  return (
    <div className="mt-14 container mx-auto ">
      <section className="text-sm">
        <MaxWidthWrapper className="h-16 flex justify-between items-center border-b-2">
          <div className="h-16  flex flex-row">
            <div
              className={typeForm === "createModule" ? "px-4 flex items-center cursor-pointer text-white bg-red-900" : "px-4 flex items-center cursor-pointer"}
              onClick={() => setTypeForm("createModule")}
            >
              <p>Create Module</p>
            </div>
            <div
              className={typeForm === "createQuiz" ? "px-4 flex items-center cursor-pointer text-white bg-red-900 " : "px-4 flex items-center cursor-pointer"}
              onClick={() => setTypeForm("createQuiz")}
            >
              <p>Create Quiz</p>
            </div>
          </div>

          <Link
            to="/modules"
            className=" flex gap-1 items-center p-2  rounded-lg border-2 border-red-900 text-red-900 hover:bg-red-900 hover:border-red-900 hover:text-white"
          >
            <ExitToApp />
            {typeForm === "createQuiz" ? "No Questions" : "Discard"}
          </Link>
        </MaxWidthWrapper>
      </section>

      <form onSubmit={addDetails} className={typeForm === "createModule" ? "bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" : "hidden"}>
        <MaxWidthWrapper>
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={userInfo.title}
              onChange={onChangeValue}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter the title"
              required
            />
          </div>

          {/* Description (Quill Editor) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <EditorToolbar toolbarId="t1" />
            <ReactQuill
              theme="snow"
              value={userInfo.description}
              onChange={onDescription}
              placeholder="Write something awesome..."
              modules={modules("t1")}
              formats={formats}
              className="bg-white border rounded"
            />
          </div>

          {/* Additional Information (Quill Editor) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Additional Information
            </label>
            <EditorToolbar toolbarId="t2" />
            <ReactQuill
              theme="snow"
              value={userInfo.information}
              onChange={onInformation}
              placeholder="Write something more..."
              modules={modules("t2")}
              formats={formats}
              className="bg-white border rounded"
            />
          </div>

          {/* Error Message */}
          {isError && <div className="text-red-500 text-sm mb-4">{isError}</div>}

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </MaxWidthWrapper>
      </form>

      <div className={typeForm === "createQuiz"?"max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg": "hidden"}>
      {userInfo.title? 
        <h2 className="text-2xl font-semibold text-center py-6">Create Questions for Module: {userInfo.title} (Minimum of 5)</h2>:
        <h2 className="text-2xl font-semibold text-center py-6 text-red-800">Please create a module first.</h2>
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

            {userInfo.title ?<button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Submit Questions
            </button>: 
            <button
              type="submit"
              className="bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Module First
            </button>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateModulePage;
