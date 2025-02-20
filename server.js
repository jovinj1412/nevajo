const express = require("express"); 
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Temporary storage for OTPs (resets when server restarts)
const otpStorage = {};

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  otpStorage[email] = otp; // Store OTP for verification

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jovin.26csb@licet.ac.in",
      pass: "ayinyiinthzzingp",  // Use App Password, NOT your Gmail password!
    },
  });

  const mailOptions = {
    from: "jovin.26csb@licet.ac.in",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: "Email and OTP are required" });
  }

  if (otpStorage[email] && otpStorage[email] == otp) {
    delete otpStorage[email]; // OTP used, remove it
    return res.json({ success: true, message: "OTP verified successfully!" });
  }

  res.status(400).json({ success: false, error: "Invalid or expired OTP" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
