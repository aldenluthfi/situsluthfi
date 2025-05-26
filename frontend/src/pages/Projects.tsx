import SlidingTitle from '../components/custom/sliding-title';

const Projects: React.FC = () => {
    return (
        <div className='flex flex-col min-h-screen items-center overflow-clip'>
            <div className="flex flex-col w-full justify-center items-center space-y-6 my-32 ultrawide:my-48">
            <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center mb-6">
                These are my <span className="text-primary font-body-bold">projects</span>
                <br className="ultrawide:hidden" />
                Here you can find a growing collection of
            </p>
            <SlidingTitle text="Algorithms · Frameworks · Languages · Experiments · Tech Stacks" />
            <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center">
                I explored in my journey as a developer
                <br className="ultrawide:hidden" />
                <span className="text-primary font-body-bold">stay tuned</span> for updates!
            </p>
            </div>
        </div>
    );
};

export default Projects;
