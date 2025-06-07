import SlidingTitle from '@/components/custom/sliding-title';
import WorldMap from '@/components/custom/world-map';
import Squiggle from '@/components/custom/squiggle';
import { useTheme } from "@/components/custom/theme-provider"
import { Continents, Asia, Europe, Indonesia, Malaysia, Singapore, SouthKorea, Thailand, SaudiArabia, UAE, Belgium, France, Germany, Netherlands, Italy, Switzerland, Spain } from '@/components/maps';

const Gallery: React.FC = () => {
    const { mode } = useTheme();

    return (
        <div className='flex flex-col min-h-screen items-center overflow-clip'>
            <div className="flex flex-col w-full justify-center items-center space-y-6 my-32 ultrawide:my-48">
                <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center mb-6">
                    This is my silly excuse of a <span className="text-primary font-body-bold">gallery</span>, <span />
                    <br className="ultrawide:hidden" />
                    here you will find
                </p>
                <SlidingTitle text="People · Panoramas · Cultures · Oddities" />
                <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center mt-6">
                    I have <span className="text-primary font-body-bold">seen</span> in all
                    <br className="ultrawide:hidden" />
                    of my travels around this <span className="text-primary font-body-bold">blob of dust</span>
                </p>
            </div>
            <div className='flex flex-col -space-y-1 justify-center items-center w-full'>
                <Squiggle className="w-full fill-primary-100 -z-10" />
                <div className='bg-primary-100 w-full py-10 flex justify-center items-center'>
                    <div className='p-10 desktop:p-0'>
                        <WorldMap
                            components={
                                {
                                    'World': Continents,
                                    'Asia': Asia,
                                    'Europe': Europe,
                                    'Indonesia': Indonesia,
                                    'Malaysia': Malaysia,
                                    'Singapore': Singapore,
                                    'South Korea': SouthKorea,
                                    'Thailand': Thailand,
                                    'Saudi Arabia': SaudiArabia,
                                    'United Arab Emirates': UAE,
                                    'Belgium': Belgium,
                                    'France': France,
                                    'Germany': Germany,
                                    'Italy': Italy,
                                    'Netherlands': Netherlands,
                                    'Spain': Spain,
                                    'Switzerland': Switzerland
                                }
                            }
                            selectables={{
                                    'World': ['Asia', 'Europe'],
                                    'Asia': ['Saudi Arabia', 'United Arab Emirates', 'Thailand', 'Indonesia', 'Malaysia', 'Singapore', 'South Korea', 'Qatar'],
                                    'Europe': ['France', 'Germany', 'Belgium', 'Italy', 'Spain', 'Netherlands', 'Switzerland'],
                                    'Indonesia': ['Banten', 'Jakarta Raya', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali', 'Nusa Tenggara Timur', 'Lampung'],
                                    'Malaysia': ['Johor', 'Penang', 'Kuala Lumpur', 'Pahang'],
                                    'Singapore': ['Central Singapore', 'North East Singapore', 'North West Singapore', 'South East Singapore', 'South West Singapore'],
                                    'South Korea': ['Seoul', 'Incheon', 'Jeju'],
                                    'Thailand': ['Bangkok', 'Chon Buri'],
                                    'Saudi Arabia': ['Ar Riyāḑ', 'Makkah', 'Al Madīnah'],
                                    'United Arab Emirates': ['Dubayy'],
                                    'Belgium': ['Brussels Capital Region'],
                                    'France': ['Île-de-France', 'Alsace'],
                                    'Germany': ['Hesse'],
                                    'Italy': ['Toscana', 'Veneto', 'Lazio', 'Vatican City Italy'],
                                    'Netherlands': ['Noord-Holland'],
                                    'Spain': ['Catalonia', 'Andalusia'],
                                    'Switzerland': ['Obwalden', 'Bern', 'Genève']
                                }
                            }
                            pathStyles={ mode === 'dark' ? {
                                    base: "stroke-muted",
                                    hover: "fill-primary",
                                    selected: "fill-primary",
                                    selectable: "fill-primary-400 stroke-primary-300 pointer-events-auto",
                                    nonSelectable: "fill-card"
                                } :
                                {
                                    base: "stroke-muted-foreground/50",
                                    hover: "fill-primary",
                                    selected: "fill-primary",
                                    selectable: "fill-primary-400 stroke-primary-600 pointer-events-auto",
                                    nonSelectable: "fill-muted"
                                }
                            }
                            strokeWidth={0.5}
                            maxHeight='80vh'
                            maxWidth='90vw'
                        />
                    </div>
                </div>
                <Squiggle className="-scale-y-100 w-full fill-primary-100 -z-10" />
            </div>
            <div className='h-screen max-w-4xl'>
            </div>
        </div>
    );
};

export default Gallery;
