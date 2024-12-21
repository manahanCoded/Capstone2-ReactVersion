import { Strategy } from "passport-local";
import db from "../Database/DB_Connect.mjs";
import bcrypt from "bcrypt";
import passport from "passport";

passport.use(
  "local",
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const UsernameCheck = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [username]
        );

        if (UsernameCheck.rowCount === 0)
          return done(null, false, { message: "Email not found" });

        const user = UsernameCheck.rows[0];
        const PasswordCheck = user.password;

        bcrypt.compare(password, PasswordCheck, (err, isMatch) => {
          if (err) return done(err, false, { error: "Internal Server Error" })
          if (!isMatch) return done(null, false, { message: "Incorrect Password" })

          return done(null, user)
        })
      } catch (err) {
        console.error("Error in passport strategy:", err)
        return done(err, false, { error: "Internal Server Error" })
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (userID, done) => {
  try {
    const checkID = await db.query("SELECT * FROM users WHERE id = $1", [userID]);
    if (checkID.rowCount === 0) {
      throw new Error("No user ID found");
    }
    return done(null, checkID.rows[0]);
  } catch (err) {
    console.error("Error in deserialization:", err);
    return done(err, null, { error: "Internal Server Error" });
  }
});
