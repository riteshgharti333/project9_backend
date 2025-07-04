import Contact from "../models/contactModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import nodemailer from "nodemailer";

// Create a new contact
export const createContact = catchAsyncError(async (req, res, next) => {
  const {
    name,
    businessName,
    email,
    phoneNumber,
    projectType,
    projectDescription,
    budget,
    heardAboutUs,
  } = req.body;

  const contact = await Contact.create({
    name,
    businessName,
    email,
    phoneNumber,
    projectType,
    projectDescription,
    budget,
    heardAboutUs,
  });

  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: `"Star Marketing" <${process.env.EMAIL}>`,
    to: email,
    subject: "Thank You for Contacting Star Marketing!",
    text: `Hi ${name},

Thank you for reaching out to Star Marketing. We've received your message and our team will get back to you shortly.

Your message:
"${projectDescription || "No message provided"}"

Warm regards,
Star Marketing Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${name},</h2>
        <p>Thank you for contacting <strong>Star Marketing</strong>.</p>
        <p>We've received your message and will get back to you shortly.</p>
        <p style="margin-top: 1rem; font-style: italic; color: #555;">"${
          projectDescription || "No message provided"
        }"</p>
        <p style="margin-top: 2rem;">Warm regards,<br><strong>Star Marketing Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Optionally log but still respond
  }

  res.status(201).json({
    success: true,
    message: "Contact created successfully",
    contact,
  });
});

// Get all contacts
export const getAllContacts = catchAsyncError(async (req, res, next) => {
  const contacts = await Contact.find();

  res.status(200).json({
    success: true,
    contacts,
  });
});

// Get a single contact by ID
export const getSingleContact = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    return next(new ErrorHandler("Contact not found", 404));
  }

  res.status(200).json({
    success: true,
    contact,
  });
});

// Delete a contact by ID
export const deleteContact = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    return next(new ErrorHandler("Contact not found", 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: "Contact deleted successfully",
  });
});
