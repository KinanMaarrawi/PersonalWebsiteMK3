// src/components/ContactForm.jsx
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [toasts, setToasts] = useState([]);

    const addToast = (text) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, text }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/.netlify/functions/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message }),
            });
            if (res.ok) {
                addToast("Message sent!");
                setName("");
                setMessage("");
            } else {
                addToast("Failed to send.");
            }
        } catch (err) {
            console.error(err);
            addToast("Error.");
        }
    };

    return (
        <FormContainer>
            <FormTitle>Contact Me</FormTitle>
            <Form onSubmit={handleSubmit}>
                <Input
                    placeholder="Your Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                    placeholder="Your Message (Make sure you keep a way for me to get back to you!)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <SubmitButton type="submit">Send</SubmitButton>
            </Form>

            {/* Toasts */}
            <ToastContainer>
                <AnimatePresence>
                    {toasts.map((t) => (
                        <Toast
                            key={t.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                        >
                            {t.text}
                        </Toast>
                    ))}
                </AnimatePresence>
            </ToastContainer>
        </FormContainer>
    );
}

// Styled components
const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 4rem 2rem;
    width: 100%;
`;

const FormTitle = styled.h2`
    font-size: clamp(2rem, 5vw, 3rem);
    color: #fdf9f3;
    margin-bottom: 2rem;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
`;

const Input = styled.input`
    padding: 1rem;
    font-family: Arial, sans-serif;
    font-size: 1rem;
    border-radius: 1rem;
    border: 2px solid #7e3ebe;
    background-color: #1a1a1a;
    color: #fdf9f3;

    &:focus {
        outline: none;
        border-color: #d199ff;
    }
`;

const Textarea = styled.textarea`
    padding: 1rem;
    font-family: Arial, sans-serif;
    font-size: 1rem;
    border-radius: 1rem;
    border: 2px solid #7e3ebe;
    background-color: #1a1a1a;
    color: #fdf9f3;
    min-height: 150px;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: #d199ff;
    }
`;

const SubmitButton = styled.button`
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    background: linear-gradient(90deg, #7e3ebe, #d199ff);
    color: #fff;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

// Toast styling
const ToastContainer = styled.div`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 9999;
`;

const Toast = styled(motion.div)`
    position: relative;
    padding: 1rem 2rem;
    color: #fff;
    background-color: #1a1a1a; /* solid black background */
    border-radius: 1rem;
    overflow: hidden;

    /* border glow always visible */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1rem;
        padding: 2px; /* thickness of the glow */
        background: linear-gradient(90deg, #7e3ebe, #ff4fa0, #7e3ebe);
        background-size: 200% 200%;
        mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
        pointer-events: none;
        animation: borderAnimation 3s linear infinite;
    }

    @keyframes borderAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;

