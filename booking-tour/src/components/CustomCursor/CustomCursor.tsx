// components/CustomCursor.tsx
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 20); // -20 để căn giữa cursor
      mouseY.set(e.clientY - 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="w-[40px] h-[40px] rounded-full fixed top-0 left-0 z-[9999] pointer-events-none 
                 bg-blue-500 opacity-30 blur-md mix-blend-multiply"
      style={{
        translateX: smoothX,
        translateY: smoothY,
      }}
    />
  );
};

export default CustomCursor;
