import { Strategy } from "passport-local";
import db from "../Database/DB_Connect.mjs";
import bcrypt from "bcrypt";
import passport from "passport";

passport.use(
  "local",
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      console.log(username)
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
  console.log(" asdasdasd USER ID: ", user.id)
  return done(null, user.id);
});

passport.deserializeUser(async (userID, done) => {
  try {
    console.log("Deserializing user:", userID);
    const checkUser = await db.query("SELECT * FROM users WHERE id = $1", [userID]);
    if (checkUser.rowCount === 0) {
      return done(new Error("No user found"));
    }
    return done(null, checkUser.rows[0]);
  } catch (err) {
    console.error("Error in deserialization:", err);
    return done(err);
  }
});