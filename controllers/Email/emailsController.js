const nodemailer = require("nodemailer");
const Mail = require("../../models/Mails"); // Adjust the path as necessary

exports.sendMail = async (req, res) => {
  const { user_id, name, courseName, content } = req.body;
  const recipient = await Mail.getTeacherEmail({ courseName: courseName });
  console.log(recipient);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();
    console.log("SMTP Server is ready to send emails");

    const mailOptions = {
      from: '"Attendo" <attendo@attendosystems.com>', // Sender address
      to: "jnet230@gmail.com", // Recipient address
      subject: "New Absence Request", // Subject line
      html: `
      <table border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
  <tbody>
    <tr>
      <td align="center" bgcolor="#0D2C99">
        <table
          class="inner_tab"
          style="max-width: 600px"
          border="0"
          width="600"
          cellspacing="0"
          cellpadding="0"
        >
          <tbody>
            <tr>
              <td height="35">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <table
                  class="outer_tab"
                  border="0"
                  width="290"
                  cellspacing="0"
                  cellpadding="0"
                  align="left"
                >
                  <tbody>
                    <tr>
                      <td align="left">
                        <table
                          class="outer_tab"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                          align="left"
                        >
                          <tbody>
                            <tr>
                              <td align="center">
                                <table
                                  class="textbutton"
                                  border="0"
                                  cellspacing="0"
                                  cellpadding="0"
                                  align="center"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style="line-height: 0px"
                                        align="center"
                                      >
                                        <a
                                          href="https://www.ivao.aero"
                                          target="_blank"
                                        >
                                          <img
                                            style="
                                              display: block;
                                              line-height: 0px;
                                              font-size: 0px;
                                              border: 0px;
                                            "
                                            src="https://i.ibb.co/qmgp28y/output-onlinepngtools.png"
                                            alt="Logo"
                                            width="200"
                                          />
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td height="35">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#ffffff">
        <table
          class="inner_tab"
          style="max-width: 600px"
          border="0"
          width="600"
          cellspacing="0"
          cellpadding="0"
        >
          <tbody>
            <tr>
              <td height="60">&nbsp;</td>
            </tr>
            <tr></tr>
            <tr>
              <td height="15">&nbsp;</td>
            </tr>
            <tr>
              <td align="center">
                <table
                  border="0"
                  width="250"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          border-bottom: 1px solid #d7d7dc;
                          border-radius: 0px;
                        "
                        height="0"
                      >
                        &nbsp;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td height="30">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <table
                  class="outer_tab"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                >
                  <tbody>
                    <tr>
                      <td align="center">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td align="right">
                                <table
                                  border="0"
                                  cellspacing="0"
                                  cellpadding="0"
                                >
                                  <tbody>
                                    <tr></tr>
                                    <tr>
                                      <td height="5">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td
                                        style="
                                          font-size: 15px;
                                          font-weight: 400;
                                          color: #212529;
                                          line-height: 25px;
                                          text-align: justify;
                                        "
                                        align="left"
                                      >
                                        <h1>You have a new absence request</h1>
                                        <table
                                          style="
                                            width: 100%;
                                            border-collapse: collapse;
                                            margin: auto;
                                            max-width: 600px;
                                          "
                                        >
                                          <tr
                                            style="
                                              background-color: #f2f2f2;
                                              text-align: left;
                                            "
                                          >
                                            <th
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                              Field
                                            </th>
                                            <th
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                              Details
                                            </th>
                                          </tr>
                                          <tr>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                              Course Name
                                            </td>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                                                                                 ${courseName}

                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                              Requester Name
                                            </td>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                                   ${name}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                              Requester ID
                                            </td>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                                ${user_id}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                              Reason Provided
                                            </td>
                                            <td
                                              style="
                                                padding: 8px;
                                                border: 1px solid #ddd;
                                              "
                                            >
                                              ${content}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td height="60">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#0D2C99">
        <table
          class="inner_tab"
          style="max-width: 600px"
          border="0"
          width="600"
          cellspacing="0"
          cellpadding="0"
        >
          <tbody>
            <tr>
              <td height="30">&nbsp;</td>
            </tr>
            <tr>
              <td>
                <table
                  class="outer_tab"
                  border="0"
                  width="450"
                  cellspacing="0"
                  cellpadding="0"
                  align="left"
                ></table>
                <!-- [if (gte mso 9)|(IE)]></td><td><![endif]-->
                <table
                  border="0"
                  width="20"
                  cellspacing="0"
                  cellpadding="0"
                  align="left"
                >
                  <tbody>
                    <tr>
                      <td height="10">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
                <!-- [if (gte mso 9)|(IE)]></td><td><![endif]-->
                <table
                  class="outer_tab"
                  border="0"
                  width="150"
                  cellspacing="0"
                  cellpadding="0"
                  align="right"
                >
                  <tbody>
                    <tr>
                      <td align="left">
                        <table
                          class="outer_tab"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                          align="right"
                        ></table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td height="15">&nbsp;</td>
            </tr>
            <tr>
              <td
                style="
                  font-family: 'Poppins', sans-serif;
                  font-size: 10px;
                  font-weight: 400;
                  text-align: justify;
                  color: #ffffff;
                "
              >
                Sent with love by Attendo
              </td>
            </tr>
            <tr>
              <td height="30">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
`,
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
