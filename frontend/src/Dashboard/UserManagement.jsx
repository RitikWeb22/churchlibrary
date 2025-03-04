import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  updateUser,
  importUsers,
  addPhoneNumber,
} from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable modal components (ensure these are implemented in your project)
import EditModal from "../components/EditModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // For editing an existing user
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // For adding a new user
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  // For deletion using a reusable modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // For adding a phone number record (pre‑registration)
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [newPhoneData, setNewPhoneData] = useState({ phone: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete user using the DeleteConfirmModal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Delete error:", error);
    }
    closeDeleteModal();
  };

  // Toggle role (admin <-> user)
  const handleToggleRole = async (user) => {
    const currentRole = user.role;
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(user._id || user.id, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Role update error:", error);
    }
  };

  // Open edit modal (using reusable EditModal)
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setEditData({ fullName: "", email: "", phone: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser._id || selectedUser.id, editData);
      toast.success("User updated successfully");
      closeEditModal();
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Update error:", error);
    }
  };

  // Open add new user modal (using reusable EditModal)
  const openAddUserModal = () => {
    setNewUserData({ fullName: "", email: "", phone: "", password: "" });
    setShowAddModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddModal(false);
    setNewUserData({ fullName: "", email: "", phone: "", password: "" });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUserData);
      toast.success("New user created successfully");
      closeAddUserModal();
      fetchUsers();
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Create user error:", error);
    }
  };

  // Open Add Phone Number Modal
  const openAddPhoneModal = () => {
    setNewPhoneData({ phone: "" });
    setShowAddPhoneModal(true);
  };

  const closeAddPhoneModal = () => {
    setShowAddPhoneModal(false);
  };

  const handleAddPhoneSubmit = async (e) => {
    e.preventDefault();
    if (!newPhoneData.phone) {
      toast.error("Please enter a phone number");
      return;
    }
    try {
      await addPhoneNumber(newPhoneData);
      toast.success("Phone number added successfully");
      closeAddPhoneModal();
      fetchUsers();
    } catch (error) {
      toast.error("Failed to add phone number");
      console.error("Add phone number error:", error);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="mb-4 flex gap-4">
        <button className="btn btn-info" onClick={openAddPhoneModal}>
          + Add Phone Number
        </button>
        {/* <button className="btn btn-primary" onClick={openAddUserModal}>
          + Add User
        </button> */}
      </div>

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id || user.id}>
                  <th>{index + 1}</th>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{user.role || "user"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => openDeleteModal(user)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleToggleRole(user)}
                      >
                        {user.role === "admin" ? "Make User" : "Make Admin"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      {selectedUser && (
        <EditModal
          title="Edit User"
          onSubmit={handleEditSubmit}
          onCancel={closeEditModal}
        >
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={editData.fullName}
              onChange={(e) =>
                setEditData({ ...editData, fullName: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
              className="input input-bordered w-full"
            />
          </div>
        </EditModal>
      )}

      {/* Add New User Modal */}
      {showAddModal && (
        <EditModal
          title="Add New User"
          onSubmit={handleAddSubmit}
          onCancel={closeAddUserModal}
        >
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={newUserData.fullName}
              onChange={(e) =>
                setNewUserData({ ...newUserData, fullName: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="tel"
              value={newUserData.phone}
              onChange={(e) =>
                setNewUserData({ ...newUserData, phone: e.target.value })
              }
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
        </EditModal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          message="Are you sure you want to delete this user?"
          onConfirm={() => {
            if (userToDelete) {
              handleDelete(userToDelete._id || userToDelete.id);
            }
          }}
          onCancel={closeDeleteModal}
        />
      )}

      {/* Add Phone Number Modal */}
      {showAddPhoneModal && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <h3 className="font-bold text-xl mb-4">Add Phone Number</h3>
            <form onSubmit={handleAddPhoneSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={newPhoneData.phone}
                  onChange={(e) =>
                    setNewPhoneData({ ...newPhoneData, phone: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Add Number
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddPhoneModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UserManagement;
