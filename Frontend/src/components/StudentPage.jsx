import React from "react";
import { Link, useParams } from "react-router-dom";
import {
    HomeIcon,
    ShareIcon,
    ArrowPathIcon,
    PaperAirplaneIcon,
    HandThumbUpIcon,
} from "@heroicons/react/24/solid";

/* Local storage helper */
function useLocalLecture(key) {
    const [state, setState] = React.useState(() => {
        try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
    });
    React.useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [key, state]);
    return [state, setState];
}

export default function StudentQuestions() {
    const { courseId = "c1", instrId = "u1" } = useParams();
    const storageKey = `vv:${courseId}:${instrId}`;
    const [questions, setQuestions] = useLocalLecture(storageKey);
    const [text, setText] = React.useState("");

    // Replace this with backend-auth / profile name later
    const studentName = "Anonymous";

    function submit() {
        const t = text.trim();
        if (!t) return;
        if (questions.some(q => q.text.toLowerCase() === t.toLowerCase())) {
            return alert("A similar question was posted recently.");
        }
        const colors = ["#FFF2CC", "#FFE0E0", "#DCFCE7", "#DBEAFE", "#FFF0F6"];
        const q = {
            id: `q_${Date.now()}`,
            text: t,
            author: studentName,
            createdAt: new Date().toISOString(),
            status: "unanswered",
            upvotes: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
        setQuestions(s => [q, ...s]);
        setText("");
    }

    function upvote(id) {
        setQuestions(s => s.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q));
    }

    const unanswered = questions.filter(q => q.status !== "answered");
    const answered = questions.filter(q => q.status === "answered");

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white p-6 flex items-start justify-center">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Student Board</h2>
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
                            onClick={() => {
                                navigator.clipboard?.writeText(window.location.href);
                                alert("Link copied");
                            }}
                            className="flex items-center gap-1 px-3 py-2 border rounded text-slate-700"
                        >
                            <ShareIcon className="w-5 h-5" /> Share
                        </button>
                    </div>
                </div>

                {/* Input card */}
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        placeholder="Type your question here (required)..."
                        className="w-full border rounded p-3 resize-none"
                    />

                    <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-slate-500">
                            Tip: Keep it short — upvote questions you want answered.
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setText("")}
                                className="flex items-center gap-1 px-3 py-2 border rounded text-slate-700"
                            >
                                <ArrowPathIcon className="w-5 h-5" /> Reset
                            </button>
                            <button
                                onClick={submit}
                                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                                <PaperAirplaneIcon className="w-5 h-5 rotate-45" /> Post Question
                            </button>
                        </div>
                    </div>
                </div>

                {/* Two-column questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Unanswered */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">Unanswered</h3>
                            <div className="text-sm text-slate-600">{unanswered.length}</div>
                        </div>
                        <div className="space-y-4">
                            {unanswered.length === 0 && (
                                <div className="text-slate-500">
                                    No unanswered questions yet — ask one!
                                </div>
                            )}
                            {unanswered.map((q) => (
                                <article
                                    key={q.id}
                                    className="rounded-lg p-4 shadow-sm transform transition hover:scale-[1.01]"
                                    style={{ background: q.color }}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="pr-3">
                                            <div className="font-medium text-slate-800">{q.text}</div>
                                            <div className="text-xs text-slate-700 mt-1">
                                                {q.author} • {new Date(q.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                onClick={() => upvote(q.id)}
                                                className="flex items-center gap-1 px-2 py-1 bg-white/90 rounded text-sm font-medium"
                                            >
                                                <HandThumbUpIcon className="w-4 h-4" /> {q.upvotes}
                                            </button>
                                            <div className="mt-2 text-xs px-2 py-1 rounded bg-white/70 text-slate-800">
                                                Unanswered
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Answered */}
                    <aside>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">Answered</h3>
                            <div className="text-sm text-slate-600">{answered.length}</div>
                        </div>
                        <div className="space-y-4">
                            {answered.length === 0 && (
                                <div className="text-slate-500">No answered questions yet.</div>
                            )}
                            {answered.map((q) => (
                                <article
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
                                        <div className="px-3 py-2 text-sm rounded bg-slate-100 text-slate-700">
                                            Answered
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
