import express from "express";
import dotenv from "dotenv";
import userRouter from "./src/routes/userRouter.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();


// Routes
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
    });
  });
}

export default app;