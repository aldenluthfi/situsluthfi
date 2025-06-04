import SlidingTitle from '../components/custom/sliding-title';

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
        </div>
    );
};

export default Gallery;
