import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Education = () => {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1500 });

  return (
    <animated.section style={props} id="education" className="py-20 bg-white">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Education</h1>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Bachelor's in Telecommunications</h2>
          <p className="text-lg">Kabarak University</p>
        </div>
      </div>
    </animated.section>
  );
};

export default Education;
