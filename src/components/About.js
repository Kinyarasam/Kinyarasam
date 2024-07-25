import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const About = () => {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 700 });

  return (
    <animated.section style={props} id="about" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        <p className="text-lg mb-4">Hey there! I'm Samuel, a passionate software engineer with expertise in low-level and high-level programming languages, DevOps, and cloud technologies.</p>
        <img src="your-photo-url" alt="Samuel" className="rounded-full w-32 mx-auto" />
      </div>
    </animated.section>
  );
};

export default About;
