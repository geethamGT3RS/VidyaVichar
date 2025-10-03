import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChartBarIcon,
    PowerIcon,
    ArrowUpOnSquareIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

// Enhanced mapping configuration with API details
const MAPPING_TYPES = [
    {
        id: "course_student",
        title: "Course to Student",
        hint: "Map courses to enrolled students",
        apiUrl: "api/admin/student-mapping",
        emailKey: "studentEmail",
    },
    {
        id: "course_instructor",
        title: "Course to Instructor",
        hint: "Map courses to instructors",
        apiUrl: "api/admin/instructor-mapping",
        emailKey: "instructorEmail",
    },
    {
        id: "course_ta",
        title: "Course to TA",
        hint: "Map courses to teaching assistants",
        apiUrl: "api/admin/ta-mapping",
        emailKey: "taEmail",
    },
];

export default function AdminPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [selectedMapping, setSelectedMapping] = useState("course_student");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });


    function goToDashboard() {
        navigate("/dashboard");
    }
    function handleLogout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/");
    }

    function onFileChange(e) {
        setFile(e.target.files?.[0] ?? null);
        setStatusMessage({ type: '', text: '' }); // Reset status on new file selection
    }

    async function handleUpload(e) {
        e?.preventDefault();
        if (!file) {
            setStatusMessage({ type: 'error', text: 'Please select a file to upload.' });
            return;
        }

        const mappingConfig = MAPPING_TYPES.find(m => m.id === selectedMapping);
        if (!mappingConfig) {
            setStatusMessage({ type: 'error', text: 'Invalid mapping type selected.' });
            return;
        }

        setUploading(true);
        setStatusMessage({ type: 'info', text: 'Processing file...' });

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target.result;
                const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    throw new Error("CSV file is empty or contains only a header.");
                }

                const headers = lines[0].split(',').map(h => h.trim());
                const courseNameIndex = headers.indexOf('courseName');
                const emailIndex = headers.indexOf(mappingConfig.emailKey);

                if (courseNameIndex === -1 || emailIndex === -1) {
                    throw new Error(`CSV must contain 'courseName' and '${mappingConfig.emailKey}' headers.`);
                }

                const dataRows = lines.slice(1);
                const token = localStorage.getItem("authToken");

                if (!token) {
                    throw new Error("Authentication token not found. Please log in again.");
                }
                
                setStatusMessage({ type: 'info', text: `Uploading ${dataRows.length} records...` });

                const uploadPromises = dataRows.map(row => {
                    const values = row.split(',');
                    const payload = {
                        courseName: values[courseNameIndex]?.trim(),
                        [mappingConfig.emailKey]: values[emailIndex]?.trim(),
                    };
                    
                    if (!payload.courseName || !payload[mappingConfig.emailKey]) {
                        return Promise.resolve({ status: 'rejected', reason: `Skipped empty row: ${row}` });
                    }

                    return fetch(mappingConfig.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });
                });

                const results = await Promise.allSettled(uploadPromises);
                
                const successCount = results.filter(res => res.status === 'fulfilled' && res.value.ok).length;
                const failedCount = results.length - successCount;

                if (failedCount > 0) {
                     setStatusMessage({ type: 'error', text: `Upload complete. Successful: ${successCount}, Failed: ${failedCount}.` });
                } else {
                     setStatusMessage({ type: 'success', text: `Successfully uploaded all ${successCount} records!` });
                }

            } catch (err) {
                setStatusMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
                console.error("Upload error:", err);
            } finally {
                setUploading(false);
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };

        reader.onerror = () => {
             setStatusMessage({ type: 'error', text: 'Failed to read the file.' });
             setUploading(false);
        }

        reader.readAsText(file);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex flex-col">
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

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-slate-800">Data Mapping Upload</h1>
                    <p className="mt-2 text-slate-500">
                        Select the type of mapping and upload the corresponding CSV file.
                    </p>

                    <form onSubmit={handleUpload} className="mt-8 text-center">
                        <div className="text-lg font-semibold text-slate-700 mb-2">1. Select Mapping Type</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                            {MAPPING_TYPES.map((type) => (
                                <div key={type.id}>
                                    <input
                                        type="radio"
                                        id={type.id}
                                        name="mappingType"
                                        value={type.id}
                                        checked={selectedMapping === type.id}
                                        onChange={() => setSelectedMapping(type.id)}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor={type.id}
                                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            selectedMapping === type.id
                                                ? "bg-teal-50 border-teal-500 shadow-md"
                                                : "bg-white border-slate-300 hover:border-slate-400"
                                        }`}
                                    >
                                        <div className="font-bold text-slate-800">{type.title}</div>
                                        <div className="text-sm text-slate-500">{type.hint}</div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="text-lg font-semibold text-slate-700 mt-8 mb-2">2. Upload CSV File</div>
                        
                        <label htmlFor="file-upload" className="inline-flex items-center justify-center gap-3 w-full md:w-2/3 mx-auto px-6 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-teal-400 bg-white/60">
                            <ArrowUpOnSquareIcon className="w-8 h-8 text-teal-600" />
                            <div className="text-left">
                                <div className="font-medium text-slate-800">{file ? file.name : "Click to Upload File"}</div>
                                <div className="text-xs text-slate-500">Upload a file in CSV format with required headers.</div>
                            </div>
                        </label>
                        <input ref={fileInputRef} id="file-upload" type="file" accept=".csv" onChange={onFileChange} className="hidden" />

                        {statusMessage.text && (
                             <div className={`mt-4 text-sm flex items-center justify-center gap-2 ${
                                statusMessage.type === 'success' ? 'text-green-600' :
                                statusMessage.type === 'error' ? 'text-red-600' : 'text-slate-600'
                             }`}>
                                 {statusMessage.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
                                 {statusMessage.type === 'error' && <ExclamationCircleIcon className="w-5 h-5" />}
                                 {statusMessage.text}
                             </div>
                        )}

                        <div className="mt-6">
                            <button type="submit" disabled={uploading || !file} className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
                                {uploading ? "Uploading..." : "Start Upload"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 border-t pt-6">
                        Supported format: <strong>CSV</strong>. Ensure your file contains the correct columns:
                        <code className="bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-xs mx-1">courseName</code> and
                        <code className="bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-xs mx-1">{MAPPING_TYPES.find(m => m.id === selectedMapping)?.emailKey}</code>.
                    </div>
                </div>
            </main>
        </div>
    );
}
