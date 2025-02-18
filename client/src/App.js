import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";


function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPost, setEditingPost] = useState(null); // Track which post is being edited

  // Fetch posts
  useEffect(() => {
    axios
      .get("https://plannitback.onrender.com/api/blogs")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Add a new post
  const addPost = async () => {
    if (!title || !content) return;
    const newPost = { title, content };
    await axios.post("https://plannitback.onrender.com/api/blogs/add", newPost);
    setTitle("");
    setContent("");
    window.location.reload();
  };

  // Delete a post
  const deletePost = async (id) => {
    await axios.delete(`https://plannitback.onrender.com/api/blogs/${id}`);
    window.location.reload();
  };

  // Start editing a post
  const startEditing = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  // Update a post
  const updatePost = async () => {
    if (!editingPost) return;
    await axios.put(`https://plannitback.onrender.com/api/blogs/${editingPost._id}`, { title, content });
    setEditingPost(null);
    setTitle("");
    setContent("");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-orange-600">My Planner</h1>

        {/* Form */}
        <div className="mt-6">
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="w-full mt-3 p-2 border rounded-lg focus:ring focus:ring-blue-200"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
          {editingPost ? (
            <button
              onClick={updatePost}
              className="w-full bg-green-600 text-white py-2 mt-3 rounded-lg hover:bg-green-700 transition"
            >
              Update Plan
            </button>
          ) : (
            <button
              onClick={addPost}
              className="w-full bg-orange-600 text-white py-2 mt-3 rounded-lg hover:bg-lightOrange-700 transition"
            >
              Add Plan
            </button>
          )}
        </div>

        {/* Posts */}
        <h2 className="text-2xl font-semibold mt-8">Plans</h2>
        <div className="mt-4 space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="text-gray-700">{post.content}</p>
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => startEditing(post)}
                  className="text-blue-600 hover:text-blue-800"
                >
                 <PencilIcon className="h-6 w-6 text-blue-600" />
                </button>
                <button
                  onClick={() => deletePost(post._id)}
                  className="text-red-600 hover:text-red-800"
                >
                 <TrashIcon className="h-6 w-6 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
