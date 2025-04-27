import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Skills = () => {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1100 });

  return (
    <animated.section style={props} id="skills" className="py-20 bg-white">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Skills</h1>
        <ul className="flex flex-wrap justify-center space-x-6">
          <li className="text-lg">C, C++, .NET, Python, JavaScript</li>
          <li className="text-lg">Docker, Kubernetes, Redis</li>
          <li className="text-lg">React, Vue, SDL2, OpenGL</li>
        </ul>
      </div>
    </animated.section>
  );
};

export default Skills;
