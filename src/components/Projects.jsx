import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Particles from "./Particles.jsx";
import RotatingText from "./RotatingText.jsx";

/**
 * Projects Component
 *
 * Displays a section showcasing the developer's projects.
 * Features:
 * - Rotating text indicating technologies the developer works with
 * - Animated particle background
 * - Clickable project cards linking to GitHub repos
 *
 * Responsive behavior:
 * - Adjusts layout and font size for small screens
 */
const projects = [
    { title: "This Website", image: "/9.png", github: "https://github.com/KinanMaarrawi/PersonalWebsiteMK3" },
    { title: "Dorz 'Book a Ride'", image: "/8.png", github: "https://github.com/KinanMaarrawi/DorzMVP" },
    { title: "PM_CLI", image: "/7.png", github: "https://github.com/KinanMaarrawi/PM_CLI" },
    { title: "GWTIT", image: "/10.png", github: "https://github.com/KinanMaarrawi/GWTIT" }
];

export default function Projects() {
    const rotatingRef = useRef(); // Ref for RotatingText component
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    /**
     * Effect: Updates isSmallScreen state on load and resize
     * Determines if layout should switch to small screen mode
     */
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 876);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Section>
            {/* --- Background particle effect --- */}
            <ParticlesWrapper>
                <Particles
                    speed={0.5}
                    particleColors={["#7e3ebe"]}
                    alphaParticles
                    disableRotation
                    particleCount={1000}
                />
            </ParticlesWrapper>

            {/* --- Main content --- */}
            <Content>
                {/* --- Rotating text row --- */}
                <RotatingRow small={isSmallScreen}>
                    <StaticText>I work with</StaticText>
                    <Box small={isSmallScreen}>
                        <RotatingText
                            ref={rotatingRef}
                            texts={["React","JavaScript","Tailwind","Python","Flask","SQL","Java","Kotlin","C"]}
                            staggerDuration={0.05}
                            rotationInterval={4000}
                            auto
                            loop
                            splitBy="characters"
                            mainClassName="flex"
                            elementLevelClassName="text-white"
                            textSize={isSmallScreen ? "2rem" : "4rem"}
                        />
                    </Box>
                </RotatingRow>

                {/* --- Project cards grid --- */}
                <CardsGrid small={isSmallScreen}>
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

// ==================== Styled Components ====================

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

    @media (max-width: 875px) {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
`;

const StaticText = styled.span`
    font-size: clamp(3rem, 6vw, 6rem);
    color: white;
    font-weight: bold;
`;

const Box = styled.div`
    position: relative;
    background-color: #7e3ebe;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${props => (props.small ? "0.25em 0.6em" : "0.5em 1em")};
    border-radius: 1rem;
    min-width: 3ch;
`;

const CardsGrid = styled.div`
    display: grid;
    gap: 2rem;
    width: 100%;
    justify-items: center;
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: 875px) {
        grid-template-columns: repeat(2, 1fr); /* 2x2 layout on small screens */
    }
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
    width: 100%;
    max-width: 280px;
    min-height: 280px;

    &:hover {
        transform: translateY(-10px);
    }

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1rem;
        padding: 2px;
        background: linear-gradient(90deg, #7e3ebe, #ff4fa0, #7e3ebe);
        background-size: 200% 200%;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
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
