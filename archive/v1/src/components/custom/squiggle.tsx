import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SquiggleProps {
    width?: number;
    className?: string;
}


const Squiggle: React.FC<SquiggleProps> = ({
    width: initialWidth = 7,
    className = ''
}) => {
    const [dynamicWidth, setDynamicWidth] = useState(initialWidth);

    useEffect(() => {
        const calculateWidth = () => {
            const calculatedWidth = ((document.documentElement.clientWidth / 100) | 1);
            setDynamicWidth(calculatedWidth);
        };

        calculateWidth();

        window.addEventListener('resize', calculateWidth);

        return () => {
            window.removeEventListener('resize', calculateWidth);
        };
    }, []);

    return (
        <svg
            viewBox={`0 0 ${dynamicWidth * 600} 375`}
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className, "bg-background")}
        >
            <defs>
                <pattern id="bg" patternUnits="userSpaceOnUse" width="600" height="375">
                    <path d="M600 974.999C550.562 974.773 500.822 935.117 450.85 855.224C400.682 775.017 350.28 734.507 299.575 734.507C249.443 734.507 199.607 776.587 150 855V855.224C99.8848 935.346 50.0037 975 0.425201 975C0.28347 975 0.141736 975 0 974.999V240.492C0.141731 240.493 0.283465 240.493 0.425201 240.493C50.5572 240.493 100.393 200.893 150 122.48V122.5C200.115 42.378 249.996 0 299.575 0C349.153 0 399.034 39.6537 449.15 119.776C499.178 199.758 549.438 240.267 600 240.492V974.999Z" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bg)"/>
        </svg>
    );
};

export default Squiggle;
