import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users";
import cors from "cors";

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("hello from server");
});
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.DB_URL as string)
    .then(() =>
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    )
    .catch((err) => console.log(err.message));
