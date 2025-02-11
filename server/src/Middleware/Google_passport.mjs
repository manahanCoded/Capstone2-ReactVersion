import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2"; 
import db from "../Database/DB_Connect.mjs";
import env from "dotenv";


env.config();


passport.use(new GoogleStrategy({
    clientID: process.env.Google_ID, 
    clientSecret: process.env.Client_Secret,
    callbackURL: 'https://cryptowarriors-be.onrender.com/api/user/auth/google/callback',
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
    
      const { id, emails } = profile;

      if (!emails || emails.length === 0) {
        return done(new Error("No email found"), null);
      }
      console.log(profile)

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
  if (!user) {
    console.error("❌ No user provided for serialization");
    return done(new Error("No user provided"));
  }
  console.log("✅ Serializing user:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (userID, done) => {
  try {
    console.log("🔍 Deserializing user:", userID);
    const checkUser = await db.query("SELECT * FROM users WHERE id = $1", [userID]);

    if (checkUser.rowCount === 0) {
      console.error("❌ No user found in DB for ID:", userID);
      return done(new Error("No user found"));
    }

    console.log("✅ User found:", checkUser.rows[0]);
    return done(null, checkUser.rows[0]);
  } catch (err) {
    console.error("❌ Error in deserialization:", err);
    return done(err);
  }
});
