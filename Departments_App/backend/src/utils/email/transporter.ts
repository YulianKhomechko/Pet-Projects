import nodemailer from 'nodemailer';
import sendGridTransport from 'nodemailer-sendgrid-transport';

export const nodemailerTransporter = nodemailer.createTransport(
    sendGridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    })
);
