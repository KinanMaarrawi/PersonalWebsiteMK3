import Particles from './Particles.jsx';
import RotatingText from './RotatingText.jsx';

export default function Projects() {
    const languages = ['React', 'JavaScript', 'TailwindCSS', 'Python', 'Flask', 'SQL', 'Java', 'Kotlin', 'C'];

    return (
        <div className="projects w-full h-screen relative bg-black overflow-hidden">
            <Particles
                speed={0.5}
                particleColors={['#7e3ebe']}
                alphaParticles={true}
                disableRotation={true}
                particleCount={1000}
                className="absolute inset-0 z-0"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center z-10">
                {/* Static text fixed */}
                <span className="text-white font-bold text-[6em] mr-[25px]">
          I work with
        </span>

                {/* Rotating text with smooth box growth */}
                <RotatingText
                    texts={languages}
                    staggerDuration={0.05}
                    rotationInterval={3000}
                    auto={true}
                    loop={true}
                    mainClassName="text-white font-bold"
                    boxColor="#7e3ebe"
                    boxPadding={16}
                    textSize="6em"
                    boxHeightMultiplier={1.2}
                    borderRadius="1em"
                />
            </div>
        </div>
    );
}
