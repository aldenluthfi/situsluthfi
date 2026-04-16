import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
    useEffect(() => {
        document.title = 'aldenluth.fi | 404';
    }, []);

    return (
        <div className="flex flex-col min-h-screen items-center justify-center px-6 py-24 text-center">
            <p className="text-sm tablet:text-base text-muted-foreground mb-3">Error 404</p>
            <h1 className="text-4xl tablet:text-6xl font-black text-primary mb-4">Page Not Found</h1>
            <p className="text-base tablet:text-xl text-muted-foreground max-w-2xl mb-8">
                Looks like this page took an unplanned detour. Let&apos;s get you back to familiar ground.
            </p>
            <Button asChild>
                <Link to="/">Go back home</Link>
            </Button>
        </div>
    );
};

export default NotFound;
