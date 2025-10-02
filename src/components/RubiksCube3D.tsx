import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const RubiksCube3D: React.FC = () => {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    let rotationY = 0;

    const animate = () => {
      rotationY += 1;
      cube.style.transform = `rotateY(${rotationY}deg) rotateX(-15deg)`;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Cores simples do cubo mágico com base laranja
  const colors = {
    primary: "#FF8933",
    light: "#FFB366",
    dark: "#E5751A",
    shadow: "#CC5500",
  };

  // Função para criar uma face simples do cubo
  const createFace = (className: string, baseColor: string) => (
    <div className={`face ${className}`}>
      {Array.from({ length: 9 }, (_, index) => (
        <div
          key={index}
          className="square"
          style={{ backgroundColor: baseColor }}
        />
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        .cube-container {
          perspective: 1000px;
          width: 300px;
          height: 300px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 10px 20px rgba(255, 137, 51, 0.3));
        }

        .cube-scene {
          width: 200px;
          height: 200px;
          position: relative;
          transform-style: preserve-3d;
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .face {
          position: absolute;
          width: 200px;
          height: 200px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 2px;
          border: 2px solid #994411;
          box-sizing: border-box;
          border-radius: 6px;
        }

        .square {
          border: 1px solid #773300;
          border-radius: 3px;
          box-shadow: 
            inset 0 0 10px rgba(0,0,0,0.2),
            inset 0 1px 3px rgba(255,255,255,0.3);
          transition: all 0.3s ease;
        }

        .square:hover {
          transform: scale(0.95);
          box-shadow: 
            inset 0 0 15px rgba(0,0,0,0.3),
            inset 0 1px 5px rgba(255,255,255,0.4);
        }

        .front { 
          transform: rotateY(0deg) translateZ(100px);
          background: linear-gradient(135deg, #FF8933, #FFB366);
        }
        .back { 
          transform: rotateY(180deg) translateZ(100px);
          background: linear-gradient(135deg, #E5751A, #CC5500);
        }
        .right { 
          transform: rotateY(90deg) translateZ(100px);
          background: linear-gradient(135deg, #FFB366, #FF8933);
        }
        .left { 
          transform: rotateY(-90deg) translateZ(100px);
          background: linear-gradient(135deg, #E5751A, #FF8933);
        }
        .top { 
          transform: rotateX(90deg) translateZ(100px);
          background: linear-gradient(135deg, #FF8933, #E5751A);
        }
        .bottom { 
          transform: rotateX(-90deg) translateZ(100px);
          background: linear-gradient(135deg, #CC5500, #994411);
        }

        @media (max-width: 768px) {
          .cube-container {
            width: 250px;
            height: 250px;
          }
          
          .cube-scene {
            width: 150px;
            height: 150px;
          }
          
          .face {
            width: 150px;
            height: 150px;
          }
          
          .front { transform: rotateY(0deg) translateZ(75px); }
          .back { transform: rotateY(180deg) translateZ(75px); }
          .right { transform: rotateY(90deg) translateZ(75px); }
          .left { transform: rotateY(-90deg) translateZ(75px); }
          .top { transform: rotateX(90deg) translateZ(75px); }
          .bottom { transform: rotateX(-90deg) translateZ(75px); }
        }
      `}</style>

      <motion.div
        className="cube-container"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="cube-scene">
          <div ref={cubeRef} className="cube">
            {/* Face frontal */}
            {createFace("front", colors.primary)}

            {/* Face traseira */}
            {createFace("back", colors.dark)}

            {/* Face direita */}
            {createFace("right", colors.light)}

            {/* Face esquerda */}
            {createFace("left", colors.primary)}

            {/* Face superior */}
            {createFace("top", colors.light)}

            {/* Face inferior */}
            {createFace("bottom", colors.shadow)}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RubiksCube3D;
