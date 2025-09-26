import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import StudentQuestions from "./components/StudentPage";
import InstructorPage from "./components/InstructorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/student/:courseId/:instrId" element={<StudentQuestions />} />
        <Route path="/instructor/:courseId/:instrId" element={<InstructorPage />} />
      </Routes>
    </Router>
  );
}
