import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

export const sendMail = async (
  to: string,
  subject: string,
  htmlTemplateData: string,
  text?: string | null,
  smtpConfig?: {
    user: string;
    pass: string;
    server: string;
    port: string;
  },
  attachments?: {
    filename: string;
    path?: string;
    content?: Buffer;
    contentType?: string;
  }[],
): Promise<void> => {

  // ── Resend (HTTP API) — used in production on Render ──────────────
  // Render blocks outbound SMTP (port 587) so we use Resend's HTTPS API.
  // Set RESEND_API_KEY in Render env vars.
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const from = process.env.MAIL_FROM_NAME
      ? `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM ?? process.env.MAIL_USER}>`
      : `Be Travel Your Style <${process.env.MAIL_FROM ?? process.env.MAIL_USER}>`;

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html: htmlTemplateData,
      ...(text ? { text } : {}),
    });

    if (error) {
      console.error('Error sending email (Resend):', error);
      throw new Error(error.message);
    }

    console.log('Email sent via Resend to:', to);
    return;
  }

  // ── Nodemailer (SMTP) — fallback for local development ────────────
  const transporter = nodemailer.createTransport({
    host: smtpConfig?.server || process.env.MAIL_HOST || 'smtp.gmail.com',
    port: smtpConfig?.port ? Number(smtpConfig.port) : Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: smtpConfig?.user || process.env.MAIL_USER,
      pass: smtpConfig?.pass || process.env.MAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"Be Travel Your Style" <${smtpConfig?.user || process.env.MAIL_FROM || process.env.MAIL_USER}>`,
    to,
    subject,
    text: text ?? undefined,
    html: htmlTemplateData,
    ...(attachments?.length ? { attachments } : {}),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw error; // re-throw so callers can handle / wrap in InternalServerErrorException
  }
};

// Allowed folder names to prevent path traversal attacks
const ALLOWED_FOLDERS = [
  'profile_image',
  'ship_images',
  'cruise_images',
  'documents',
  'audio',
  'video',
];

const DEFAULT_FOLDER = 'profile_image';

export const getUploadStorage = () => {
  if (process.env.UPLOAD_TYPE === 'LIVE') {
    return memoryStorage();
  }

  return diskStorage({
    destination: (req, file, callback) => {
      // req.body is NOT yet populated when multer fires this callback
      // for multipart/form-data — the folder field arrives after the file.
      // Read from query param (?folder=cruise_images) which is always available.
      const requested: string =
        (req.query?.folder as string) || req.body?.folder || DEFAULT_FOLDER;

      const folder = ALLOWED_FOLDERS.includes(requested)
        ? requested
        : DEFAULT_FOLDER;

      const uploadPath = `./uploads/${folder}`;

      const fs = require('fs');
      fs.mkdirSync(uploadPath, { recursive: true });

      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + extname(file.originalname));
    },
  });
};

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 10;
  if (page <= 0) {
    return { limit, offset: Number.MAX_SAFE_INTEGER, currentPage: 0 };
  }

  const currentPage = Number(page);
  const offset = (currentPage - 1) * limit;

  return { limit, offset, currentPage };
};

export const getPagingData = (alldata: { count: number, rows: any[] }, page: number, limit: number) => {
  const { count: totalItems, rows: data } = alldata;
  const currentPage = page >= 1 ? +page : 1; // Page starts from 1
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data, totalPages, currentPage };
};
