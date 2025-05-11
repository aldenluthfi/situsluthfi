import { useEffect, useRef } from 'react';

interface SlidingTitleProps {
  text: string;
  className?: string;
}

const SlidingTitle: React.FC<SlidingTitleProps> = ({ text, className = "" }) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const requestRef = useRef<number>(0);

  const textX = useRef(0);
  const slideSpeed = useRef(0);
  const oldMouseX = useRef(0);
  const mouseX = useRef(0);
  const deltaX = useRef(0);

  const getTranslateX = (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return matrix.m41;
  };

  useEffect(() => {
    const marquee = () => {
      if (!textRef.current) return;

      const text = textRef.current;

      if (deltaX.current > 30 || deltaX.current < -30) {
        slideSpeed.current = Math.min(
          Math.max(slideSpeed.current + (deltaX.current - slideSpeed.current) * 0.1, -25),
          15
        );
      } else {
        slideSpeed.current = slideSpeed.current * 0.95;
      }

      textX.current = (getTranslateX(text) - slideSpeed.current - 2);

      if (textX.current < -text.getBoundingClientRect().width * 0.25) {
        textX.current += text.getBoundingClientRect().width * 0.5 + 11;
      } else if (textX.current > text.getBoundingClientRect().width * 0.25) {
        textX.current -= text.getBoundingClientRect().width * 0.5 + 11;
      }

      deltaX.current = mouseX.current - oldMouseX.current;
      oldMouseX.current = mouseX.current;

      const skewAngle = Math.max(
        Math.min(slideSpeed.current + (deltaX.current - slideSpeed.current) * 0.1, 5),
        -7
      ).toFixed(1);

      text.style.transform = `translate(${textX.current}px, 0px) skewX(${skewAngle}deg)`;
      requestRef.current = requestAnimationFrame(marquee);
    };

    requestRef.current = requestAnimationFrame(marquee);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
    };

    const handleMouseOver = (e: MouseEvent) => {
      oldMouseX.current = e.clientX;
    };

    if (document.documentElement.clientWidth >= 1024 && textRef.current) {
      textRef.current.addEventListener('mousemove', handleMouseMove);
      textRef.current.addEventListener('mouseover', handleMouseOver);
    }

    return () => {
      cancelAnimationFrame(requestRef.current);
      if (textRef.current) {
        textRef.current.removeEventListener('mousemove', handleMouseMove);
        textRef.current.removeEventListener('mouseover', handleMouseOver);
      }
    };
  }, []);

  const marqueeText = `${text} · ${text} · ${text} · ${text} · ${text} · ${text} · ${text} · ${text} · `;

  return (
    <h1
      ref={textRef}
      className={`text-6xl self-center tablet:text-8xl ultrawide:text-10xl justify-center font-heading whitespace-nowrap ${className}`}
    >
      {marqueeText}
    </h1>
  );
};

export default SlidingTitle;
