const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

exports.sendHTML = async (to, subject, templateName, variables = {}) => {
  const templatePath = path.join(__dirname, "..", "emails", "templates", templateName);
  let html = fs.readFileSync(templatePath, "utf8");

  Object.entries(variables).forEach(([key, val]) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), val);
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"NewsApp" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
