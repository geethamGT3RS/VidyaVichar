# VidyaVichar
**Problem Code: VidyaVichar**

Vidya Vichara is a classroom Q&A sticky board where students can post questions in real-time during lectures. The system must be built using the MERN stack, where React handles the interactive frontend, Express + Node.js manages the backend logic, and MongoDB stores all questions, statuses, and timestamps.

---

### 🛠️ Technologies Used
This application is built using the **MERN** stack, which ensures questions are persistently saved, retrievable across sessions, and available for later review and analytics.

---

### 💭 Assumptions
The following assumptions were made during the development of this application:
* The VidyaVichar  Questions DB is live and relevant for only a term and the data will be refreshed at the end of the term.
* Users will be signing in with their institute email ID and map their name to the email ID in the signup form.
* An Admin user will upload the mapping of a Course to Instructor to TA to Students before any other users sign in.
* The system will not handle any actions related to answers and any next steps as getting vocal answers is not possible at the moment.
* The email ID is a unique identifier and a user can have 1 role only (You cannot be a TA and student with the same email ID at the same time).

---

### ⚙️ Application Functionality
The application provides different views and functionalities based on the user's role.

#### **1. Admin Console**
The Admin manages course mappings by uploading CSV files. The Admin ID will upload a CSV file with a specific format for creating courses and adding instructors, TAs, and students.
* **Course to Instructor Mapping**: `<course name>,<course description>,<instructor email>`
* **Course to TA Mapping**: `<course name>,<TA email>`
* **Course to Student Mapping**: `<course name>,<student email>`
* **Note**: The same CSV format is used for both initial creation and adding new entries. There is currently no way to modify or delete a mapping once it's added. The file size is restricted to 5MB.

#### **2. User Signup**
* **Authentication**: Signup and password management are handled through an OTP to the provided email address.
* **Role Selection**: On signup, a user must provide a display name and choose a single role (instructor, TA, or student).
* **Email Matching**: The email used for signup must match an email the admin has uploaded in the course maps for the user to be able to see data.

#### **3. Student View**
* Students must choose the class they are attending after logging into the application.
* They can view current live questions in the course and add a new question.
* Students can upvote an existing question.

#### **4. Instructor View**
* Instructors need to select the course from the courses mapped to their email ID.
* They can see the current live questions.
* Instructors can mark a question as answered and can mark the class as closed, which makes the questions not visible to instructor or student roles.


### 🖼️ Solution Diagram
This diagram illustrates the architecture of the VidyaVichar application, showing how the different components of the MERN stack interact to provide a seamless user experience.

![Architecture Diagram](/solutiondiagram.jpeg)

---

### 💻 Implementation Details
The application is built on the **MERN** (MongoDB, Express, React, Node.js) stack. All data is stored in the MongoDB in Atlas cloud. The backend interacts with a Node.js layer for appropriate queries, with Express acting as the middleware. All frontend rendering and interaction is handled by React.js.

#### **Frontend**
* **React**: Provides the basic rendering and interaction.

#### **Middleware**
* **Multer**: This package helps in uploading and processing small files.
* **CSV-Parser**: This package helps in parsing the CSV files.

#### **Backend**
* **Nodemon**: It monitors the project directory and automatically restarts the application when it detects changes, which helps in speedy development.
* **dotenv**: It helps in maintaining the environment variables associated with the backend layer.

#### **Database Design**
The database hosted on MongoDB Atlas is used to store details such as question text, author, status, and timestamp, enabling questions to be saved across sessions and reviewed later.

---

### 🚀 Setup Instructions
To set up the application, we need to follow the following steps.

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/geethamGT3RS/VidyaVichar.git](https://github.com/geethamGT3RS/VidyaVichar.git)
    ```
2.  **Install Backend Dependencies**:
    Go to the backend folder and run the following commands.
    ```bash
    npm install
    npm install express
    npm install dotenv
    npm install -g nodemon
    npm install mongodb
    npm install multer csv-parser
    ```
3.  **Install Frontend Dependencies**:
    Go to the Frontend folder and run the below commands to install.
    ```bash
    npm install
    ```
4.  **Run the Application (in bash)**:
    * In the `Backend` folder, run `node server.js`.
    * In the `Frontend` folder, run `npm start`.

Git Repository: https://github.com/geethamGT3RS/VidyaVichar.

````