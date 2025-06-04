import SlidingTitle from '../components/custom/sliding-title';
import World from "@react-map/world"
import Indonesia from "@react-map/indonesia";

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
            <div className='flex justify-center items-center'>
                <World
                    type='select-multiple'
                    hoverColor="var(--primary)"
                    selectColor="var(--primary)"
                    mapColor='var(--muted)'
                    strokeColor='var(--muted-foreground)'
                    strokeWidth={0.75}
                    hints
                    hintBackgroundColor='var(--primary-200)'
                    hintTextColor='var(--primary-700)'
                    size={window.innerWidth < 768 ? 400 : window.innerWidth < 1024 ? 800 : window.innerWidth < 1536 ? 1200 : 1600}
                />
            </div>
            <div className='flex justify-center items-center'>
                <Indonesia
                    type='select-multiple'
                    hoverColor="var(--primary)"
                    selectColor="var(--primary)"
                    mapColor='var(--muted)'
                    strokeColor='var(--muted-foreground)'
                    strokeWidth={0.75}
                    hints
                    hintBackgroundColor='var(--primary-200)'
                    hintTextColor='var(--primary-700)'
                    size={window.innerWidth < 768 ? 400 : window.innerWidth < 1024 ? 800 : window.innerWidth < 1536 ? 1200 : 1600}
                />
            </div>

        </div>
    );
};

export default Gallery;
