
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import EditPost from "./Editpost"; 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Edit = () => {
  const params = useParams();

  const editPostID = typeof params.editPostID === "string" ? params.editPostID : "";

  const [post, setPost] = useState(null); 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (editPostID) {
          const response = await axios.post(`${API_URL}/api/module/getPostId`, {
            ids: params.editPostID,
          });

          if (response.data.success) {
            setPost(response.data.listId[0]); 
          } else {
            console.error("Post not found");
          }
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPost(); 
  }, [editPostID]);

  return (
    <div className="mt-14 container mx-auto">
      {post && 
        <EditPost postList={[post]} editPostID={parseInt(editPostID)} />
      }
    </div>
  );
};

export default Edit;
