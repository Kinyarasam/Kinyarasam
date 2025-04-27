import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Header = () => {
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 500
  });

  return (
    <animated.nav style={props} className="bg-blue-600 text-white py-4">
      <ul className='flex justify-around'>
        <li><a href="#about" className="hover:text-yellow-300">About</a></li>
        <li><a href="#projects" className="hover:text-yellow-300">Projects</a></li>
        <li><a href="#skills" className="hover:text-yellow-300">Skills</a></li>
        <li><a href="#experience" className="hover:text-yellow-300">Experience</a></li>
        <li><a href="#education" className="hover:text-yellow-300">Education</a></li>
        <li><a href="#contact" className="hover:text-yellow-300">Contact</a></li>
      </ul>
    </animated.nav>
  );
};

export default Header;
