import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import env from "dotenv";
import cookieParser from "cookie-parser";
import pgSession from "connect-pg-simple";

// ROUTES
import User_Routes from "./src/Routes/User_Routes.mjs";
import Job_Routes from "./src/Routes/Job_Routes.mjs";
import Module_Routes from "./src/Routes/Module_Routes.mjs";
import Announcement_Routes from "./src/Routes/Announcement_Routes.mjs";
import Dashboard_Routes from "./src/Routes/Dashboard_Routes.mjs";
import Mail_Routes from "./src/Routes/Mail_Routes.mjs";
import QA_Routes from "./src/Routes/QA_Routes.mjs";
import db from "./src/Database/DB_Connect.mjs";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

env.config();

const pgStore = pgSession(session);
app.use(
  session({
    store: new pgStore({
      pool: db,
      createTableIfMissing: true,
    }),
    name: "Crypto_Warriors",
    secret: process.env.SECRET_COOKIE || "defaultSecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);


app.set('trust proxy', 1);

app.use(
  cors({
    origin: [
      `${process.env.CLIENT_URL}`,
      "http://localhost:5173"
    ],
    credentials: true,
  })
);


app.use(passport.initialize());
app.use(passport.session());



app.use("/api/user", User_Routes);
app.use("/api/job", Job_Routes);
app.use("/api/module", Module_Routes);
app.use("/api/announcement", Announcement_Routes);
app.use("/api/dashboard", Dashboard_Routes);
app.use("/api/mail", Mail_Routes);
app.use("/api/question-answer", QA_Routes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
