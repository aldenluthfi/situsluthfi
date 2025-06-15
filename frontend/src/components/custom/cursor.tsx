import { isMobile } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const previousMousePositionRef = useRef({ x: 0, y: 0 });
    const circlePositionRef = useRef({ x: 0, y: 0 });
    const currentScaleRef = useRef(0);
    const currentAngleRef = useRef(0);
    const animationRef = useRef<number>(0);
    const [size, setSize] = useState<'default' | 'hover' | 'active' | 'hoverActive'>('default');
    const mouseDownRef = useRef(false);
    const lastMouseEventRef = useRef<MouseEvent | null>(null);

    const resizeCursor = (
        newSize: 'default' | 'hover' | 'active' | 'hoverActive',
        setPosition: boolean = true
    ) => {
        setSize(newSize);
        if (!cursorRef.current) return;
        let width, height, top, left;
        let addPrimary = false;

        switch (newSize) {
            case 'active':
                width = '1.5rem';
                height = '1.5rem';
                top = '-0.75rem';
                left = '-0.75rem';
                break;
            case 'hoverActive':
                width = '0.5rem';
                height = '0.5rem';
                top = '-0.25rem';
                left = '-0.25rem';
                addPrimary = true;
                break;
            case 'hover':
                width = '1rem';
                height = '1rem';
                top = '-0.5rem';
                left = '-0.5rem';
                addPrimary = true;
                break;
            default:
                width = '2.5rem';
                height = '2.5rem';
                top = '-1.25rem';
                left = '-1.25rem';
        }
        cursorRef.current.animate(
            [{ width, height }],
            {
                duration: 200,
                fill: "forwards",
                easing: "cubic-bezier(0.3, 0.2, 0.2, 1.4)"
            }
        );
        if (setPosition) {
            cursorRef.current.style.top = top;
            cursorRef.current.style.left = left;
        }
        if (addPrimary) {
            cursorRef.current.classList.remove('bg-transparent');
            cursorRef.current.classList.add('bg-primary');
        } else {
            cursorRef.current.classList.add('bg-transparent');
            cursorRef.current.classList.remove('bg-primary');
        }
    };

    useEffect(() => {
        const isClickableElement = (target: HTMLElement): boolean => {
            return (
                target !== null &&
                target?.tagName === 'A' ||
                target?.tagName === 'BUTTON' ||
                target?.getAttribute('data-slot') === 'button' ||
                (target?.getAttribute('data-slot') === 'tooltip-trigger' && target?.getAttribute('data-disabled') !== 'true') ||
                target?.closest('[data-slot="button"]') !== null ||
                target?.closest('a, button') !== null
            );
        };

        const updateCursor = (e: MouseEvent) => {
            mousePositionRef.current.x = e.clientX;
            mousePositionRef.current.y = e.clientY;
            const hoveredElement = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
            const isClickable = isClickableElement(hoveredElement);

            if (isClickable) {
                resizeCursor(mouseDownRef.current ? 'hoverActive' : 'hover');
            } else {
                resizeCursor(mouseDownRef.current ? 'active' : 'default');
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            lastMouseEventRef.current = e;
            updateCursor(e);
        };

        const handleMouseDown = (e: MouseEvent) => {
            mouseDownRef.current = true;
            updateCursor(e);
        };

        const handleMouseUp = (e: MouseEvent) => {
            mouseDownRef.current = false;
            updateCursor(e);
        };

        const handleScroll = () => {
            if (lastMouseEventRef.current) {
                updateCursor(lastMouseEventRef.current);
            }
        };

        const tick = () => {
            if (!cursorRef.current) return;

            const speed = 0.5;

            circlePositionRef.current.x += (mousePositionRef.current.x - circlePositionRef.current.x) * speed;
            circlePositionRef.current.y += (mousePositionRef.current.y - circlePositionRef.current.y) * speed;

            const deltaMouseX = mousePositionRef.current.x - previousMousePositionRef.current.x;
            const deltaMouseY = mousePositionRef.current.y - previousMousePositionRef.current.y;

            previousMousePositionRef.current.x = mousePositionRef.current.x;
            previousMousePositionRef.current.y = mousePositionRef.current.y;

            const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
            const scaleValue = (mouseVelocity / 150) * 0.4;

            currentScaleRef.current += (scaleValue - currentScaleRef.current) * speed;
            const scaleTransform = `scale(${1 + currentScaleRef.current}, ${1 - currentScaleRef.current})`;

            const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;

            if (mouseVelocity > 20) {
                currentAngleRef.current = angle;
            }

            const rotateTransform = `rotate(${currentAngleRef.current}deg)`;

            cursorRef.current.style.transform = `translate(-50%, -50%) ${rotateTransform} ${scaleTransform}`;
            cursorRef.current.style.left = `${circlePositionRef.current.x}px`;
            cursorRef.current.style.top = `${circlePositionRef.current.y}px`;

            animationRef.current = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', handleMouseMove);

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        document.addEventListener('scroll', handleScroll);

        animationRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('scroll', handleScroll);

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className={`cursor ${isMobile ? "hidden" : "inline-block"} fixed z-[2147483647] w-10 h-10 bg-transparent pointer-events-none border-solid border-primary rounded-full border-2`}
            data-cursor-size={size}
        />
    );
}

export default Cursor;
