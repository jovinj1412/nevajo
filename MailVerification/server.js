require("dotenv").config({ path: __dirname + "/.env" });  // Ensure correct .env path
const fs = require("fs");
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging: Check if .env file exists and display raw contents
const envFilePath = __dirname + "/.env";
if (fs.existsSync(envFilePath)) {
    console.log(".env file found.");
    console.log("Raw .env contents:\n", fs.readFileSync(envFilePath, "utf8"));
} else {
    console.log(".env file NOT found!");
}

// ✅ Debugging: Check if environment variables are loaded
console.log("Email User:", process.env.EMAIL_USER || "Not Loaded");
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



const otpStore = {}; // Temporary storage for OTPs

// Function to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email
async function sendEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Use App Password
            },
        });

        const mailOptions = {
            from: `"College Admin" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP for login is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Route to send OTP
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, error: "Email is required" });
    }

    const otp = generateOTP();
    otpStore[email] = otp;
    console.log(`Generated OTP for ${email}: ${otp}`);

    try {
        await sendEmail(email, otp);
        console.log(`OTP email sent successfully to ${email}`);
        res.status(200).json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Route to verify OTP
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, error: "Email and OTP are required" });
    }

    if (otpStore[email] && otpStore[email] === otp) {
        delete otpStore[email]; // Remove OTP after verification
        res.status(200).json({ success: true, message: "OTP verified successfully!" });
    } else {
        res.status(401).json({ success: false, error: "Invalid OTP" });
    }
});


