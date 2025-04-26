import "../../Middleware/Local_passport.mjs";
import "../../Middleware/Google_passport.mjs"
import passport from "passport";
import db from "../../Database/DB_Connect.mjs";
import bcrypt from "bcrypt";
import { validationResult, matchedData } from "express-validator"
import {sendVerificationEmail} from "../../Middleware/Validaitors/User_Mailer.mjs"
import env from "dotenv"



env.config()

const login = (req, res) => {

  const problem = validationResult(req)

  try {
    if (!problem.isEmpty()) {
      return res.status(400).json({ errors: problem.array() });
    }

    if (req.isAuthenticated()) {
      return res.status(200).json({
        loggedin: true,
        user: { id: req.user.id, email: req.user.email },
        message: "User is already Logged in",
      });
    }
    
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).json({ error: info.message });
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
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }, (err, user) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/login`);

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });

      req.session.save((err) => {
        if (err) console.error(" Error saving session:", err);
        if (process.env.NODE_ENV === 'production') {
          return res.redirect(`${process.env.CLIENT_URL}`);
        }
        return res.redirect("http://localhost:5173");

      });
    });
  })(req, res, next);
};


const emailSet = async (req, res) => {
  const { email } = req.body;
  const generateCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const checkEmail =await db.query("SELECT * FROM users where email = $1 AND  role IS NOT NULL", [email])

    if(checkEmail.rowCount > 0) return res.status(400).json({error: "Email is already taken"})

    await db.query(
      `INSERT INTO users (email, verification_code, code_expires_at)
       VALUES ($1, $2, $3) ON CONFLICT (email)
       DO UPDATE SET verification_code = EXCLUDED.verification_code,
                     code_expires_at = EXCLUDED.code_expires_at`,
      [email, generateCode, expires]
    );

    await sendVerificationEmail(email, generateCode);
    res.status(200).json({ message: 'Verification code sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}


const register = async (req, res) => {

  const problem = validationResult(req)
  const { name, lastname, phone_number, email, password, confirmPassword } = matchedData(req)
  const saltRounds = 10;
  try {

    if (!problem.isEmpty()) {
      return res.status(400).json({ errors: problem.array() });
    }

    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const checkPhoneNumber = await db.query("SELECT * FROM users WHERE phone_number = $1", [
      phone_number,
    ]);
    if (checkEmail.rowCount < 1)
      return res
        .status(400)
        .json({ error: "Email does not exist" });

    if (checkEmail.rows[0].password !== null) {
      return res.status(400).json({ error: "This email is already registered. Please use other email." });
    }

    if (checkPhoneNumber.rowCount > 0)
      return res
        .status(400)
        .json({ error: "User with this Phone Number already exists." });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Password Must be similar" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await db.query(
      "UPDATE users SET name = $1, lastname = $2, phone_number = $3, password = $4, role =$5, type = $6, is_verified = TRUE WHERE email = $7  RETURNING *",
      [name, lastname, phone_number, hashedPassword, 'client', "local", email]
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
        loggedIn: true,
      });
    });
  } catch (err) {
    console.error("Register Error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    if (!req.user) {
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


const retrieve = async (req, res) => {
  
  try {
    const { email } = req.body

    const findUser = await db.query("SELECT * FROM users WHERE email = $1 AND is_verified = true AND NOT type = 'google' ", [email])

    if (findUser.rowCount < 1) return res.status(400).json({ error: "No user found" })

    const generateCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(`UPDATE users SET verification_code = $1, code_expires_at = $2 
          WHERE email =  $3`, [generateCode, expires, email])

    sendVerificationEmail(email, generateCode)
    res.json({ message: 'Verification code sent to email.' });

  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

const verify = async (req, res) => {

  const { email, code } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT verification_code, code_expires_at FROM users WHERE email = $1`,
      [email]
    );

    const user = rows[0];
    if (!user) return res.status(404).send('User not found');

    if (user.verification_code !== code)
      return res.status(400).json({error: 'Invalid verification code'});

    if (new Date(user.code_expires_at) < new Date())
      return res.status(400).json({error: 'Code Expired'});

    await db.query(
      `UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE email = $1`,
      [email]
    );

    res.send('Email verified!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}


const changePassword = async (req, res) => {
  try {
    
    const { email, password, confirmPassword } = req.body;

    const findAcc = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (findAcc.rowCount === 0) {
      return res.status(401).json({ error: "No user found" });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({ error: "Passwords must be the same" });
    }

    const newPassword = await bcrypt.hash(password, 10);

    await db.query("UPDATE users SET password = $1 WHERE email = $2", [
      newPassword,
      email,
    ]);
    return res.status(200).json({ message: "Password updated successfully! Please log in again." });
  } catch (err) {
    console.error("Retrieve Account Error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  const { email, oldPassword, newPassword, phone_number, confirmPassword, name, lastname } = req.body;
  const image = req.file ? req.file.buffer : null;
  const fileMimeType = req.file ? req.file.mimetype : null;

  try {
    const findUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (findUser.rowCount === 0) {
      return res.status(401).json({ error: "No user found" });
    }

    const user = findUser.rows[0];

    // Password update logic
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ error: "Old password is required to update password." });
      }
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Old password is incorrect." });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match." });
      }

      const updatedPassword = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE users SET password = $1 WHERE id = $2", [updatedPassword, user.id]);
    }

    const phoneToUpdate = phone_number && !isNaN(phone_number) ? phone_number : user.phone_number;

    if (image) {
      await db.query(
        `UPDATE users 
         SET name = $1, lastname = $2, image = $3, phone_number = $4, file_mime_type = $5 
         WHERE id = $6`,
        [name || user.name, lastname || user.lastname, image, phoneToUpdate, fileMimeType, user.id]
      );
    } else {
      await db.query(
        `UPDATE users 
         SET name = $1, lastname = $2, phone_number = $3 
         WHERE id = $4`,
        [name || user.name, lastname || user.lastname, phoneToUpdate, user.id]
      );
    }

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Update error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




const userInfo = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "No user found. Unauthorized!" })
  }
  const imageBase64 = req.user.image ? req.user.image.toString('base64') : null;

  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    phone_number: req.user.phone_number,
    role: req.user.role,
    image: imageBase64,
    file_mime_type: req.user.file_mime_type,
    type: req.user.type,
  })
};


const accountsDashboard = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "No user found. Unauthorized!" })
  }

  const response = await db.query("SELECT id, email, role, type from users")
  res.json(response.rows)
}


const updateRoles = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No user found. Unauthorized!" })
    }
    const { email, role } = req.body
    await db.query("UPDATE users SET role = $1 WHERE email = $2", [role, email])
    res.status(200).json({ message: "User Password updated successfully!" });
  }
  catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }

}



export { login, google_login, google_login_callback, emailSet, register, verify, changePassword, logout, userInfo, updateUser, accountsDashboard, updateRoles, retrieve };
