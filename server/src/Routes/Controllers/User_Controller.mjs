import "../../Middleware/Local_passport.mjs";
import "../../Middleware/Google_passport.mjs"
import passport from "passport";
import db from "../../Database/DB_Connect.mjs";
import bcrypt from "bcrypt";
import {validationResult, matchedData} from "express-validator"

import env from "dotenv"



env.config()

const login = (req, res) => {

  const problem = validationResult(req)
  
  try {
    if (!problem.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.isAuthenticated()) {
      return res.status(200).json({
        loggedin: true,
        user: { id: req.user.id, email: req.user.email },
        message: "User is already Logged in",
      });
    }

    passport.authenticate("local", (err, user) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(200).json({
          message: "Successfully Logged in",
          user: { id: user.id, email: user.email },
        });
      });
    })(req, res);
  } catch (err) {
    console.error("Login Error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const google_login = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

const google_login_callback = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    if (err) {
      console.error("Google authentication error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!user) {
      return res.status(401).json({ error: "Google Authentication Failed" });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("Error during Google login:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.redirect(`http://localhost:5173`);
    });
  })(req, res, next);
};

const register = async (req, res) => {

  const problem = validationResult(req)
  const { email, password, confirmPassword } = matchedData(req)
  const saltRounds = 10;

  try {

    if (!problem.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkEmail.rowCount > 0)
      return res
        .status(400)
        .json({ error: "User with this email already exists." });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Password Must be similar" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await db.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, 'client']
    );

    const user = newUser.rows[0];

    req.login(user, (err) => {
      if (err) {
        console.error("Login new register Failed.");
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json({
        message: "Registration successful!",
        user: { id: user.id, email: user.email },
      });
    });
  } catch (err) {
    console.error("Register Error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(400).json({ error: "No user found to logout" });
    }
    req.logout((err) => {
      if (err) {
        console.error("Logging out error", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Logging out error", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(200).json({ message: "Logout successfull" });
      });
    });
  } catch (err) {
    console.error("Logout error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async(req,res) =>{
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

try {
  const findUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  if (findUser.rows.length === 0) {
    return res.status(401).json({ error: "No user found" });
  }

  const user = findUser.rows[0];

  if (!oldPassword) {
    return res.status(400).json({ error: "Old password is required to update password." });
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ error: "Old password is incorrect." });
  }

  let updatedPassword = user.password; 

  if (newPassword) {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match." });
    }
    updatedPassword = await bcrypt.hash(newPassword, 10);
  }


  await db.query(
    "UPDATE users SET email = $1, password = $2 WHERE id = $3",
    [email, updatedPassword, user.id]
  );

  res.status(200).json({ message: "User Password updated successfully!" });
} catch (err) {
  console.error("Update error", err);
  return res.status(500).json({ error: "Internal Server Error" });
}
}

const userInfo = (req, res) => {
  if(!req.isAuthenticated()){
    return res.status(401).json({message: "No user found. Unauthorized!"})
  }

  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    type : req.user.type,
  })
};

const accountsDashboard = async(req,res)=>{
  if(!req.isAuthenticated()){
    return res.status(401).json({message: "No user found. Unauthorized!"})
  }

  const response = await db.query("SELECT email, role, type from users")
  res.json(response.rows)
}


const updateRoles = async (req,res) =>{
  try{
  if(!req.isAuthenticated()){
    return res.status(401).json({message: "No user found. Unauthorized!"})
  }
  const {email, role} = req.body 
  await db.query("UPDATE users SET role = $1 WHERE email = $2", [role, email])
  res.status(200).json({ message: "User Password updated successfully!" });
}
catch(err){
  res.status(500).json({ error: "Internal Server Error" });
}

}



export { login, google_login, google_login_callback, register, logout, userInfo, updateUser, accountsDashboard, updateRoles };
