const nodemailer = require("nodemailer");
const Mail = require("../../models/Mails"); // Adjust the path as necessary

exports.sendMail = async (req, res) => {
  const { user_id, name, courseName, content } = req.body;
  const recipient = await Mail.getTeacherEmail({ courseName: courseName });
  console.log(recipient);
  try {
    const transporter = nodemailer.createTransport({
      host: "attendosystems.com",
      port: 465,
      secure: true,
      auth: {
        user: "attendo@attendosystems.com",
        pass: "?8wi311nZ",
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("SMTP Server is ready to send emails");

    const mailOptions = {
      from: '"Attendo" <attendo@attendosystems.com>', // Sender address
      to: "jnet230@gmail.com", // Recipient address
      subject: "Test Email from My Custom SMTP", // Subject line
      text: "Hello, this is a test email sent using my custom SMTP server.", // Plain text body
      html: "<p>Hello, this is a <b>test email</b> sent using my custom SMTP server.</p>", // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
