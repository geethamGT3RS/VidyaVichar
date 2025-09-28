import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChartBarIcon,
    PowerIcon,
    ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

const MAPPING_TYPES = [
    { id: "course_student", title: "Course to Student", hint: "Map courses to enrolled students" },
    { id: "course_instructor", title: "Course to Instructor", hint: "Map courses to instructors" },
    { id: "course_ta", title: "Course to TA", hint: "Map courses to teaching assistants" },
];

export default function AdminPage() {
    const navigate = useNavigate();
    const [selectedMapping, setSelectedMapping] = useState("course_student");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    function goToDashboard() {
        navigate("/dashboard");
    }
    function handleLogout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
    }

    function onFileChange(e) {
        setFile(e.target.files?.[0] ?? null);
    }

    async function handleUpload(e) {
        e?.preventDefault();
        if (!file) return alert("Please select a file to upload.");
        setUploading(true);
        try {
            await new Promise((r) => setTimeout(r, 900)); // simulate upload
            alert(`Uploaded ${file.name} for ${selectedMapping} (${term})`);
            setFile(null);
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex flex-col">
            {/* Top bar */}
            <header className="w-full bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* logo + title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 7v10a2 2 0 0 0 2 2h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 3v4M8 3v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Title beside logo (requested) */}
                        <div className="hidden sm:block">
                            <span className="text-lg font-semibold text-slate-800">VidyaVichara</span>
                        </div>
                    </div>

                    {/* controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                        >
                            <PowerIcon className="w-5 h-5 text-rose-600" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-grow p-8 flex items-start justify-center">
                <div className="w-full max-w-4xl">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">Select a Mapping Type</h2>

                    {/* Mapping cards */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {MAPPING_TYPES.map((m) => {
                            const active = selectedMapping === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMapping(m.id)}
                                    className={`flex-1 group cursor-pointer border rounded-xl p-6 text-left transition-shadow flex flex-col justify-between
                    ${active ? "border-emerald-400 bg-white/90 shadow-md" : "border-slate-300 bg-white/50 hover:shadow-sm"}`}
                                    aria-pressed={active}
                                >
                                    <div>
                                        <div className={`text-md font-medium ${active ? "text-slate-900" : "text-slate-800"}`}>{m.title}</div>
                                        {/* single non-duplicated hint text */}
                                        <div className="text-sm text-teal-600 mt-3">{m.hint}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {/* Upload */}
                    <form onSubmit={handleUpload} className="text-center">
                        <label htmlFor="file-upload" className="inline-flex items-center justify-center gap-3 w-full md:w-1/2 mx-auto px-6 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-teal-400 bg-white/60">
                            <ArrowUpOnSquareIcon className="w-6 h-6 text-teal-600" />
                            <div className="text-left">
                                <div className="font-medium text-slate-800">Upload File</div>
                                <div className="text-xs text-slate-500">Upload a file in CSV format to update the database list</div>
                            </div>
                        </label>
                        <input id="file-upload" type="file" accept=".csv" onChange={onFileChange} className="hidden" />

                        <div className="mt-4">
                            <button type="submit" disabled={uploading} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 disabled:opacity-60">
                                {uploading ? "Uploading…" : "Start Upload"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Supported formats: <strong>CSV</strong>. Files should contain mappings matching the selected type.
                    </div>
                </div>
            </main>
        </div>
    );
}
