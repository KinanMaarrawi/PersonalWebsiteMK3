import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Card from "./Card.jsx";
import FullCardModal from "./FullCardModal.jsx";

const placeholderImages = [
    { src: "https://picsum.photos/400/600?random=1", title: "Card 1", description: "Lorem ipsum dolor sit amet." },
    { src: "https://picsum.photos/400/600?random=2", title: "Card 2", description: "Consectetur adipiscing elit." },
    { src: "https://picsum.photos/400/600?random=3", title: "Card 3", description: "Sed do eiusmod tempor." },
    { src: "https://picsum.photos/400/600?random=4", title: "Card 4", description: "Incididunt ut labore et dolore." },
    { src: "https://picsum.photos/400/600?random=5", title: "Card 5", description: "Magna aliqua." },
];

export default function DomeGallery() {
    const [selectedCard, setSelectedCard] = useState(null);

    // Arrange cards on a hemisphere
    const radius = 5;
    const cardsWithPos = useMemo(() => {
        return placeholderImages.map((card, i) => {
            const len = placeholderImages.length;
            const theta = (i / len) * Math.PI; // 0 to 180
            const phi = (i / len) * 2 * Math.PI; // 0 to 360
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.cos(theta) * 0.5; // flatten vertically
            const z = radius * Math.sin(theta) * Math.sin(phi);
            return { ...card, position: [x, y, z] };
        });
    }, []);

    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {cardsWithPos.map((card, i) => (
                    <Card
                        key={i}
                        position={card.position || [0, 0, 0]} // fallback here too
                        image={card.texture}
                        title={card.title}
                        description={card.description}
                        onClick={() => setSelectedCard(card)}
                    />



                ))}
                {/* Disable zoom to prevent scroll interference */}
                <OrbitControls
                    enablePan={false}      // disable panning
                    enableZoom={false}     // disable zoom
                    minPolarAngle={Math.PI / 2 - 0.2} // slightly above horizon
                    maxPolarAngle={Math.PI / 2 + 0.2} // slightly below horizon
                    minAzimuthAngle={-Math.PI / 3}    // left limit
                    maxAzimuthAngle={Math.PI / 3}     // right limit
                />
            </Canvas>

            <FullCardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        </div>
    );
}
