import SlidingTitle from '../components/custom/sliding-title';
import Squiggle from '../components/custom/squiggle';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoscroll from "embla-carousel-auto-scroll"

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen items-center overflow-clip no-scrollbar">
      <div className="flex flex-col w-full justify-center items-center space-y-6 my-32 ultrawide:my-48">
        <p className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center">
          Hello! my name is <span className="text-primary font-body-bold">Luthfi</span>, <span />
          <br className="ultrawide:hidden" />
          but you can call me <span className="text-primary font-body-bold">Upi</span>,
          I'm a
        </p>
        <SlidingTitle
          text="Humanitarian Activist · College Student · Teaching Assistant · Graphic Designer"
        />
        <p
          className="font-body text-lg tablet:text-2xl ultrawide:text-4xl text-center">
          This site is made <span className="text-primary font-body-bold">as is</span> without <span />
          <br className="ultrawide:hidden" />
          warranty of any kind.
        </p>
      </div>

      <div className="flex flex-col -space-y-10">
        <Squiggle className="w-full fill-primary -z-10" />

        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoscroll({
              direction: "backward",
              stopOnInteraction: false,
              stopOnFocusIn: false,
              stopOnMouseEnter: false,
              speed: 2,
              startDelay: 0,
            }),
          ]}
          className='bg-primary'
        >
          <CarouselContent className="py-10">
            {
              Array(2).fill(0).flatMap(() => ([
                { src: "../src/assets/images/solo.png", alt: "Solo" },
                { src: "../src/assets/images/holeboys.png", alt: "Hole Boys" },
                { src: "../src/assets/images/medprop.png", alt: "Media and Propaganda" },
              ])).map((image, index) => (
                <CarouselItem key={index + 1} className="tablet:basis-1/3 z-20">
                  <div className='px-10 tablet:px-5 overflow-visible'>
                    <img src={image.src} alt={image.alt} className="hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-bouncier motion-duration-300 rounded-xl w-full" />
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
        </Carousel>

        <Squiggle className="-scale-y-100 w-full fill-primary -z-10" />
      </div>
    </div>
  );
};

export default Home;
