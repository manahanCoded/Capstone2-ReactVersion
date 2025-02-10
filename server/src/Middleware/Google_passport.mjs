import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2"; 
import db from "../Database/DB_Connect.mjs";
import env from "dotenv";


env.config();


passport.use(new GoogleStrategy({
    clientID: process.env.Google_ID, 
    clientSecret: process.env.Client_Secret,
    callbackURL: 'http://localhost:5000/api/user/auth/google/callback',
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
    
      const { id, emails } = profile;

      if (!emails || emails.length === 0) {
        return done(new Error("No email found"), null);
      }

      const email = emails[0].value; 

      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      
      if (result.rowCount > 0) {
        
        return done(null, result.rows[0]);
      } else {

        const newUser = {
          google_id: id,
          email: emails[0].value
        };

        const insertResult = await db.query("INSERT INTO users ( email , password, role, type) VALUES ($1, $2, $3, $4) RETURNING *", [newUser.email, newUser.google_id, 'client', 'google' ]);

        return done(null, insertResult.rows[0]); 
      }
    } catch (error) {
      console.error("Error in Google strategy callback:", error);
      return done(error, null);
    }
  }
));

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