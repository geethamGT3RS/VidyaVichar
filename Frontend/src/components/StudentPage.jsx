import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
    HomeIcon,
    ShareIcon,
    ArrowPathIcon,
    PaperAirplaneIcon,
    HandThumbUpIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

// A utility to assign a consistent, random-ish color to each question card
const COLORS = ["#FFF2CC", "#FFE0E0", "#DCFCE7", "#DBEAFE", "#FFF0F6"];
const getColorForId = (id) => {
    // Simple hash function to get a color based on the question ID string
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
};


export default function StudentQuestions() {
    const { courseId, instrId } = useParams(); // Get course and instructor from the URL
    const [questions, setQuestions] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [instructorEmail, setInstructorEmail] = useState(null);

     useEffect(() => {
        async function fetchInstructorEmail(name) {
            if (!name) return; // Don't fetch if instrId is not ready
            
            const url = new URL('/api/getuseremail', window.location.origin);
            url.searchParams.append('name', name);
            
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setInstructorEmail(data.email); // Store the email string in state
            } catch (error) {
                console.error("Could not fetch instructor email:", error);
                setError("Failed to verify instructor details.");
            }
        }

        fetchInstructorEmail(instrId);
    }, [instrId]);
    
    const fetchQuestions = useCallback(async () => {
        // Use a relative path to leverage the proxy and avoid CORS issues
        try {
            // Corrected: Use backticks (`) for template literals in the URL
            const response = await fetch(`/api/questions/instructor?courseName=${courseId}&instructorEmail=${instructorEmail}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseText = await response.text();
            const data = responseText ? JSON.parse(responseText) : [];
            
            // Map API response to the structure your component expects
            const formattedQuestions = data.map(q => ({
                id: q.questionId,
                text: q.question,
                author: q.questionAskedByName,
                createdAt: q.createdAt || new Date().toISOString(),
                status: q.questionAnswered ? "answered" : "unanswered",
                upvotes: q.upvotes || 0, // Assuming upvotes are not from backend yet
                color: getColorForId(q.questionId),
            }));

            // Sort unanswered questions to show newest first
            const sortedUnanswered = formattedQuestions
                .filter(q => q.status === 'unanswered')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            const answeredQuestions = formattedQuestions.filter(q => q.status === 'answered');

            setQuestions([...sortedUnanswered, ...answeredQuestions]);
            setError(null);
        } catch (e) {
            console.error("Failed to fetch questions:", e);
            setError("Could not load questions. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [courseId, instructorEmail]);

    // Fetch questions on initial load and set up polling to refresh every 5 seconds
    useEffect(() => {
        if (courseId && instructorEmail) {
            fetchQuestions();
            const intervalId = setInterval(fetchQuestions, 5000);
            // Cleanup interval on component unmount
            return () => clearInterval(intervalId);
        } else {
            setLoading(false);
            setError("Course and Instructor not selected. Please go back to the welcome page.");
        }
    }, [courseId, instructorEmail, fetchQuestions]);

    async function submit() {
        const t = text.trim();
        if (!t) return;

        if (!courseId || !instructorEmail) {
            alert("Cannot post question: Course and Instructor are not specified in the URL.");
            return;
        }

        try {
            // Use a relative path to leverage the proxy
            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: t,
                    askedByEmail: user.email,
                    courseName: courseId,
                    instructorEmail: instructorEmail, // Use the full email
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to post question');
            }
            
            setText("");
            // Fetch questions immediately to show the new one
            await fetchQuestions(); 

        } catch (e) {
            console.error("Error submitting question:", e);
            alert("There was an error posting your question.");
        }
    }

    // NOTE: This upvote function only updates the local state.
    // A backend endpoint would be needed to persist upvotes.
    function upvote(id) {
        setQuestions(s => s.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q));
    }

    const unanswered = questions.filter(q => q.status === "unanswered");
    const answered = questions.filter(q => q.status === "answered");

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-start justify-center font-sans">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Student Q&A Board</h2>
                        <div className="text-sm text-slate-600 mt-1">
                            Course: <strong>{courseId || "..."}</strong> • Instructor: <strong>{instrId || "..."}</strong>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3 sm:mt-0">
                        <Link to="/welcome" className="flex items-center gap-2 px-3 py-2 border rounded-md text-slate-700 bg-white hover:bg-slate-50 transition">
                            <HomeIcon className="w-5 h-5" /> Home
                        </Link>
                        <button
                            onClick={() => navigator.clipboard?.writeText(window.location.href)}
                            className="flex items-center gap-2 px-3 py-2 border rounded-md text-slate-700 bg-white hover:bg-slate-50 transition"
                        >
                            <ShareIcon className="w-5 h-5" /> Share Link
                        </button>
                    </div>
                </header>

                {/* Input card */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        placeholder="Type your question here..."
                        className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        disabled={!!error}
                    />
                    <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-slate-500">
                            Tip: Keep it short. Upvote questions you want answered!
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setText("")} className="flex items-center gap-1.5 px-3 py-2 border rounded-md text-slate-700 bg-slate-50 hover:bg-slate-100 transition" disabled={!!error}>
                                <ArrowPathIcon className="w-5 h-5" /> Reset
                            </button>
                            <button onClick={submit} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition shadow-sm disabled:opacity-50" disabled={!!error}>
                                <PaperAirplaneIcon className="w-5 h-5 -rotate-45" /> Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading and Error States */}
                {loading && <div className="text-center text-slate-500 py-10">Loading questions...</div>}
                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <ExclamationTriangleIcon className="w-6 h-6"/>
                        <span>{error}</span>
                    </div>
                )}

                {/* Two-column questions */}
                {!error && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Unanswered */}
                        <section>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-xl font-semibold text-slate-800">Unanswered</h3>
                                <div className="text-sm font-medium text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">{unanswered.length}</div>
                            </div>
                            <div className="space-y-4">
                                {unanswered.length === 0 && (
                                    <div className="text-slate-500 bg-white p-4 rounded-lg shadow-sm">No unanswered questions yet. Ask one!</div>
                                )}
                                {unanswered.map((q) => (
                                    <article key={q.id} className="rounded-lg p-4 shadow-sm transition hover:shadow-md" style={{ background: q.color }}>
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="pr-3">
                                                <p className="font-medium text-slate-800">{q.text}</p>
                                                <div className="text-xs text-slate-700 mt-1.5">
                                                    {q.author} • {new Date(q.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                <button onClick={() => upvote(q.id)} className="flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md text-sm font-medium hover:bg-white transition">
                                                    <HandThumbUpIcon className="w-4 h-4 text-emerald-600" /> {q.upvotes}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {/* Answered */}
                        <aside>
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-xl font-semibold text-slate-800">Answered</h3>
                                <div className="text-sm font-medium text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">{answered.length}</div>
                            </div>
                            <div className="space-y-4">
                                 {answered.length === 0 && (
                                    <div className="text-slate-500 bg-white p-4 rounded-lg shadow-sm">No answered questions yet.</div>
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
                )}
            </div>
        </div>
    );
}

