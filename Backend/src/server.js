import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import questionRouter from "./routes/questionRouter.js";
import courseMappingRouter from "./routes/courseMappingRouter.js";
import { connectDB } from "./config/db.js";


dotenv.config();

const app = express();
app.use(express.json());

// other middlewares
app.use("/api/questions", questionRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseMappingRouter);

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
    });
  });
}

export default app;