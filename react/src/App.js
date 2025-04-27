import './App.css';
import About from './components/About';
import Contact from './components/Contact';
import Education from './components/Education';
import Experience from './components/Experience';
import Header from './components/Header';
import Projects from './components/Project';
import Skills from './components/Skills';

function App() {
  return (
    <div lassName="font-sans text-gray-900 bg-gray-100">
      <Header />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </div>
  );
}

export default App;
