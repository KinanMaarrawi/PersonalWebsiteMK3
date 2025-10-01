import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

export default function Card({ position, image, onClick }) {
    const meshRef = useRef();
    const texture = useLoader(TextureLoader, image || "https://picsum.photos/400/600?random=999");
    const [hovered, setHovered] = useState(false);

    // Floating and hover animation
    useFrame((state) => {
        if (!meshRef.current) return;

        // Smooth scale
        const targetScale = hovered ? 1.2 : 1;
        meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1;
        meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1;

        // Slight floating motion
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1;
        meshRef.current.position.x = position[0] + Math.sin(t + position[2]) * 0.05;

        // Keep card facing camera
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.x = 0;
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onClick}
        >
            <planeGeometry args={[1, 1.5]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}
