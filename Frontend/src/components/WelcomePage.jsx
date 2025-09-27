// src/pages/WelcomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChartBarIcon,
    PowerIcon,
    UserGroupIcon,
    AcademicCapIcon,
} from "@heroicons/react/24/solid";

export default function WelcomePage() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [instructorName, setInstructorName] = useState("");
    const [error, setError] = useState(null);

    // Effect to fetch initial course data
    useEffect(() => {
        async function fetchData() {
            try {
                // As requested, hardcoding the student email for the API call
                const studentEmail = 'bidisha@example.com';
                const response = await fetch(`/api/courses/student/${studentEmail}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Server responded with ${response.status}`);
                }
                
                const data = await response.json();

                // Store courses with a placeholder description
                const formattedCourses = data.map(course => ({
                    ...course,
                    description: 'Select a course to see more details.' 
                }));
                setCourses(formattedCourses);
                
            } catch (e) {
                console.error("Failed to fetch course data:", e);
                setError("Could not load course data. Please try again later.");
            }
        }

        fetchData();
    }, []); // Empty dependency array ensures this runs once on component mount

    // Effect to update instructors when a course is selected
    useEffect(() => {
        if (courseName) {
            const selectedCourse = courses.find(c => c.courseName === courseName);
            if (selectedCourse && selectedCourse.instructorNames) {
                const formattedInstructors = selectedCourse.instructorNames.map(name => ({
                    id: name, // Use name as a unique key
                    name: name
                }));
                setInstructors(formattedInstructors);
            }
        } else {
            // If no course is selected, clear the instructors list
            setInstructors([]);
        }
        // Reset instructor selection when the course changes
        setInstructorName("");
    }, [courseName, courses]);


    const course = courses.find((c) => c.courseName === courseName);

    function openBoard(asInstructor = false) {
        if (!courseName || !instructorName) {
            alert("Please select both a Course and an Instructor.");
            return;
        }
        // Note: Passing names in the URL. Ensure your routing setup can handle this.
        navigate(asInstructor ? `/instructor/${courseName}/${instructorName}` : `/student/${courseName}/${instructorName}`);
    }

    function goToDashboard() {
        navigate("/dashboard");
    }

    function handleLogout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
            {/* Top navigation bar */}
            <header className="w-full bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
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

                    {/* Right: Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={goToDashboard}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                        >
                            <ChartBarIcon className="w-5 h-5" /> Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                        >
                            <PowerIcon className="w-5 h-5 text-rose-600" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-5xl">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 gap-6 p-6 md:p-0">
                        {/* Left - controls */}
                        <div className="p-8">
                            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-700">Course</label>
                                <select
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                                >
                                    <option value="">Choose a course</option>
                                    {courses.map((c) => (
                                        <option key={c.courseName} value={c.courseName}>
                                            {c.courseName}
                                        </option>
                                    ))}
                                </select>

                                <label className="text-sm font-medium text-slate-700">Instructor</label>
                                <select
                                    value={instructorName}
                                    onChange={(e) => setInstructorName(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    disabled={!courseName || instructors.length === 0}
                                >
                                    <option value="">Choose an instructor</option>
                                    {instructors.map((i) => (
                                        <option key={i.id} value={i.name}>
                                            {i.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex gap-3 mt-3">
                                    <button
                                        onClick={() => openBoard(false)}
                                        className="flex-1 inline-flex items-center gap-2 justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow hover:scale-[1.01] transition disabled:opacity-50"
                                        disabled={!courseName || !instructorName}
                                    >
                                        <UserGroupIcon className="w-5 h-5" /> Student Board
                                    </button>

                                    <button
                                        onClick={() => openBoard(true)}
                                        className="flex-1 inline-flex items-center gap-2 justify-center border border-emerald-500 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50 transition disabled:opacity-50"
                                        disabled={!courseName || !instructorName}
                                    >
                                        <AcademicCapIcon className="w-5 h-5" /> Instructor
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 text-sm text-slate-600">
                                <strong>Tip:</strong> Encourage students to use concise questions and upvote
                                ones they want answered — instructors can then filter quickly.
                            </div>
                        </div>

                        {/* Right - details */}
                        <aside className="p-8 bg-gradient-to-br from-slate-50 to-white md:flex md:flex-col md:justify-center">
                            <div className="rounded-lg p-6 border border-slate-100 shadow-sm bg-white">
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">Course details</h3>
                                {course ? (
                                    <>
                                        <div className="mb-2 text-slate-700">
                                            <strong>{course.courseName}</strong>
                                        </div>
                                        <div className="text-sm text-slate-600">{course.description}</div>
                                    </>
                                ) : (
                                    <div className="text-sm text-slate-600">
                                        Select a course on the left to view a short description and learning
                                        outcomes.
                                    </div>
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
            </main>
        </div>
    );
}

