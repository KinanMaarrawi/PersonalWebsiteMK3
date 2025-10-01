import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Card from "./Card.jsx";
import FullCardModal from "./FullCardModal.jsx";

export default function Gallery() {
    const [selectedCard, setSelectedCard] = useState(null);

    const cardsData = [
        {
            imageUrl: "/placeholder1.jpg",
            title: "Card 1",
            description: "This is the first card",
        },
        {
            imageUrl: "/placeholder2.jpg",
            title: "Card 2",
            description: "Second card details go here",
        },
        // add more cards
    ];

    return (
        <>
            <Canvas
                camera={{ position: [0, 0, 5] }}
                style={{ width: "100vw", height: "100vh" }}
            >
                {cardsData.map((card, idx) => (
                    <Card
                        key={idx}
                        position={[idx * 1.5 - 1.5, 0, 0]}
                        image={card.imageUrl}
                        title={card.title}
                        description={card.description}
                        onClick={() => setSelectedCard(card)}
                    />
                ))}
            </Canvas>

            {selectedCard && (
                <FullCardModal
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}

        </>
    );
}
