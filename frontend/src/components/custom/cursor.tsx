import { useEffect, useRef, useState } from 'react';

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mouseDown, setMouseDown] = useState(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const circlePositionRef = useRef({ x: 0, y: 0 });
  const currentScaleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current.x = e.clientX;
      mousePositionRef.current.y = e.clientY;
    };

    const isClickableElement = (target: HTMLElement): boolean => {
      return (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.classList.contains('button') || 
        target.hasAttribute('data-slot') && target.getAttribute('data-slot') === 'button' ||
        target.closest('[data-slot="button"]') !== null ||
        target.closest('a, button') !== null
      );
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = isClickableElement(target);

      if (!isClickable) {
        animateCursor({
          width: '1.5rem',
          height: '1.5rem',
        });
      } else {
        animateCursor({
          width: '0.5rem',
          height: '0.5rem',
        });
      }

      document.activeElement instanceof HTMLElement && document.activeElement.blur();
      setMouseDown(prev => prev + 1);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = isClickableElement(target);

      if (!isClickable) {
        if (cursorRef.current) {
          cursorRef.current.style.top = `-1.25rem`;
          cursorRef.current.style.left = `-1.25rem`;
        }
        animateCursor({
          width: '2.5rem',
          height: '2.5rem',
        });
      } else {
        if (cursorRef.current) {
          cursorRef.current.style.top = `-0.5rem`;
          cursorRef.current.style.left = `-0.5rem`;
        }
        animateCursor({
          width: '1rem',
          height: '1rem',
        });
      }

      setMouseDown(prev => prev - 1);
    };

    const handleClickableHover = (e: Event) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.classList.remove('bg-transparent');
        cursor.classList.add('bg-primary');

        if (mouseDown === 1) {
          animateCursor({
            width: '0.5rem',
            height: '0.5rem',
          });
        } else {
          animateCursor({
            width: '1rem',
            height: '1rem',
          });
        }
      }
    };

    const handleClickableLeave = (_: Event) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.classList.add('bg-transparent');
        cursor.classList.remove('bg-primary');

        if (mouseDown === 1) {
          animateCursor({
            width: '1.5rem',
            height: '1.5rem',
          });
        } else {
          animateCursor({
            width: '2.5rem',
            height: '2.5rem',
          });
        }
      }
    };

    const animateCursor = (properties: { width: string; height: string }) => {
      cursorRef.current?.animate(
        [properties],
        {
          duration: 200,
          fill: "forwards",
          easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)"
        }
      );
    };

    const tick = () => {
      if (!cursorRef.current) return;

      // Movement speed factor
      const speed = 0.5;

      // MOVE
      circlePositionRef.current.x += (mousePositionRef.current.x - circlePositionRef.current.x) * speed;
      circlePositionRef.current.y += (mousePositionRef.current.y - circlePositionRef.current.y) * speed;

      // SQUEEZE
      const deltaMouseX = mousePositionRef.current.x - previousMousePositionRef.current.x;
      const deltaMouseY = mousePositionRef.current.y - previousMousePositionRef.current.y;

      previousMousePositionRef.current.x = mousePositionRef.current.x;
      previousMousePositionRef.current.y = mousePositionRef.current.y;

      const mouseVelocity = Math.min(Math.sqrt(deltaMouseX**2 + deltaMouseY**2) * 4, 150);
      const scaleValue = (mouseVelocity / 150) * 0.4;

      currentScaleRef.current += (scaleValue - currentScaleRef.current) * speed;
      const scaleTransform = `scale(${1 + currentScaleRef.current}, ${1 - currentScaleRef.current})`;

      // ROTATE
      const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;

      if (mouseVelocity > 20) {
        currentAngleRef.current = angle;
      }

      const rotateTransform = `rotate(${currentAngleRef.current}deg)`;

      // Apply transformations
      cursorRef.current.style.transform = `translate(-50%, -50%) ${rotateTransform} ${scaleTransform}`;
      cursorRef.current.style.left = `${circlePositionRef.current.x}px`;
      cursorRef.current.style.top = `${circlePositionRef.current.y}px`;

      animationRef.current = requestAnimationFrame(tick);
    };

    const setupClickableInteractions = () => {
      // Update selector to include data-slot="button" elements
      const clickables = document.querySelectorAll('a, button, .button, [data-slot="button"]');
      
      clickables.forEach(clickable => {
        clickable.addEventListener('mouseover', handleClickableHover);
        clickable.addEventListener('mouseleave', handleClickableLeave);
      });

      return () => {
        clickables.forEach(clickable => {
          clickable.removeEventListener('mouseover', handleClickableHover);
          clickable.removeEventListener('mouseleave', handleClickableLeave);
        });
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const cleanupClickables = setupClickableInteractions();
    animationRef.current = requestAnimationFrame(tick);

    // Handle dynamically added elements
    const observer = new MutationObserver(() => {
      cleanupClickables();
      setupClickableInteractions();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cleanupClickables();
      observer.disconnect();

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mouseDown]);

  return (
    <div
      ref={cursorRef}
      className="cursor hidden desktop:inline-block fixed z-[2147483647] w-10 h-10 bg-transparent pointer-events-none border-solid border-primary rounded-full border-2"
    />
  );
}

export default Cursor;
