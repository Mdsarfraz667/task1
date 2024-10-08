import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import BASE_URL from "./config/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./App.css";
import validateFormUtility from "./utility/FormValidation";

const App = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [showUsers, setShowUsers] = useState(false);

  // create const form ref for start the form position
  const formRef = useRef(null);

  // Form validation

  // Handle input change
  const handleInputChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Error fetching users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const createUser = async () => {
    const errMessage = validateFormUtility(formData);

    if (errMessage) {
      toast.error(errMessage);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
      });
      console.log("response", response);
      setUsers((prevUsers) => [response.data.data, ...prevUsers]);
      toast.success("User added successfully!");
      setSuccessMessage("User added successfully!");
      resetForm();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Handle user already exists case
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while creating the user.");
      }
    }
  };

  // Update user (PUT)
  const updateUser = async (id) => {
    const errMessage = validateFormUtility(formData);

    if (errMessage) {
      toast.error(errMessage);
      return;
    }
    try {
      const response = await axios.patch(`${BASE_URL}/users/${id}`, formData);
      const updatedUsers = users.map((user) =>
        user._id === id ? response.data.data : user
      );
      setUsers(updatedUsers);
      toast.success("User updated successfully!");
      resetForm();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      const filteredUsers = users.filter((user) => user._id !== id);
      setUsers(filteredUsers);
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("An error occurred while deleting the user.");
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateUser(editUserId);
    } else {
      createUser();
    }
  };

  // for edit we first populate the formData
  const handleEdit = (user) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
    });
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsEditing(true);
    setEditUserId(user._id);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    setIsEditing(false);
    setEditUserId(null);
    setIsEditing(false);
    setEditUserId(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  const toggleUsersVisibility = () => {
    setShowUsers(!showUsers);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-5 text-2xl font-bold">User Form</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md w-full max-w-md"
        ref={formRef}
      >
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          {isEditing ? "Update" : "Submit"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </form>

      <button
        onClick={toggleUsersVisibility}
        className="bg-green-500 text-white mt-5 py-2 px-4 rounded-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
      >
        {showUsers ? "Hide Users" : "Show Users"}
      </button>

      {showUsers && (
        <div className="w-full max-w-md">
          <h2 className="mt-10 text-xl font-semibold">User List</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-2xl rounded-lg p-4 transition-all duration-300 transform hover:scale-105"
              >
                <h3 className="font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500">
                  <b>Phone</b>: {user.phoneNumber}
                </p>
                <p className="text-gray-500">
                  <b>Email: </b>
                  {user.email}
                </p>
                <p className="text-gray-500">
                  <b>Address</b>: {user.address}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default App;
