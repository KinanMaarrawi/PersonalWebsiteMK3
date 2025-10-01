import React from "react";

export default function FullCardModal({ card, onClose }) {
    if (!card) return null;

    const { imageUrl, title, description } = card;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    gap: "20px",
                    maxWidth: "90%",
                    maxHeight: "80%",
                    overflow: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt={title}
                    style={{ maxHeight: "400px", borderRadius: "8px" }}
                />
                <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}
