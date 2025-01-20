import React, { useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const EditPost = ({ postList, editPostID }) => {
  const [checkAdminData, setCheckAdmin] = useState(null);
  const navigate = useNavigate();

  const [isRawHtmlDescription, setIsRawHtmlDescription] = useState(false); 
  const [isRawHtmlInformation, setIsRawHtmlInformation] = useState(false); 


  useEffect(() => {
    async function handleCheckAdmin() {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
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
        alert("Failed to fetch user profile.");
      }
    }

    handleCheckAdmin();
  }, [navigate]);

  const initialPostData = postList?.[0] || { title: "", description: "", information: "" };
  const [userInfo, setUserInfo] = useState(initialPostData);
  const [isError, setError] = useState(null);

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
      const response = await axios.post("http://localhost:5000/api/module/editModule", {
        title: userInfo.title,
        description: userInfo.description,
        information: userInfo.information,
        ids: editPostID,
      });

      if (response.data.success === true) {
        navigate("/modules");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to edit module.");
      console.error("Error editing module:", error);
    }
  };

  const deleteModule = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/module/deleteModules/${editPostID}`);

      if (response.status === 200) {
        navigate("/modules");
      } else {
        console.error("Failed to delete module");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  return (
    <div className="mt-14 container mx-auto">
      <div className="container">
        <div className="row">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                      className="h-[70vh] overflow-y-auto"
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
                    className="bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </MaxWidthWrapper>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
