import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import env from "dotenv";
import cookieParser from "cookie-parser";
import pgSession from "connect-pg-simple";
import http from "http"
import { Server } from "socket.io";

//  prevent malicious activities like unintentional excessive traffic (DDoS, brute force attacks, and abuse)
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import ExpressBrute from "express-brute";

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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Too many requests, please try again later.",
  headers: true,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10000,
  delayMs: () => 500,
});



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




const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(`user_${userId}`);
  }
  socket.on("disconnect", () => {
  });
});


async function listenForNotifications() {
  const client = await db.connect();
  await client.query("LISTEN new_question");
  client.on("notification", async (msg) => {
    const data = JSON.parse(msg.payload);
    try {
      const res = await db.query(
        `SELECT id 
          FROM users 
          WHERE id NOT IN (
              SELECT seen_user_id
              FROM qa_questions, 
              LATERAL (SELECT jsonb_array_elements_text(COALESCE(seen_by, '[]'::jsonb))::INTEGER AS seen_user_id) AS t
              WHERE question_id = $1
          );`,
        [data.question_id]
      );

      const usersToNotify = res.rows.map(row => row.id);

      usersToNotify.forEach(userId => {
        io.to(`user_${userId}`).emit("newQuestion", data);
      });

    } catch (error) {
      console.error("❌ Error fetching users to notify:", error);
    }
  });
}
listenForNotifications()

app.post("/api/mark-seen", async (req, res) => {
  const { question_id, user_id } = req.body;
  
  try {
    await db.query(
      "UPDATE qa_questions SET seen_by = seen_by || $1::jsonb WHERE question_id = $2",
      [JSON.stringify([user_id]), question_id]
    );

    res.json({ message: "✔️ Question marked as seen" });
  } catch (error) {
    console.error("❌ Error updating seen_by:", error);
    res.status(500).json({ error: "Database error" });
  }
});



app.use(passport.initialize());
app.use(passport.session());


app.use("/api/user", limiter, speedLimiter, User_Routes);
app.use("/api/job", limiter, Job_Routes);
app.use("/api/module", limiter, Module_Routes);
app.use("/api/announcement", limiter, speedLimiter, Announcement_Routes);
app.use("/api/dashboard", limiter, speedLimiter, Dashboard_Routes);
app.use("/api/mail", limiter, speedLimiter, Mail_Routes);
app.use("/api/question-answer", limiter, speedLimiter, QA_Routes);



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

