import React from 'react';
import { Carousel, Button } from 'antd';
import Link from 'next/link';

const HeroCarousel: React.FC = () => {
  const carouselItems = [
    {
      image: "/placeholder.svg?height=500&width=1200",
      title: "Discover Your Perfect AI Companion",
      description: "Explore our diverse collection of AI models designed to enhance your experience",
      cta: "Get Started",
      link: "/products"
    },
    {
      image: "/placeholder.svg?height=500&width=1200",
      title: "Personalized Interactions",
      description: "Experience meaningful conversations tailored to your needs",
      cta: "Learn More",
      link: "/about"
    },
    {
      image: "/placeholder.svg?height=500&width=1200",
      title: "Join Our Community",
      description: "Connect with others and share your AI journey",
      cta: "Join Now",
      link: "/signup"
    }
  ];

  return (
    <Carousel autoplay className="bg-[#0a0a0a]">
      {carouselItems.map((item, index) => (
        <div key={index} className="relative">
          <img 
            src={item.image} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-[500px] object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {item.title}
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              {item.description}
            </p>
            <Link href={item.link}>
              <Button type="primary" size="large" className="text-lg px-8 h-12">
                {item.cta}
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;