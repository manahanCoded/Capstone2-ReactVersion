import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import env from "dotenv";
import cookieParser from "cookie-parser";
import pgSession from "connect-pg-simple";

//ROUTES
import User_Routes from "./src/Routes/User_Routes.mjs";
import Job_Routes from "./src/Routes/Job_Routes.mjs";
import Module_Routes from "./src/Routes/Module_Routes.mjs"
import Announcement_Routes from "./src/Routes/Announcement_Routes.mjs"
import Dashboard_Routes from "./src/Routes/Dashboard_Routes.mjs"
import Mail_Routes from "./src/Routes/Mail_Routes.mjs"
import QA_Routes from "./src/Routes/QA_Routes.mjs"
import db from "./src/Database/DB_Connect.mjs";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());

env.config();

try {
  const pgStore = pgSession(session);
  app.use(
    session({
      store: new pgStore({
        pool: db,
        tableName: "session",
        createTableIfMissing: true,
      }),
      name: "Crypto_Warriors",
      secret: process.env.SECRET_COOKIE || "defaultSecret",
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: true, // Set to true only in production
        httpOnly: true,
        sameSite: "none" , // Use 'none' in production, 'lax' in development
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    })
  );

  console.log("Session store initialized!");
} catch (error) {
  console.error("Error setting up session store:", error);
}

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [
      "https://cryptowarriors.netlify.app",
    ],
    credentials: true, // ✅ Important for cookies & sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log(`Session data: ${JSON.stringify(req.session)}`);
  console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
  db.query('SELECT * FROM session', (err, res) => {
  if (err) {
    console.error('Error querying session table:', err);
  } else {
    console.log('Session table data:');
  }
});
  next();
});


app.use("/api/user", User_Routes);
app.use("/api/job", Job_Routes);
app.use("/api/module", Module_Routes)
app.use("/api/announcement", Announcement_Routes)
app.use("/api/dashboard", Dashboard_Routes)
app.use("/api/mail", Mail_Routes)
app.use("/api/question-answer", QA_Routes)


app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


