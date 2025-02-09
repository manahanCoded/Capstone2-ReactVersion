import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import env from "dotenv";
import cookieParser from "cookie-parser";


import User_Routes from "./src/Routes/User_Routes.mjs";
import Job_Routes from "./src/Routes/Job_Routes.mjs";
import Module_Routes from "./src/Routes/Module_Routes.mjs";
import Announcement_Routes from "./src/Routes/Announcement_Routes.mjs";
import Dashboard_Routes from "./src/Routes/Dashboard_Routes.mjs";
import Mail_Routes from "./src/Routes/Mail_Routes.mjs";
import QA_Routes from "./src/Routes/QA_Routes.mjs";

const app = express();
env.config();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    name: "Crypto_Warriors",
    secret: process.env.SECRET_COOKIE || "defaultSecret",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false, maxAge: 60 * 60000, signed: true },
    signed: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});


app.use("/api/user", User_Routes);
app.use("/api/job", Job_Routes);
app.use("/api/module", Module_Routes);
app.use("/api/announcement", Announcement_Routes);
app.use("/api/dashboard", Dashboard_Routes);
app.use("/api/mail", Mail_Routes);
app.use("/api/question-answer", QA_Routes);


export default app;
