import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();
const app = express();

// cors policy setup
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["POST", "GET"],
    credentials: true,
}));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.error(err.message);
    });


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
