import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import SplitText from "./SplitText";

const cardsData = [
    { id: 1, title: "T480", image: "public/1.JPEG", extra: "I run Arch Linux on my (upgraded) ThinkPad T480 for work and uni, note-taking in Obsidian, and keeping tons of Firefox tabs open.\n(Pictured: My ThinkPad T480)" },
    { id: 2, title: "PCs", image: "public/2.JPEG", extra: "I’ve loved tinkering with PC hardware for as long as I can remember, building rigs, swapping parts, and obsessing over specs.\n(Pictured: My latest build, my personal rig)" },
    { id: 3, title: "Cars", image: "public/3.JPEG", extra: "Cars have been a passion of mine for a while. I spend time browsing Facebook Marketplace for cars I’ll never buy, but it’s fun to dream.\n(Pictured: 1967 Mustang, specifically this one with the blue paint and white stripes)" },
    { id: 4, title: "About Me", image: "public/4.JPEG", extra: "I’m a CS student at the University of Birmingham Dubai, originally from Damascus, but grew up here.\n(Pictured: Me! at the Umayyad Mosque in Damascus)" },
    { id: 5, title: "Home", image: "public/5.JPEG", extra: "Damascus is where I'm from, and although I never got a chance to grow up there, I still hold it in a special place in my heart and wouldn't sell my \"Syrian-ness\" for anything. I love the people, the vibe and most of all the food.\n(Pictured: View from my family's home in Damascus)" },
    { id: 6, title: "Mind & Culture", image: "public/6.jpg", extra: "In another life, I’d probably be studying anthropology. I love philosophy, history, religion, and anything to do with understanding why we are here.\n(Pictured: My current favorite painting, The Coronation of Napoleon (prone to weekly changing)"},
];

export default function About() {
    const [showSecond, setShowSecond] = useState(false);

    // Hardcoded delay to show the second text after first
    useEffect(() => {
        const timer = setTimeout(() => setShowSecond(true), 1400); // 1.5s delay
        return () => clearTimeout(timer);
    }, []);

    const [selectedId, setSelectedId] = useState(null);
    const [showTextId, setShowTextId] = useState(null);

    const handleClick = (id) => {
        if (selectedId === id) {
            setShowTextId(null);
            setSelectedId(null);
        } else {
            setShowTextId(null);
            setSelectedId(id);
            setTimeout(() => setShowTextId(id), 400);
        }
    };

    return (
        <div>
            <TextContainer>
                {/* First text: Pick a card */}
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
                    style={{ fontSize: "8rem", lineHeight: 1.1, marginBottom: "0.5rem" }} // closer to second text
                />

                {/* Second text: Any card */}
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
                            fontSize: "6rem",
                            color: "#7e3ebe",
                            fontStyle: "italic",
                            lineHeight: 1.2,
                            marginTop: 0,             // remove extra gap above
                            marginBottom: "4rem",     // add more space below so gallery stays put
                        }}
                    />
                )}
            </TextContainer>

            {/* Gallery */}
            <Gallery>
                {cardsData.map((card) => {
                    const isSelected = selectedId === card.id;
                    return (
                        <CardContainer key={card.id} onClick={() => handleClick(card.id)}>
                            <Card
                                as={motion.div}
                                initial={{ width: 250 }}
                                animate={{ width: isSelected ? 700 : 250 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ImageWrapper
                                    as={motion.div}
                                    initial={{ width: "100%" }}
                                    animate={{ width: isSelected ? "35%" : "100%" }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CardImage src={card.image} alt={card.title} />
                                </ImageWrapper>

                                <AnimatePresence>
                                    {isSelected && showTextId === card.id && (
                                        <TextWrapper
                                            as={motion.div}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <CardTitle>{card.title}</CardTitle>
                                            {card.extra.split("\n").map((line, idx) => (
                                                <p key={idx}>{line}</p>
                                            ))}
                                        </TextWrapper>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </CardContainer>
                    );
                })}
            </Gallery>
        </div>
    );
}

// Styled components
const TextContainer = styled.div`
    text-align: center;
    margin-bottom: 0;          /* we'll control spacing via margins on SplitText */
    min-height: 18rem;         /* reserve space for both texts */
`;


const Gallery = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 5rem;
`;

const CardContainer = styled.div`
  cursor: pointer;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  background: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;
  height: 400px;
`;

const ImageWrapper = styled.div`
  height: 100%;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextWrapper = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  color: #fff;
  flex: 1;
  overflow: hidden;

  p {
    font-size: 1.1rem;
  }
`;

const CardTitle = styled.h3`
    margin: 0 0 0.5rem 0;
    font-size: 1.6rem;
`;
