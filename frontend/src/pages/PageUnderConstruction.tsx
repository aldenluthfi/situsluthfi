import SlidingTitle from '../components/custom/sliding-title';

const PageUnderConstruction: React.FC = () => {
    return (
        <div className='flex flex-col min-h-screen items-center overflow-clip'>
            <div className="flex flex-col w-full justify-center items-center space-y-6 my-32 ultrawide:my-48">
                <p className="text-lg tablet:text-2xl ultrawide:text-4xl text-center mb-6">
                    This page is currently <span className="text-primary font-bold">under construction</span>, <span />
                    <br className="ultrawide:hidden" />
                    or in other words,
                </p>
                <SlidingTitle text="Lorem · Ipsum · Dolor · Sit · Amet · Consectetur · Adipiscing · Elit" />
                <p className="text-lg tablet:text-2xl ultrawide:text-4xl text-center mt-6">
                    Please <span className="text-primary font-bold">check back</span> later
                    <br className="ultrawide:hidden" />
                    after a conspicuous, forced commit or two.
                </p>
            </div>
        </div>
    );
};

export default PageUnderConstruction;
