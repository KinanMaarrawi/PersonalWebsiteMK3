import nodemailer from "nodemailer";

export async function handler(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, email, message } = JSON.parse(event.body);

        if (!message) {
            return { statusCode: 400, body: "Message is required" };
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,  // your Gmail
                pass: process.env.EMAIL_PASS,  // your app password
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // you receive the email here
            subject: `Contact Form Message${name ? ` from ${name}` : ""}`,
            text: message,
        });

        return { statusCode: 200, body: "Message sent successfully!" };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Error sending message" };
    }
}
