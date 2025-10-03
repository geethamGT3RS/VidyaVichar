// src/pages/InstructorPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    HomeIcon,
    ArchiveBoxArrowDownIcon,
    TrashIcon,
    ClipboardDocumentIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/solid";

/*
  InstructorPage with top bar (logo only) and actions moved into top bar.
  Expects same backend endpoints as before.
*/


/* Helper: convert backend question => UI question object */
function mapBackendToUI(q) {
    return {
        id: q.questionId,
        text: q.question,
        author: q.askedByEmail,
        createdAt: q.askedAt ?? q.createdAt,
        status: q.questionAnswered ? "answered" : "unanswered",
        answeredAt: q.answeredAt,
        raw: q,
    };
}

export default function InstructorPage() {
    const navigate = useNavigate();
    const { courseId, instrId } = useParams();
    const courseName = courseId;
    const instructorEmail = instrId ;
    const [instructorName, setInstructorName] = useState(instrId);
    const [questions, setQuestions] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);

    // Add this useEffect hook inside your InstructorPage component
    useEffect(() => {
        // Don't run if instrId isn't available yet
        if (!instrId) return;

        const fetchInstructorName = async () => {
            try {
                const response = await fetch(`/api/getusername?email=${instrId}`);
                if (!response.ok) {
                    // If the fetch fails, we'll just keep showing the email
                    console.error("Failed to fetch instructor name");
                    return;
                }
                const data = await response.json();

                // Assuming your API returns { userName: 'Bidisha Shaw' }
                // based on the database document you showed me.
                if (data.userName) {
                    setInstructorName(data.userName);
                }

            } catch (error) {
                console.error("Error fetching instructor name:", error);
            }
        };

        fetchInstructorName();
    }, [instrId]); // This effect runs when the component mounts and when instrId changes

    // Fetch questions from backend
    async function fetchQuestions() {
        setLoading(true);
        try {
            const res = await fetch(`/api/questions/instructor?courseName=${courseId}&instructorEmail=${instructorEmail}`);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to fetch questions");
            }
            const data = await res.json();
            const ui = (data || []).map(mapBackendToUI);
            setQuestions(ui);
        } catch (err) {
            console.error("fetchQuestions error:", err);
            alert("Failed to load questions from server.");
        } finally {
            setLoading(false);
        }
    }
    const questionId =

        useEffect(() => {
            fetchQuestions();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [courseName, instructorEmail]);

    async function markAnswered(id) {
        if (!confirm("Mark this question as answered?")) return;
        try {
            const res = await fetch(
                `/api/questions/${id}/answered?courseName=${courseName}&instructorEmail=${instructorEmail}`,
                { method: "PATCH" }
            );
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to mark answered");
            }
            const updated = await res.json();
            setQuestions((s) => s.map((q) => (q.id === id ? mapBackendToUI(updated) : q)));
        } catch (err) {
            console.error("markAnswered error:", err);
            alert("Failed to mark question as answered.");
        }
    }

    async function clearAnswered() {
        if (!confirm("Clear all answered questions?")) return;
        try {
            const res = await fetch(
                `/api/questions/answered?courseName=${courseName}&instructorEmail=${instructorEmail}`,
                { method: "DELETE" }
            );
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to clear answered");
            }
            const result = await res.json();
            alert(`Deleted ${result.deleted || result.deletedCount || 0} answered questions.`);
            fetchQuestions();
        } catch (err) {
            console.error("clearAnswered error:", err);
            alert("Failed to clear answered questions.");
        }
    }

    async function archiveAndClose() {
        if (!confirm("Archive current session and clear board?")) return;
        try {
            const res = await fetch(`/api/courses/archive?courseName=${courseName}&instructorEmail=${instructorEmail}`, {
                method: "PATCH"
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Failed to archive");
            }
            const result = await res.json();
            setQuestions([]);
            alert("Session archived: " + (result.archiveId ?? "done"));
        } catch (err) {
            console.error("archiveAndClose error:", err);
            alert("Failed to archive session.");
        }
    }

    function copyJSON() {
        navigator.clipboard?.writeText(JSON.stringify(questions.map((q) => q.raw ?? q)));
        alert("Questions JSON copied");
    }

    const filtered = questions.filter((q) =>
        filter === "all" ? true : filter === "unanswered" ? q.status !== "answered" : q.status === "answered"
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
            {/* Top bar: logo left, controls right (no title) */}
            <header className="w-full bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Left: Logo + Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M3 7v10a2 2 0 0 0 2 2h14"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M16 3v4M8 3v4"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                            VidyaVichara
                        </h1>
                    </div>
                    {/* controls: home + archive */}
                    <div className="flex items-center gap-3">
                        <Link to="/welcome" className="inline-flex items-center gap-2 px-3 py-2 border rounded text-slate-700 hover:bg-slate-50">
                            <HomeIcon className="w-5 h-5" />
                            <span className="hidden md:inline">Home</span>
                        </Link>

                        <button
                            onClick={archiveAndClose}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                            <span className="hidden md:inline">End class</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <main className="flex-grow p-6 flex items-start justify-center">
                <div className="w-full max-w-6xl">
                    {/* Page heading (below top bar) */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-800">Instructor Dashboard</h2>
                        <div className="text-sm text-slate-600">
                            Lecture: <strong>{courseName}</strong> • Instructor: <strong>{instructorName}</strong>
                        </div>
                    </div>

                    {/* Filter + Actions */}
                    <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-slate-600">Filter</label>
                            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded p-2">
                                <option value="all">All</option>
                                <option value="unanswered">Unanswered</option>
                                <option value="answered">Answered</option>
                            </select>
                        </div>

                      
                    </div>

                    {/* Questions */}
                    <div className="space-y-3">
                        {loading && <div className="text-slate-500">Loading questions…</div>}
                        {!loading && filtered.length === 0 && <div className="text-slate-500">No questions match this filter.</div>}

                        {filtered.map((q) => (
                            <div key={q.id} className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-slate-800">{q.text}</div>
                                    <div className="text-xs text-slate-500 mt-1">{q.author} • {new Date(q.createdAt).toLocaleString()}</div>
                                    {q.answeredAt && <div className="text-xs text-emerald-600 mt-2">Answered at {new Date(q.answeredAt).toLocaleTimeString()}</div>}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-sm">0 ⬆</div>

                                    {q.status !== "answered" ? (
                                        <button onClick={() => markAnswered(q.id)} className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded">
                                            <CheckCircleIcon className="w-5 h-5" /> Mark as answered
                                        </button>
                                    ) : (
                                        <div className="px-3 py-2 text-sm rounded bg-slate-100 text-slate-700">Answered</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
