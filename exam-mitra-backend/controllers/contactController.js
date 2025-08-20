import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//@POST /contact
//@DESC Contact form submission
//@ACCESS Public
const contactMe = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL, // e.g. exammita.contact@gmail.com
        pass: process.env.CONTACT_PASS, // App password, not normal login
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.CONTACT_EMAIL,
      subject: `📨 New Contact from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("❌ Email Error:", error.message || error);
    return res
      .status(500)
      .json({ error: "Failed to send message. Try again later." });
  }
};

export default contactMe;