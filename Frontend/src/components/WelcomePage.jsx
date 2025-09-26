import React from "react";
import { useNavigate } from "react-router-dom";

const COURSES = [
    { id: "c1", code: "CS301", title: "System Design Principles", description: "Load balancing, caching, sharding, CAP theorem, scalability." },
    { id: "c2", code: "CS410", title: "Distributed Systems", description: "Distributed algorithms, consensus, cloud patterns." }
];
const INSTRUCTORS = [{ id: "u1", name: "Prof. Rao" }, { id: "u2", name: "Dr. Sharma" }];

export default function WelcomePage() {
    const navigate = useNavigate();
    const [courseId, setCourseId] = React.useState("");
    const [instrId, setInstrId] = React.useState("");

    const course = COURSES.find((c) => c.id === courseId);

    function openBoard(asInstructor = false) {
        if (!courseId || !instrId) return alert("Please select both Course and Instructor.");
        navigate(asInstructor ? `/instructor/${courseId}/${instrId}` : `/student/${courseId}/${instrId}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 gap-6 p-6 md:p-0">
                    {/* Left - controls */}
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7v10a2 2 0 0 0 2 2h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 3v4M8 3v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">VidyaVichara</h1>
                                <p className="text-sm text-slate-600">A clean live Q&A board for lectures — post, upvote, and triage questions without interrupting class.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-slate-700">Course</label>
                            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-200">
                                <option value="">Choose a course</option>
                                {COURSES.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
                            </select>

                            <label className="text-sm font-medium text-slate-700">Instructor</label>
                            <select value={instrId} onChange={(e) => setInstrId(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-200">
                                <option value="">Choose an instructor</option>
                                {INSTRUCTORS.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </select>

                            <div className="flex gap-3 mt-3">
                                <button onClick={() => openBoard(false)} className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow hover:scale-[1.01] transition">Open Student Board</button>
                                <button onClick={() => openBoard(true)} className="flex-1 border border-emerald-500 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 transition">Open Instructor</button>
                            </div>
                        </div>

                        <div className="mt-6 text-sm text-slate-600">
                            <strong>Tip:</strong> Encourage students to use concise questions and upvote ones they want answered — instructors can then filter quickly.
                        </div>
                    </div>

                    {/* Right - details */}
                    <aside className="p-8 bg-gradient-to-br from-slate-50 to-white md:flex md:flex-col md:justify-center">
                        <div className="rounded-lg p-6 border border-slate-100 shadow-sm bg-white">
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Course details</h3>
                            {course ? (
                                <>
                                    <div className="mb-2 text-slate-700"><strong>{course.code}</strong> — {course.title}</div>
                                    <div className="text-sm text-slate-600">{course.description}</div>
                                </>
                            ) : (
                                <div className="text-sm text-slate-600">Select a course on the left to view a short description and learning outcomes.</div>
                            )}

                            <div className="mt-6 grid grid-cols-1 gap-2">
                                <div className="text-xs text-slate-500">Features:</div>
                                <ul className="list-disc pl-5 text-slate-600">
                                    <li>Real-time posting & upvotes</li>
                                    <li>Instructor filters (unanswered, important)</li>
                                    <li>Export session archive for revision</li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
