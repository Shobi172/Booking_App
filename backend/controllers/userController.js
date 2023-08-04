const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.sendOTP = async (req, res) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_MAIL,
      to: req.body.email,
      subject: "OTP Verification",
      text: `Your OTP for login is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending OTP email", error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        try {
          const user = new User({
            email: req.body.email,
            otp: otp,
          });

          await user.save();
          res.status(200).json({ message: "OTP sent to user's email" });
        } catch (err) {
          console.error("Error saving user data to the database", err);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    });
  } catch (error) {
    console.error("Error generating and sending OTP", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error verifying OTP", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
