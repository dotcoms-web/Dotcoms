import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotX = useSpring(cursorX, { damping: 40, stiffness: 800, mass: 0.2 });
  const dotY = useSpring(cursorY, { damping: 40, stiffness: 800, mass: 0.2 });

  const ringScale = useTransform(cursorXSpring, [-100, 0], [1, 1]);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktop(mq.matches);

    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
      const target = e.target as HTMLElement;
      setIsPointer(
        !!target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer')
      );
    };
    const leave = () => setIsVisible(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, [cursorX, cursorY]);

  if (!isDesktop) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border-2 border-brand-500"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: 36,
          height: 36,
          translateX: '-50%',
          translateY: '-50%',
          scale: ringScale,
          opacity: isVisible ? (isPointer ? 0.6 : 0.4) : 0,
        }}
        animate={{ scale: isPointer ? 1.5 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-brand-500"
        style={{
          x: dotX,
          y: dotY,
          width: 6,
          height: 6,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
