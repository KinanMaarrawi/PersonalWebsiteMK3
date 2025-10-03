import React, { useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "./Particles.jsx";
import RotatingText from "./RotatingText.jsx";

// Placeholder project data
const projects = [
    {
        title: "This Website",
        image: "/9.png",
        github: "https://github.com/KinanMaarrawi/PersonalWebsiteMK3",
    },
    {
        title: "Dorz 'Book a Ride'",
        image: "/8.png",
        github: "https://github.com/KinanMaarrawi/DorzMVP",
    },
    {
        title: "PM_CLI",
        image: "/7.png",
        github: "https://github.com/KinanMaarrawi/PM_CLI",
    },
];

export default function Projects() {
    const rotatingRef = useRef();

    return (
        <Section>
            <ParticlesWrapper>
                <Particles
                    speed={0.5}
                    particleColors={["#7e3ebe"]}
                    alphaParticles={true}
                    disableRotation={true}
                    particleCount={1000}
                />
            </ParticlesWrapper>

            <Content>
                <RotatingRow>
                    <StaticText>I work with</StaticText>
                    <Box>
                        <RotatingText
                            ref={rotatingRef}
                            texts={[
                                "React",
                                "JavaScript",
                                "Tailwind",
                                "Python",
                                "Flask",
                                "SQL",
                                "Java",
                                "Kotlin",
                                "C",
                            ]}
                            staggerDuration={0.05}
                            rotationInterval={4000}
                            auto={true}
                            loop={true}
                            splitBy="characters"
                            mainClassName="flex"
                            elementLevelClassName="text-white text-[clamp(3rem,6vw,4rem)]"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-120%", opacity: 0 }}
                        />
                    </Box>
                </RotatingRow>

                <CardsGrid>
                    {projects.map((proj, idx) => (
                        <Card key={idx} onClick={() => window.open(proj.github, "_blank")}>
                            <CardImage src={proj.image} alt={proj.title} />
                            <CardTitle>{proj.title}</CardTitle>
                        </Card>
                    ))}
                </CardsGrid>
                <h1>Some of my <span className="text-[#7e3ebe]">top</span> projects</h1>
            </Content>
        </Section>
    );
}

// Styled components
const Section = styled.section`
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ParticlesWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const RotatingRow = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 4rem;
    flex-wrap: wrap;
`;

const StaticText = styled.span`
    margin-right: 20px;
    font-size: clamp(6rem, 6vw, 4rem);
    color: white;
    font-weight: bold;
`;

const Box = styled.div`
    position: relative;
    background-color: #7e3ebe;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5em 1em;
    border-radius: 1rem;
    min-width: 3ch; /* ensures box never disappears */
`;

const CardsGrid = styled.div`
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    width: 100%;
`;

const Card = styled.div`
    position: relative;
    background-color: #1a1a1a;
    border-radius: 1rem;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-10px);
    }

    /* Only border glow */
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
        mask-composite: exclude;
        -webkit-mask-composite: destination-out;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        animation: borderAnimation 3s linear infinite;
    }

    &:hover::after {
        opacity: 1;
    }

    @keyframes borderAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;



const CardImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const CardTitle = styled.h3`
    color: #fff;
    font-size: 1.5rem;
    padding: 1rem;
    text-align: center;
`;
