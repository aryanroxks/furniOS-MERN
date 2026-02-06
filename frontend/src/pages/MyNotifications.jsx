import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { CheckCircle, Bell } from "lucide-react";

export default function MyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  /* ============================
     FETCH USER NOTIFICATIONS
     ============================ */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications/my");
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ============================
     MARK SINGLE AS READ
     ============================ */
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, status: "read" } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  /* ============================
     MARK ALL AS READ
     ============================ */
  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await api.patch("/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "read" }))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(
    (n) => n.status === "unread"
  ).length;

  /* ============================
     UI STATES
     ============================ */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-center text-gray-500">
          Loading notifications…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Bell size={22} />
          Notifications
        </h1>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingAll}
            className="text-sm px-4 py-2 bg-[#100F57] text-white rounded-lg hover:opacity-90 disabled:opacity-60"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center shadow">
          <p className="text-gray-500">
            You have no notifications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-5 rounded-lg border shadow-sm flex items-start justify-between gap-4
                ${
                  notification.status === "unread"
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200"
                }`}
            >
              {/* Content */}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {notification.title}
                </h3>

                <p className="text-sm text-gray-700 mt-1">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              {notification.status === "unread" && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  title="Mark as read"
                  className="text-green-600 hover:text-green-800"
                >
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
