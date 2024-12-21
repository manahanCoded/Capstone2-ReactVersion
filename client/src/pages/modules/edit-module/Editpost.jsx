import React, { useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar"
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const EditPost = ({ postList, editPostID }) => {
  const [checkAdminData, setCheckAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
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
        setCheckAdmin(data);

        if (data.role === "client") {
          alert("Unauthorized access!");
          navigate("/modules");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    }
    checkUser();
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
      console.error("Error editing article:", error);
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
                  <EditorToolbar toolbarId="t1" />
                  <ReactQuill
                    theme="snow"
                    value={userInfo.description}
                    onChange={onDescriptionChange}
                    placeholder="Write something awesome..."
                    modules={modules("t1")}
                    formats={formats}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Additional Information
                  </label>
                  <EditorToolbar toolbarId="t2" />
                  <ReactQuill
                    theme="snow"
                    value={userInfo.information}
                    onChange={onInformationChange}
                    placeholder="Write something awesome..."
                    modules={modules("t2")}
                    formats={formats}
                  />
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
