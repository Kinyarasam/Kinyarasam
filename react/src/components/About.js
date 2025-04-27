import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const About = () => {
  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 700 });

  return (
    <animated.section style={props} id="about" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        <p className="text-lg mb-4">Hey there! I'm Samuel, a passionate software engineer with expertise in low-level and high-level programming languages, DevOps, and cloud technologies.</p>
        <img
          src="https://instagram.fmba5-1.fna.fbcdn.net/v/t51.29350-15/128873426_297563708216645_1054056634643891037_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDEzNTAuc2RyLmYyOTM1MCJ9&_nc_ht=instagram.fmba5-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=Q4RGrmKCG3UQ7kNvgGNq3my&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_AYArlDGdonutlT8sb0ws3jKE6VL48_DcPtRMq13mzeNp8w&oe=66A826C3&_nc_sid=d885a2"
          alt="Samuel"
          className="rounded-full w-32 mx-auto"
          />
      </div>
    </animated.section>
  );
};

export default About;
