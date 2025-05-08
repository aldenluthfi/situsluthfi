import SlidingTitle from '../components/custom/sliding-title';
import Squiggle from '../components/custom/squiggle';
import Footer from '@/components/custom/footer';
import Header from '@/components/custom/header';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import Autoscroll from "embla-carousel-auto-scroll"
import { useState, useEffect } from 'react';

const ResponsiveTooltip = ({
  children,
  content
}: {
  children: React.ReactNode,
  content: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    if (isOpen) {
      timeoutId = window.setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    }
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onMouseDown={() => setIsOpen(true)}
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto text-sm tablet:text-md" hideWhenDetached>
        {content}
      </PopoverContent>
    </Popover>
  );
};

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen items-center overflow-clip">
      <Header />
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

      <div className="flex flex-col -space-y-5">
        <Squiggle className="w-full fill-primary-100 -z-10" />

        <Carousel
          opts={{
            loop: true,
            watchFocus: false,
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
          className='bg-primary-100'
        >
          <CarouselContent className="py-10">
            {
              Array(2).fill(0).flatMap(() => ([
                { src: "../src/assets/images/solo.png", alt: "Solo", tooltip: "This is me, Hi!" },
                { src: "../src/assets/images/holeboys.png", alt: "Hole Boys", tooltip: "Just some boys coming out from a hole on the wall" },
                { src: "../src/assets/images/weirdos.png", alt: "Weirdos", tooltip: "Weirdos being weird" },
                { src: "../src/assets/images/medprop.png", alt: "Media and Propaganda", tooltip: "Media and Propaganda team, loud and clear!" },
              ])).map((image, index) => (
                <CarouselItem key={index + 1} className="max-w-11/12 tablet:basis-1/2">
                  <ResponsiveTooltip content={<p>{image.tooltip}</p>}>
                    <div className='px-3 tablet:px-5 overflow-visible'>
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="hover:motion-scale-out-105 motion-scale-in-105 motion-ease-spring-bouncier motion-duration-300 rounded-xl w-full"
                      />
                    </div>
                  </ResponsiveTooltip>
                </CarouselItem>
              ))
            }
          </CarouselContent>
        </Carousel>

        <Squiggle className="-scale-y-100 w-full fill-primary-100 -z-10" />
      </div>

      <div className='h-screen'></div>

      <Footer />
    </div>
  );
};

export default Home;
