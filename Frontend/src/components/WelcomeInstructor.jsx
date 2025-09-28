import React from 'react';

const WelcomeInstructor = () => {
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  return (
    <div>
      <h1>Welcome Instructor</h1>
      <p>Name: {userName}</p>
      <p>Email: {userEmail}</p>
      <p>Role: {userRole}</p>
    </div>
  );
};

export default WelcomeInstructor;
