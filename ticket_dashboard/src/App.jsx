import Routing from './Routing'
import { useState, useEffect } from 'react';

function App() {

  const [scaleClass, setScaleClass] = useState("");

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (w <= 1366 && h <= 768) {
      setScaleClass("scale-75 w-[133.33%] h-[133.33%]");
    } else if (w <= 1920 && h <= 1080) {
      setScaleClass("")  
    }
  }, []);

  return (
    <div className={`absolute inset-0 transform origin-top-left ${scaleClass} bg-white`}>
      <Routing />
    </div>
  );
}

export default App
