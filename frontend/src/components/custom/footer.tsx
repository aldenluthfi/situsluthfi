import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"

const Footer = () => {
    const [isCopied, setIsCopied] = useState(false);
    const email = "placeholder";

    const copyEmail = () => {
        navigator.clipboard.writeText(email).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        });
    };

    return (
            <footer className="bottom-0 flex w-full justify-center bg-primary-200">
                <nav className="flex justify-between flex-col w-full desktop:w-desktop p-6">
                    <div className="flex max-tablet:flex-col max-tablet:space-y-4 tablet:justify-between tablet:items-end pb-6">
                        <Link to="/" className="px-3 font-heading text-2xl text-foreground w-1/5 h-full">
                            aldenluth.fi
                        </Link>
                        <ul className="flex tablet:justify-end gap-3">
                            <li>
                                <Button onClick={copyEmail} variant="ghost">
                                    {isCopied ? "Email Copied!" : "Contact"}
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost">
                                    Social Media
                                </Button>
                            </li>
                            <li>
                                <Button variant="ghost">
                                    License
                                </Button>
                            </li>
                        </ul>
                    </div>

                    <Separator className='bg-primary-200'/>

                    <div className="flex pt-6 max-tablet:justify-start tablet:justify-center">
                        <p className="max-tablet:px-3 text-sm font-body text-foreground">
                            <span className="inline-block scale-x-[-1]">&copy;</span> 2025 Alden Luthfi. All rights reversed.
                        </p>
                    </div>
                </nav>
            </footer>
    );
};

export default Footer;
