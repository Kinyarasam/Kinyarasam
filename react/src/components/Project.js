import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Projects = () => {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 900 });

  return (
    <animated.section style={props} id="projects" className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">GrooveJam</h2>
            <p className="text-lg mb-4">A lightweight, high-performance music player built in C.</p>
            <a href="https://github.com/kinyarasam/groovejam" className="text-blue-600 hover:text-blue-800">GitHub</a>
          </div>
          {/* Add more projects in a similar format */}
        </div>
      </div>
    </animated.section>
  );
};

export default Projects;
