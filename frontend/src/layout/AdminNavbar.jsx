import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import navbarLogo from "../assets/images/navbarLogo.PNG";

export default function AdminNavbar({ title = "Dashboard" }) {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 h-16 w-full border-b bg-white">
            <div className="flex h-full items-center justify-between px-6">

                {/* ================= LEFT : BRAND ================= */}
                <div className="flex items-center gap-3">
                    <img
                        src={navbarLogo}
                        alt="FurniOS"
                        className="h-7 w-7 object-contain"  
                    />
                    <span className="text-lg font-semibold tracking-tight text-gray-900">
                        FurniOS Admin
                    </span>
                </div>


                {/* ================= CENTER : PAGE TITLE ================= */}
                <div className="flex-1 text-center">
                    <h1 className="text-sm font-medium text-gray-700">
                        {title}
                    </h1>
                </div>

                {/* ================= RIGHT : ACTIONS ================= */}
                <div className="relative flex items-center gap-4">

                    {/* Notification */}
                    <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100">
                        <Bell size={18} />
                    </button>

                    {/* Profile */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                            A
                        </div>
                        <ChevronDown size={16} className="text-gray-600" />
                    </button>

                    {/* ================= DROPDOWN ================= */}
                    {open && (
                        <div className="absolute right-0 top-12 w-48 rounded-md border bg-white shadow-sm">
                            <div className="border-b px-4 py-2">
                                <p className="text-sm font-medium text-gray-800">
                                    Admin User
                                </p>
                                <p className="text-xs text-gray-500">
                                    admin@furnios.com
                                </p>
                            </div>

                            <div className="py-1">
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                    Profile
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                    Settings
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}
