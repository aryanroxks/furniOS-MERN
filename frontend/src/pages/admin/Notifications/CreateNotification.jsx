import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { roles } from "../../../services/constants.js";

export default function CreateNotification() {
  const navigate = useNavigate();

  const [targetType, setTargetType] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [roleID, setRoleID] = useState("");
  const [userID, setUserID] = useState("");
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /* ============================
     FETCH USERS (for single target)
     ============================ */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all");
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  /* ============================
     SUBMIT
     ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Title and message are required");
      return;
    }

    if (targetType === "role" && !roleID) {
      alert("Please select a role");
      return;
    }

    if (targetType === "single" && !userID) {
      alert("Please select a user");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/notifications", {
        targetType,
        title,
        message,
        type: "announcement",
        createdBy: "admin",
        roleID: targetType === "role" ? roleID : null,
        userID: targetType === "single" ? userID : null,
      });

      navigate("/dashboard/notifications");
    } catch (err) {
      console.error("Failed to create notification", err);
      alert("Failed to create notification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Create Announcement
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-5"
      >
        {/* Target Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Target Audience
          </label>
          <select
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value);
              setRoleID("");
              setUserID("");
            }}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="all">All Users</option>
            <option value="role">By Role</option>
            <option value="single">Single User</option>
          </select>
        </div>

        {/* Role Selector (CONSTANT BASED) */}
        {targetType === "role" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Role
            </label>
            <select
              value={roleID}
              onChange={(e) => setRoleID(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">-- Select Role --</option>
              <option value={roles.retail_customer}>
                Retail Customer
              </option>
              <option value={roles.wholesale_customer}>
                Wholesale Customer
              </option>
            </select>
          </div>
        )}

        {/* User Selector */}
        {targetType === "single" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Select User
            </label>
            <select
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username || user.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Announcement title"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Write announcement message"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-[#100F57] text-white rounded-lg disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
