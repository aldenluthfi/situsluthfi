import SlidingTitle from '@/components/custom/sliding-title';
import WorldMap from '@/components/custom/world-map';
import Squiggle from '@/components/custom/squiggle';

const Gallery: React.FC = () => {
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
            <div className='flex flex-col -space-y-1 justify-center items-center w-auto h-4xl'>
                <Squiggle className="w-full fill-primary-100 -z-10" />
                <div className='bg-primary-100 px-10 desktop:px-0 w-auto h-4xl'>
                    <WorldMap
                        selectables={{
                            continents: ['Asia', 'Europe'],
                            countries: {
                                Asia: ['Saudi Arabia', 'Thailand', 'Indonesia', 'Malaysia', 'Singapore', 'South Korea'],
                                Europe: ['France', 'Germany', 'Belgium', 'Italy', 'Spain', 'Netherlands', 'Switzerland']
                            }
                        }}
                        pathStyles={{
                            base: "stroke-muted",
                            hover: "fill-primary",
                            selected: "fill-primary",
                            selectable: "fill-primary-400 stroke-primary-300",
                            nonSelectable: "fill-card"
                        }}
                        strokeWidth={0.5}
                        className='p-10 h-4xl w-auto'
                    />
                </div>
                <Squiggle className="-scale-y-100 w-full fill-primary-100 -z-10" />
            </div>
        </div>
    );
};

export default Gallery;
