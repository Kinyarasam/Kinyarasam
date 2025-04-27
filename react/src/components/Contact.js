import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Contact = () => {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1700 });

  return (
    <animated.section style={props} id="contact" className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Contact</h1>
        <p className="text-lg mb-4">Email: skinyara.30@gmail.com</p>
        <ul className="flex justify-center space-x-6">
          <li><a href="https://www.linkedin.com/in/kinyara-samuel-gachigo-885b151a5/" className="text-blue-600 hover:text-blue-800">LinkedIn</a></li>
          <li><a href="https://github.com/kinyarasam" className="text-blue-600 hover:text-blue-800">GitHub</a></li>
        </ul>
      </div>
    </animated.section>
  );
};

export default Contact;
