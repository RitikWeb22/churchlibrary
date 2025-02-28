import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API calls
import { getEventBanner, updateEventBanner } from "../services/eventBannerApi";
import {
  getFormFields,
  createFormField,
  updateFormField,
  deleteFormField,
} from "../services/eventFieldsApi";
import {
  getRegistrations,
  deleteRegistration,
} from "../services/eventRegistrationsApi";

// Reusable modal components
import EditModal from "../components/EditModal";
import ViewModal from "../components/ViewModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const EventRegistrationManagement = () => {
  // Banner State
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [existingBannerImage, setExistingBannerImage] = useState("");

  // Dynamic Fields State
  const [fields, setFields] = useState([]);

  // Field Modal State (for add/edit dynamic field)
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");

  // For normal dropdowns (array of strings)
  const [dropdownOptions, setDropdownOptions] = useState([
    "Option 1",
    "Option 2",
  ]);
  // For "Event" dropdowns (array of objects)
  const [eventOptions, setEventOptions] = useState([]);

  // New state for deleting a dynamic field via modal
  const [isDeleteFieldModalOpen, setIsDeleteFieldModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);

  // Registrations State
  const [registrations, setRegistrations] = useState([]);
  const [registrationsError, setRegistrationsError] = useState(null);

  // Registration view modal state
  const [viewRegistration, setViewRegistration] = useState(null);

  useEffect(() => {
    fetchEventBanner();
    fetchFormFields();
    fetchAllRegistrations();
  }, []);

  // ------------------ BANNER ------------------
  const fetchEventBanner = async () => {
    try {
      const data = await getEventBanner();
      setBannerTitle(data.title || "");
      setExistingBannerImage(data.image || "");
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error("Failed to fetch event banner.");
    }
  };

  const handleBannerImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImageFile(e.target.files[0]);
    }
  };

  const handleUpdateBanner = async () => {
    try {
      await updateEventBanner(bannerTitle, bannerImageFile);
      toast.success("Banner updated successfully!");
      fetchEventBanner();
    } catch (error) {
      toast.error("Failed to update banner.");
    }
  };

  // ------------------ FIELDS ------------------
  const fetchFormFields = async () => {
    try {
      const data = await getFormFields();
      setFields(data);
    } catch (error) {
      toast.error("Failed to fetch form fields.");
    }
  };

  const openFieldModal = (field = null) => {
    setIsFieldModalOpen(true);
    if (field) {
      // Editing existing field
      setEditingField(field);
      setFieldLabel(field.label);
      setFieldType(field.type);
      if (field.label === "Event" && field.type === "dropdown") {
        setEventOptions(field.options || []);
        setDropdownOptions([]);
      } else if (field.type === "dropdown") {
        setDropdownOptions(field.options || []);
        setEventOptions([]);
      } else {
        setDropdownOptions([]);
        setEventOptions([]);
      }
    } else {
      // Creating new field
      setEditingField(null);
      setFieldLabel("");
      setFieldType("text");
      setDropdownOptions(["Option 1", "Option 2"]);
      setEventOptions([]);
    }
  };

  const closeFieldModal = () => {
    setIsFieldModalOpen(false);
    setEditingField(null);
    setFieldLabel("");
    setFieldType("text");
    setDropdownOptions([]);
    setEventOptions([]);
  };

  const handleAddOption = () => {
    setDropdownOptions((prev) => [...prev, `Option ${prev.length + 1}`]);
  };

  const handleRemoveOption = (index) => {
    setDropdownOptions((prev) => prev.filter((_, i) => i !== index));
  };

  // For Event dropdown: add a new event object
  const handleAddEventOption = () => {
    setEventOptions((prev) => [
      ...prev,
      {
        name: `Event ${prev.length + 1}`,
        date: "",
        placeType: "online",
        placeName: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveEventOption = (index) => {
    setEventOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEventOptionChange = (index, key, value) => {
    setEventOptions((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [key]: value };
      return newArr;
    });
  };

  const handleFieldSubmit = async () => {
    if (!fieldLabel.trim()) {
      toast.error("Field label is required.");
      return;
    }
    // Build final options array if dropdown
    let finalOptions = [];
    if (fieldType === "dropdown") {
      finalOptions = fieldLabel === "Event" ? eventOptions : dropdownOptions;
    }
    const payload = {
      label: fieldLabel,
      type: fieldType,
      options: finalOptions,
    };
    try {
      if (editingField) {
        await updateFormField(editingField._id, payload);
        toast.success("Dynamic field updated!");
      } else {
        await createFormField(payload);
        toast.success("Dynamic field added!");
      }
      fetchFormFields();
      closeFieldModal();
    } catch (error) {
      toast.error("Failed to save dynamic field.");
    }
  };

  // New delete handlers for dynamic field using a confirmation modal
  const openDeleteFieldModal = (field) => {
    setFieldToDelete(field);
    setIsDeleteFieldModalOpen(true);
  };

  const closeDeleteFieldModal = () => {
    setIsDeleteFieldModalOpen(false);
    setFieldToDelete(null);
  };

  const confirmDeleteField = async () => {
    try {
      await deleteFormField(fieldToDelete._id);
      toast.info("Dynamic field deleted.");
      fetchFormFields();
      closeDeleteFieldModal();
    } catch (error) {
      toast.error("Failed to delete dynamic field.");
    }
  };

  // ------------------ REGISTRATIONS ------------------
  const fetchAllRegistrations = async () => {
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (error) {
      setRegistrationsError("Failed to fetch registrations.");
    }
  };

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?"))
      return;
    try {
      await deleteRegistration(id);
      toast.info("Registration deleted.");
      fetchAllRegistrations();
    } catch (error) {
      toast.error("Failed to delete registration.");
    }
  };

  const handleViewRegistration = (reg) => {
    setViewRegistration(reg);
  };

  const closeViewModal = () => {
    setViewRegistration(null);
  };

  const exportToExcel = () => {
    if (registrations.length === 0) {
      toast.warn("No registrations to export.");
      return;
    }
    const fieldLabels = fields.map((f) => f.label);
    let header = "S.No";
    fieldLabels.forEach((lbl) => {
      header += `,${lbl}`;
    });
    header += ",CreatedAt\n";
    let csvContent = header;
    registrations.forEach((reg, index) => {
      const sNo = index + 1;
      let row = `${sNo}`;
      fieldLabels.forEach((lbl) => {
        const val = reg.dynamicData?.[lbl] || "";
        row += `,"${val}"`;
      });
      const created = reg.createdAt
        ? new Date(reg.createdAt).toISOString().slice(0, 10)
        : "";
      row += `,"${created}"\n`;
      csvContent += row;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* SECTION 1: BANNER MANAGEMENT */}
      <h1 className="text-3xl font-bold mb-4">Event Registration Banner</h1>
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-4 rounded shadow mb-8">
        <div className="mb-4">
          <label htmlFor="bannerTitle" className="block font-semibold mb-1">
            Banner Title:
          </label>
          <input
            type="text"
            id="bannerTitle"
            className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Current Banner Image:
          </label>
          {existingBannerImage ? (
            <img
              src={`${existingBannerImage}?t=${new Date().getTime()}`}
              alt="Banner"
              className="w-48 h-24 object-cover rounded"
            />
          ) : (
            <p>No banner image set.</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="bannerImage" className="block font-semibold mb-1">
            Upload New Banner Image:
          </label>
          <input
            type="file"
            id="bannerImage"
            className="file-input file-input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={handleBannerImageChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleUpdateBanner}>
          Update Banner
        </button>
      </div>

      {/* SECTION 2: DYNAMIC FIELDS MANAGEMENT */}
      <h1 className="text-3xl font-bold mb-4">
        Registration Fields Management
      </h1>
      <div className="flex gap-4 mb-4">
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => openFieldModal(null)}
        >
          <FaPlus /> Add Dynamic Field
        </button>
      </div>
      <div className="space-y-2 mb-8">
        {fields.map((field) => (
          <div
            key={field._id}
            className="border p-2 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm"
          >
            <div>
              <strong>{field.label}</strong>{" "}
              <span className="text-sm text-gray-500">({field.type})</span>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => openFieldModal(field)}
              >
                <FaEdit />
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => openDeleteFieldModal(field)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reusable Edit Modal for Dynamic Field */}
      {isFieldModalOpen && (
        <EditModal
          title={editingField ? "Edit Dynamic Field" : "Add Dynamic Field"}
          onSubmit={handleFieldSubmit}
          onCancel={closeFieldModal}
        >
          <div className="mb-4">
            <label
              htmlFor="dynamicFieldLabel"
              className="block font-semibold mb-1"
            >
              Field Label:
            </label>
            <input
              type="text"
              id="dynamicFieldLabel"
              className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="dynamicFieldType"
              className="block font-semibold mb-1"
            >
              Field Type:
            </label>
            <select
              id="dynamicFieldType"
              className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
          {fieldType === "dropdown" && fieldLabel !== "Event" && (
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Dropdown Options:
              </label>
              {dropdownOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...dropdownOptions];
                      newOpts[idx] = e.target.value;
                      setDropdownOptions(newOpts);
                    }}
                  />
                  <button
                    className="btn btn-sm btn-error"
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary mt-2"
                type="button"
                onClick={handleAddOption}
              >
                Add Option
              </button>
            </div>
          )}
          {fieldType === "dropdown" && fieldLabel === "Event" && (
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Event Options (name, date, place, etc.):
              </label>
              {eventOptions.map((evt, idx) => (
                <div
                  key={idx}
                  className="border p-2 mb-2 flex flex-col gap-1 bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <label className="w-20">Name:</label>
                    <input
                      type="text"
                      className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      value={evt.name}
                      onChange={(e) =>
                        handleEventOptionChange(idx, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20">Date:</label>
                    <input
                      type="date"
                      className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      value={evt.date}
                      onChange={(e) =>
                        handleEventOptionChange(idx, "date", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20">Place:</label>
                    <select
                      className="select select-bordered dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      value={evt.placeType}
                      onChange={(e) =>
                        handleEventOptionChange(
                          idx,
                          "placeType",
                          e.target.value
                        )
                      }
                    >
                      <option value="online">Online</option>
                      <option value="physical">Physical</option>
                    </select>
                    {evt.placeType === "physical" && (
                      <input
                        type="text"
                        placeholder="Venue name"
                        className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        value={evt.placeName}
                        onChange={(e) =>
                          handleEventOptionChange(
                            idx,
                            "placeName",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20">Amount:</label>
                    <input
                      type="number"
                      className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      value={evt.amount}
                      onChange={(e) =>
                        handleEventOptionChange(idx, "amount", e.target.value)
                      }
                    />
                  </div>
                  <button
                    className="btn btn-sm btn-error mt-2"
                    type="button"
                    onClick={() => handleRemoveEventOption(idx)}
                  >
                    Remove This Event
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                type="button"
                onClick={handleAddEventOption}
              >
                Add Event
              </button>
            </div>
          )}
        </EditModal>
      )}

      {/* Delete Confirmation Modal for Dynamic Field */}
      {isDeleteFieldModalOpen && (
        <DeleteConfirmModal
          message={`Are you sure you want to delete dynamic field "${fieldToDelete?.label}"?`}
          onConfirm={confirmDeleteField}
          onCancel={closeDeleteFieldModal}
        />
      )}

      {/* SECTION 3: REGISTRATIONS */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Registrations</h1>
        <button className="btn btn-secondary" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>
      {registrationsError && (
        <p className="text-red-500 mb-4">Error: {registrationsError}</p>
      )}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>S.No</th>
              {fields.map((f) => (
                <th key={f._id}>{f.label}</th>
              ))}
              <th>Created At</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={reg._id}>
                <td>{index + 1}</td>
                {fields.map((f) => (
                  <td key={f._id}>{reg.dynamicData?.[f.label] || ""}</td>
                ))}
                <td>
                  {reg.createdAt
                    ? new Date(reg.createdAt).toISOString().slice(0, 10)
                    : ""}
                </td>
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleViewRegistration(reg)}
                  >
                    <FaEye /> View
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteRegistration(reg._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={fields.length + 2} className="text-center py-4">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable View Modal for Registration Details */}
      {viewRegistration && (
        <ViewModal title="Registration Details" onClose={closeViewModal}>
          {fields.map((f) => (
            <p key={f._id}>
              <strong>{f.label}:</strong>{" "}
              {viewRegistration.dynamicData?.[f.label] || ""}
            </p>
          ))}
          <p>
            <strong>Created At:</strong>{" "}
            {viewRegistration.createdAt
              ? new Date(viewRegistration.createdAt).toLocaleDateString()
              : ""}
          </p>
        </ViewModal>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EventRegistrationManagement;
