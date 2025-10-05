import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import SplitText from "./SplitText";
import LogoLoop from "./LogoLoop";

/**
 * Data for the cards displayed in the About section.
 * Each card includes an ID, title, image path, and extra text content.
 */
const cardsData = [
    {
        id: 1,
        title: "Linux",
        image: "/1.JPEG",
        extra: "I run Arch Linux on my (upgraded) ThinkPad T480 for work and uni, I use EndeavourOS on my machine at home.\nI've been into Linux for a few years now, and honestly can never look at windows without some level of disgust anymore.\n(Pictured: My ThinkPad T480)",
    },
    {
        id: 2,
        title: "PCs",
        image: "/2.JPEG",
        extra: "I’ve loved tinkering with PC hardware for as long as I can remember, building rigs, swapping parts, and obsessing over specs.\nThis love started with PC gaming, specifically TF2 (If you know, you know).\n(Pictured: My latest build, my personal rig)",
    },
    {
        id: 3,
        title: "Cars",
        image: "/3.JPEG",
        extra: "Cars have been a passion of mine for a while. I spend more time on Facebook marketplace and Dubizzle looking for cars I'll never buy than I'm proud to admit, but its fun to dream.\n(Pictured: My favourite car, the 1967 Mustang, specifically this one with the blue paint and white stripes)",
    },
    {
        id: 4,
        title: "About Me",
        image: "/4.JPEG",
        extra: "Hi, I'm Kinan! I’m a CS student at the University of Birmingham Dubai, originally from Syria, but grew up here, in Dubai.\n(Pictured: Me! at the Umayyad Mosque in Damascus)",
    },
    {
        id: 5,
        title: "Home",
        image: "/5.JPEG",
        extra: "Damascus is where I'm from, and although I never got a chance to grow up there, I still hold it in a special place in my heart and wouldn't sell my \"Syrian-ness\" for anything. I love the people, the vibe and most of all the food.\n(Pictured: View from my family's home in Damascus)",
    },
    {
        id: 6,
        title: "Mind & Culture",
        image: "/6.jpg",
        extra: "In another life, I’d probably be studying anthropology. I love philosophy, history, religion, and anything to do with understanding why we are here.\n(Pictured: My current favorite painting, The Coronation of Napoleon (prone to weekly changing)",
    },
];

/**
 * About Component
 *
 * Renders a pick-a-card interface with an animated header,
 * an infinite scrolling carousel of cards (LogoLoop),
 * and a pop-up overlay displaying the selected card's details.
 *
 * Handles responsive screen sizing and adjusts text sizes accordingly.
 */
export default function About() {
    const [screenSize, setScreenSize] = useState("lg"); // tracks current screen size breakpoint
    const [selectedId, setSelectedId] = useState(null); // tracks currently selected card
    const [showSecond, setShowSecond] = useState(false); // for delayed second line animation

    // --- Screen size detection ---
    const breakpoints = { sm: 0, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
    useEffect(() => {
        const updateSize = () => {
            const w = window.innerWidth;
            if (w < breakpoints.md) setScreenSize("sm");
            else if (w < breakpoints.lg) setScreenSize("md");
            else if (w < breakpoints.xl) setScreenSize("lg");
            else if (w < breakpoints["2xl"]) setScreenSize("xl");
            else setScreenSize("2xl");
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // --- Text sizes for responsive headers ---
    const textSizes = {
        h1: { sm: "3.5rem", md: "5rem", lg: "8rem", xl: "9rem", "2xl": "10rem" },
        h2: { sm: "2.5rem", md: "3.5rem", lg: "6rem", xl: "7rem", "2xl": "8rem" },
    };

    // --- Show second line after a short delay ---
    useEffect(() => {
        const timer = setTimeout(() => setShowSecond(true), 1400);
        return () => clearTimeout(timer);
    }, []);

    // --- Prepare logos for the LogoLoop carousel ---
    const logos = cardsData.map((card) => ({
        node: (
            <div
                onClick={() => setSelectedId(card.id)}
                style={{
                    width: 250,
                    height: 400,
                    cursor: "pointer",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    background: "#1a1a1a",
                }}
            >
                <img
                    src={card.image}
                    alt={card.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
        ),
    }));

    return (
        <div>
            {/* --- Header text with animated SplitText --- */}
            <TextContainer>
                <SplitText
                    text="Pick a card."
                    className="font-bold"
                    delay={50}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    tag="h1"
                    textAlign="center"
                    style={{
                        fontSize: textSizes.h1[screenSize],
                        lineHeight: 1.1,
                        marginBottom: "1rem",
                    }}
                />

                {/* wrapper that reserves vertical space for the second line */}
                <div style={{ position: "relative", height: textSizes.h2[screenSize], marginBottom: "5rem" }}>
                    {showSecond && (
                        <SplitText
                            text="Any card."
                            className="italic"
                            delay={50}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            tag="h2"
                            textAlign="center"
                            style={{
                                fontSize: textSizes.h2[screenSize],
                                color: "#7e3ebe",
                                fontStyle: "italic",
                                lineHeight: 1.2,
                                margin: 0,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                            }}
                        />
                    )}
                </div>
            </TextContainer>

            {/* --- Infinite scrolling LogoLoop carousel --- */}
            <LogoLoop
                logos={logos}
                speed={120}
                direction="left"
                width="100%"
                logoHeight={400}
                gap={32}
                pauseOnHover={true}
                isPaused={!!selectedId} // pause smoothly when popup is open
                fadeOut={true}
                scaleOnHover={true}
            />

            {/* --- Pop-up overlay for selected card --- */}
            <AnimatePresence>
                {selectedId && (
                    <Overlay
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0 }} // instant gray background fade
                        onClick={() => setSelectedId(null)}
                    >
                        <PopupCard
                            as={motion.div}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside popup
                        >
                            <CardImage
                                src={cardsData.find((c) => c.id === selectedId).image}
                                alt=""
                            />
                            <TextWrapper>
                                <CardTitle>
                                    {cardsData.find((c) => c.id === selectedId).title}
                                </CardTitle>
                                {cardsData
                                    .find((c) => c.id === selectedId)
                                    .extra.split("\n")
                                    .map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}
                            </TextWrapper>
                        </PopupCard>
                    </Overlay>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Styled Components ---

/** Container for the header text and spacing */
const TextContainer = styled.div`
    text-align: center;
    min-height: 18rem;
    margin-bottom: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* keeps the text at the top and carousel below */
`;

/** Full-screen overlay for pop-up card */
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    background: rgba(0, 0, 0, 0.7);
`;

/** Pop-up card container */
const PopupCard = styled.div`
    display: flex;
    flex-direction: column;
    background: #1a1a1a;
    border-radius: 1rem;
    overflow-y: auto;      /* scroll the whole card */
    width: 90%;            /* responsive width */
    max-width: 500px;
    max-height: 90vh;      /* max height relative to viewport */
`;

/** Image inside pop-up card */
const CardImage = styled.img`
    width: 100%;
    height: auto;          /* let image scale naturally */
    max-height: 50vh;      /* optional: don't let it dominate the card */
    object-fit: cover;
`;

/** Wrapper for card text content */
const TextWrapper = styled.div`
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    color: #fff;

    p {
        font-size: 1.1rem;
        margin: 0.5rem 0;
    }
`;


/** Title of the pop-up card */
const CardTitle = styled.h3`
    margin: 0 0 0.5rem 0;
    font-size: 1.6rem;
`;
