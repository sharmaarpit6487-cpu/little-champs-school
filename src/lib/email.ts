import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_USER) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

export async function sendFeeReminder({
  parentEmail,
  studentName,
  feeTitle,
  amount,
  dueDate,
}: {
  parentEmail: string;
  studentName: string;
  feeTitle: string;
  amount: number;
  dueDate: string;
}) {
  await sendEmail({
    to: parentEmail,
    subject: `Fee Reminder - ${feeTitle}`,
    html: `
      <h2>Fee Payment Reminder</h2>
      <p>Dear Parent,</p>
      <p>This is a reminder that the following fee for <strong>${studentName}</strong> is due:</p>
      <ul>
        <li><strong>Fee:</strong> ${feeTitle}</li>
        <li><strong>Amount:</strong> ₹${amount.toLocaleString("en-IN")}</li>
        <li><strong>Due Date:</strong> ${dueDate}</li>
      </ul>
      <p>Please make the payment before the due date to avoid late fees.</p>
      <p>Thank you,<br>Little Champs School</p>
    `,
  });
}

export async function sendAdmissionConfirmation({
  parentEmail,
  studentName,
  applicationNo,
}: {
  parentEmail: string;
  studentName: string;
  applicationNo: string;
}) {
  await sendEmail({
    to: parentEmail,
    subject: `Admission Application Received - ${applicationNo}`,
    html: `
      <h2>Application Received</h2>
      <p>Dear Parent,</p>
      <p>We have received the admission application for <strong>${studentName}</strong>.</p>
      <p><strong>Application Number:</strong> ${applicationNo}</p>
      <p>Our admission team will review your application and contact you shortly.</p>
      <p>Thank you,<br>Little Champs School</p>
    `,
  });
}
