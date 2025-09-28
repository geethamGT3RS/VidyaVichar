import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import StudentQuestions from "./components/StudentPage";
import InstructorPage from "./components/InstructorPage";
import UserAuth from './components/UserAuth'
import OTPVerification from './components/OTPVerification'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import WelcomeStudent from './components/WelcomeStudent';
import WelcomeInstructor from './components/WelcomeInstructor';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/student/:courseId/:instrId" element={<StudentQuestions />} />
        <Route path="/instructor/:courseId/:instrId" element={<InstructorPage />} />
        <Route path="/createuser" element={<UserAuth/>}/>
          <Route path="/" element={<Login/>} />
          <Route path="/getotp" element={<OTPVerification/>} />
          <Route path="/welcome" element={<h1>Welcome</h1>} />
          <Route path="/welcomestudent" element={<WelcomeStudent/>} />
          <Route path="/welcomeinstructor" element={<WelcomeInstructor/>} />
          <Route path="/forgetpasswordotp" element={<ForgotPassword/>}/> 
          <Route path="/resetpassword" element={<ResetPassword/>}/> 
       </Routes>
    </Router>
  );
}
