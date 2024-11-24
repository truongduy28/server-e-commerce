/** @format */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: "taikhoancuatoi.dev@gmail.com",
    pass: "zwhl zxlh njau mftb",
  },
});

export const sendMail = async (data: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    const res = await transporter.sendMail(data);

    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
