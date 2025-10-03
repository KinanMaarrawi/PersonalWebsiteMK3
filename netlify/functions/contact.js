// src/functions/contact.js
/* global process */
import nodemailer from "nodemailer";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, message } = JSON.parse(event.body);

        if (!message) {
            return { statusCode: 400, body: "Message is required" };
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,           // sender
            to: process.env.EMAIL,             // recipient
            subject: `Contact Form Message${name ? ` from ${name}` : ""}`,
            text: message,
        });

        return { statusCode: 200, body: "Message sent successfully!" };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Error sending message" };
    }
}
