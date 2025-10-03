// src/components/Footer.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faFile } from "@fortawesome/free-solid-svg-icons";
import { faSquareGithub, faSquareLinkedin } from "@fortawesome/free-brands-svg-icons";

const socialLinks = [
    { icon: <FontAwesomeIcon icon={faSquareLinkedin} size="5x"/>, url: "https://www.linkedin.com/in/kinan-maarrawi/", label: "My LinkedIn page" },
    { icon: <FontAwesomeIcon icon={faSquareGithub} size="5x"/>, url: "https://github.com/KinanMaarrawi", label: "My GitHub account" },
    { icon: <FontAwesomeIcon icon={faEnvelope} size="5x"/>, url: "mailto:kinan@maarrawi.com", label: "Send me an email" },
    { icon: <FontAwesomeIcon icon={faFile} size="5x"/>, url: "/CV.pdf", label: "View my CV" },
];

export default function Footer() {
    return (
        <Container>
            <Column>
                <Title>Shoot me a message...</Title>
                <ContactForm />
            </Column>

            <Divider />

            <Column>
                <Title>...Or connect with me</Title>
                <Links items={socialLinks} />
            </Column>
        </Container>
    );
}

// ==================== ContactForm ====================
function ContactForm() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [toasts, setToasts] = useState([]);

    const addToast = (text) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, text }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/.netlify/functions/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message }),
            });
            if (res.ok) {
                addToast("Message sent!");
                setName("");
                setMessage("");
            } else addToast("Failed to send.");
        } catch {
            addToast("Error.");
        }
    };

    return (
        <FormWrapper>
            <Form onSubmit={handleSubmit}>
                <Input
                    placeholder="Your Name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                    placeholder="Your Message (Make sure to include a way for me to get back to you!)"
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
        </FormWrapper>
    );
}

// ==================== Links ====================
function Links({ items = [] }) {
    return (
        <LinksGrid>
            {items.map((item, idx) => (
                <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label || "Link"}
                >
                    <IconWrapper
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {item.icon}
                    </IconWrapper>
                </a>
            ))}
        </LinksGrid>
    );
}

// ==================== Styled Components ====================
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  gap: 2rem;
  align-items: start;
  width: 100%;
  min-height: 80vh;
  padding: 4rem 2rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.div`
  width: 2px;
  background-color: #7e3ebe;
  height: 36rem;
  justify-self: center;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  color: #fdf9f3;
  margin-bottom: 2rem;
  text-align: center;
`;

// --- Contact Form ---
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
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

// --- Toast ---
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
  background-color: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    padding: 2px;
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

// --- Links ---
const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 6rem);
  grid-gap: 3rem;
  justify-items: center;
  align-items: center;
`;

const IconWrapper = styled(motion.div)`
  width: 6rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7e3ebe;
  cursor: pointer;
`;
