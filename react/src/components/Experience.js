import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Experience = () => {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1300 });

  return (
    <animated.section style={props} id="experience" className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Experience</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Shop Zetu</h2>
            <p className="text-lg mb-4">Software Developer (Team Lead)</p>
            <ul className="list-disc list-inside">
              <li>Leading a team of 3 developers</li>
              <li>Building automation tools for internal processes</li>
              <li>Integrating third-party SaaS to our Shopify site</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Solutech</h2>
            <p className="text-lg mb-4">Intern</p>
            <ul className="list-disc list-inside">
              <li>Contributed to source code using Vue and Laravel</li>
            </ul>
          </div>
        </div>
      </div>
    </animated.section>
  );
};

export default Experience;
