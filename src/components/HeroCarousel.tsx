import React from "react";
import { Carousel, Button } from "antd";
import Link from "next/link";

const HeroCarousel: React.FC = () => {
  const carouselItems = [
    {
      image: "/early.png?height=400&width=1200",
      title: "AI Playmates Early Access",
      description:
        "Be one of the earliest users of AI Playmates, help us build the most engaging role playing platform",
      cta: "Start Today",
      link: "/chat",
    },
    {
      image: "/companion.png?height=400&width=1200",
      title: "Discover Your AI Companion",
      description:
        "Explore our diverse collection of AI models designed to enhance your role playing experience",
      cta: "Get Started",
      link: "/chat",
    },
    {
      image: "/personalize.png?height=400&width=1200",
      title: "Personalized Interactions",
      description: "Experience meaningful conversations tailored to your needs",
      cta: "Learn More",
      link: "/chat",
    },
  ];

  return (
    <div className="p-4">
      <Carousel autoplay className="bg-[#0a0a0a] rounded-xl overflow-hidden">
        {carouselItems.map((item, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden">
            <img
              src={item.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-[500px] object-cover opacity-70 rounded-xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {item.title}
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl">
                {item.description}
              </p>
              <Link href={item.link}>
                <Button
                  type="primary"
                  size="large"
                  className="text-lg px-8 h-12"
                >
                  {item.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
