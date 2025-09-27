// src/pages/InstructorPage.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
    HomeIcon,
    ArchiveBoxArrowDownIcon,
    TrashIcon,
    ClipboardDocumentIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/solid";

/* local storage helper */
function useLocalLecture(key) {
    const [state, setState] = React.useState(() => {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    });
    React.useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [key, state]);
    return [state, setState];
}

export default function InstructorPage() {
    const { courseId = "c1", instrId = "u1" } = useParams();
    const storageKey = `vv:${courseId}:${instrId}`;
    const [questions, setQuestions] = useLocalLecture(storageKey);
    const [filter, setFilter] = React.useState("all");

    function markAnswered(id) {
        setQuestions((s) =>
            s.map((q) =>
                q.id === id ? { ...q, status: "answered", answeredAt: new Date().toISOString() } : q
            )
        );
    }

    function clearAnswered() {
        if (!confirm("Clear all answered questions?")) return;
        setQuestions((s) => s.filter((q) => q.status !== "answered"));
    }

    function archiveAndClose() {
        if (!confirm("Archive current session and clear board?")) return;
        const archived = { closedAt: new Date().toISOString(), questions };
        localStorage.setItem(`vv:archive:${storageKey}`, JSON.stringify(archived));
        setQuestions([]);
        alert("Session archived locally.");
    }

    const filtered = questions.filter((q) =>
        filter === "all" ? true : filter === "unanswered" ? q.status !== "answered" : q.status === "answered"
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6 flex items-center justify-center">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Instructor Dashboard</h2>
                        <div className="text-sm text-slate-600">
                            Lecture: <strong>{courseId}</strong> • Instructor: <strong>{instrId}</strong>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to="/"
                            className="flex items-center gap-1 px-3 py-2 border rounded text-slate-700"
                        >
                            <HomeIcon className="w-5 h-5" /> Home
                        </Link>
                        <button
                            onClick={archiveAndClose}
                            className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            <ArchiveBoxArrowDownIcon className="w-5 h-5" /> Archive & Close
                        </button>
                    </div>
                </div>

                {/* Filter + Actions */}
                <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-slate-600">Filter</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border rounded p-2"
                        >
                            <option value="all">All</option>
                            <option value="unanswered">Unanswered</option>
                            <option value="answered">Answered</option>
                        </select>
                    </div>

                    <div className="ml-auto flex gap-2">
                        <button
                            onClick={clearAnswered}
                            className="flex items-center gap-1 px-3 py-2 border rounded text-slate-700"
                        >
                            <TrashIcon className="w-5 h-5 text-rose-600" /> Clear Answered
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard?.writeText(JSON.stringify(questions));
                                alert("Questions JSON copied");
                            }}
                            className="flex items-center gap-1 px-3 py-2 border rounded text-slate-700"
                        >
                            <ClipboardDocumentIcon className="w-5 h-5 text-indigo-600" /> Copy JSON
                        </button>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-3">
                    {filtered.length === 0 && (
                        <div className="text-slate-500">No questions match this filter.</div>
                    )}
                    {filtered.map((q) => (
                        <div
                            key={q.id}
                            className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-start"
                        >
                            <div>
                                <div className="font-medium text-slate-800">{q.text}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {q.author} • {new Date(q.createdAt).toLocaleString()}
                                </div>
                                {q.answeredAt && (
                                    <div className="text-xs text-emerald-600 mt-2">
                                        Answered at {new Date(q.answeredAt).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="text-sm">{q.upvotes} ⬆</div>
                                {q.status !== "answered" ? (
                                    <button
                                        onClick={() => markAnswered(q.id)}
                                        className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded"
                                    >
                                        <CheckCircleIcon className="w-5 h-5" /> Mark as answered
                                    </button>
                                ) : (
                                    <div className="px-3 py-2 text-sm rounded bg-slate-100 text-slate-700">
                                        Answered
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
