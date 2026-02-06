import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { Bell, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();
    /* ============================
       FETCH ADMIN NOTIFICATIONS
       ============================ */
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get("/notifications/admin");
            setNotifications(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch admin notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    /* ============================
       DELETE NOTIFICATION
       ============================ */
    const deleteNotification = async (id) => {
        if (!window.confirm("Delete this notification?")) return;

        try {
            setDeletingId(id);
            await api.delete(`/notifications/${id}`);
            setNotifications((prev) =>
                prev.filter((n) => n._id !== id)
            );
        } catch (err) {
            console.error("Failed to delete notification", err);
        } finally {
            setDeletingId(null);
        }
    };

    /* ============================
       UI STATES
       ============================ */
    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading notifications…</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Bell size={22} />
                <h1 className="text-2xl font-semibold">
                    Admin Notifications
                </h1>
            </div>

            <button
                onClick={() => navigate("/dashboard/notifications/create")}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                title="Create Notification"
            >
                Create Notification
            </button>

            {/* Empty State */}
            {notifications.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center shadow">
                    <p className="text-gray-500">
                        No notifications available.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className="p-5 rounded-lg border bg-white shadow-sm flex justify-between gap-4"
                        >
                            {/* Content */}
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {notification.title}
                                </h3>

                                <p className="text-sm text-gray-700 mt-1">
                                    {notification.message}
                                </p>

                                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                    <span>
                                        Type:{" "}
                                        <span className="font-medium uppercase">
                                            {notification.type}
                                        </span>
                                    </span>

                                    <span>
                                        Target:{" "}
                                        <span className="font-medium">
                                            {notification.targetType}
                                        </span>
                                    </span>

                                    <span>
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => deleteNotification(notification._id)}
                                disabled={deletingId === notification._id}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                title="Delete notification"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
