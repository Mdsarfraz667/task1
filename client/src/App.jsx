import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./config/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./App.css";
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

  // Form validation
  const validateForm = () => {
    const { firstName, lastName, phoneNumber, email, address } = formData;
    if (!firstName || !lastName || !phoneNumber || !email || !address) {
      setError("All fields are required.");
      return false;
    }
    if (!email.includes("@gmail.com")) {
      setError("Email must include @gmail.com.");
      return false;
    }
    if (phoneNumber.length !== 10) {
      setError("Phone number must be 10 digits.");
      return false;
    }
    setError("");
    return true;
  };

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
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
      });
      console.log("response", response);
      setUsers([...users, response.data.data]);
      toast.success("User added successfully!");
      setSuccessMessage("User added successfully!");
      resetForm();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Handle user already exists case
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        console.error("Error creating user:", err);
        setError("An error occurred while creating the user.");
        toast.error("An error occurred while creating the user.");
      }
    }
  };

  // Update user (PUT)
  const updateUser = async (id) => {
    if (!validateForm()) return;
    console.log("formData", formData);
    try {
      const response = await axios.patch(`${BASE_URL}/users/${id}`, formData);
      const updatedUsers = users.map((user) =>
        user._id === id ? response.data.data : user
      );
      setUsers(updatedUsers);
      toast.success("User updated successfully!");
      resetForm();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("An error occurred while updating the user.");
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
    setError("");
    setSuccessMessage("");
  };

  const handleCancel = () => {
    resetForm();
  };

  const toggleUsersVisibility = () => {
    setShowUsers(!showUsers);
  };

  console.log("formData", formData);

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-5 text-2xl font-bold">User Form</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white  bg-opacity-80 p-6 rounded-lg shadow-md w-full max-w-md"
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

      {/* toggle on the basic of showUsers state */}
      {showUsers && (
        <div className="w-full max-w-md">
          <h2 className="mt-10 text-xl font-semibold">User List</h2>
          <ul className="grid grid-cols-1 gap-4 mt-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="bg-white shadow-2xl rounded-lg p-4 flex justify-between items-center transition-all duration-300 transform hover:scale-105"
              >
                <div>
                  <h3 className="font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <div>
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
              </li>
            ))}
          </ul>
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
