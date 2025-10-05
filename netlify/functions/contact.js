/* global process */
import nodemailer from "nodemailer";

/**
 * Serverless function handler for processing contact form submissions.
 * Takes user's messsage, and sends an email to my email address from the same email address as set up in Netlify env
 * Receives POST requests with JSON body containing `name` and `message`.
 * Sends the message using Gmail via nodemailer and returns an HTTP response.
 *
 * @param {Object} event - The event object containing request details.
 * @param {string} event.httpMethod - The HTTP method used in the request.
 * @param {string} event.body - The raw JSON body of the request.
 * @returns {Promise<{statusCode: number, body: string}>} HTTP response object.
 */
export async function handler(event) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Parse request body
        const { name, message } = JSON.parse(event.body);

        // Validate that message exists
        if (!message) {
            return { statusCode: 400, body: "Message is required" };
        }

        // Configure nodemailer transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,       // Gmail account email (sender)
                pass: process.env.EMAIL_PASS,  // Gmail account password or app password
            },
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL,           // sender
            to: process.env.EMAIL,             // recipient (self)
            subject: `Contact Form Message${name ? ` from ${name}` : ""}`, // subject line
            text: message,                     // email body
        });

        // Successful response
        return { statusCode: 200, body: "Message sent successfully!" };
    } catch (error) {
        console.error(error);
        // Error response
        return { statusCode: 500, body: "Error sending message" };
    }
}
