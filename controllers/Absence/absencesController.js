const Absence = require("../../models/Absence");
const nodemailer = require("nodemailer");

exports.getAbsenceRequestsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const absence = await Absence.findByUserId({ id: user_id });

    if (absence.success) {
      res.status(200).json({
        schedules: absence.data.schedules,
        success: true,
        message: "Absence requests retrieved successfully",
      });
    } else {
      res.status(404).json({ error: "absence list not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.createAbsenceRequest = async (req, res) => {
  try {
    const { user_id, course_name, name, content } = req.body;

    if (!user_id || !course_name) {
      return res
        .status(400)
        .json({ error: "user_id and course_name are required" });
    }

    const absence = await Absence.create({
      user_id: user_id,
      course_name: course_name,
      is_approved: 0,
    });

    if (absence.success) {
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
        from: '"Attendo" <attendo@attendosystems.com>',
        to: "jnet230@gmail.com",
        subject: "New Absence Request",
        html: `....
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
                                                                                                       ${course_name}
      
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

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      //
      res.status(201).json({
        success: true,
        message: "Absence request created successfully",
        data: absence.data,
      });
    } else {
      res
        .status(400)
        .json({ error: absence.message || "Error creating absence request" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAbsenceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    if (is_approved === undefined) {
      return res
        .status(400)
        .json({ error: "Approval status (is_approved) is required" });
    }

    const absence = await Absence.updateApprovalStatus({ id, is_approved });

    if (absence.success) {
      res.status(200).json({
        success: true,
        message: "Absence request updated successfully",
        data: absence.data,
      });
    } else {
      res
        .status(404)
        .json({ error: absence.message || "Absence request not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
