"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Collapse, Carousel } from "antd";
import { CheckCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
// import { ModelConfig } from "@/types/chat";
import { CharacterListResponse } from "@/types/character-list";

// const { Panel } = Collapse;

const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      title: "Log In With Your Email",
      description:
        "Use an email account you can access in case of customer support queries",
    },
    {
      step: "2",
      title: "Choose A Companion and the Scenario",
      description:
        "Select from our diverse range of personalities and scenarios",
    },
    {
      step: "3",
      title: "Start Chatting",
      description:
        "Begin your conversation immediately. Replay by clearing chat history",
    },
  ];

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#F8BBD0]">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center h-full"
            >
              {/* Step Number Circle */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F8BBD0] text-black font-bold text-xl flex items-center justify-center">
                  {step.step}
                </div>
              </div>

              {/* Content Container - Now centered with consistent heights */}
              <div className="flex flex-col w-full">
                {/* Title - Fixed height for alignment */}
                <div className="mb-2 min-h-[4rem] flex items-start justify-center">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>

                {/* Description - Fixed height for alignment */}
                <div className="min-h-[5rem] flex items-start justify-center">
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-xl text-[#F8BBD0]">
          No waiting lists - instant access for ISC users
        </p>
      </div>
    </section>
  );
};

const HeroSection = ({ onGetAccess }: { onGetAccess: () => void }) => {
  return (
    <section
      className="relative h-[45vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/isc.png')`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-[#F8BBD0]">Exclusive for ISC Users</span>
          <br />
          Early Access to AI Playmates
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Transform your chat experience with exciting AI companions
        </p>
        <Button
          type="primary"
          size="large"
          onClick={onGetAccess}
          className="text-lg h-12 px-8"
        >
          Get Free Early Access
        </Button>
      </div>
    </section>
  );
};

const ModelsCarousel = () => {
  const [characters, setCharacters] = useState<CharacterListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch("/api/listCharacters");
        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }
        const data = await response.json();
        setCharacters(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load characters"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#F8BBD0]">
            Our Playmates
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F8BBD0]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#F8BBD0]">
            Our Playmates
          </h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#F8BBD0]">
          Our Playmates
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Discover AI companions tailored to your unique needs and preferences.
        </p>

        <div className="max-w-6xl mx-auto px-4">
          <Carousel {...carouselSettings}>
            {characters.map((character) => (
              <div key={character.id} className="px-2">
                <Card
                  className="bg-[#1a1a1a] border-none hover:scale-105 transition-all duration-300 cursor-pointer mx-2"
                  cover={
                    <div className="relative pt-[133.33%]">
                      <img
                        alt={`${character.name} profile`}
                        src={character.profilePicture}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                  }
                >
                  <h3 className="text-xl font-bold mb-2 text-[#F8BBD0]">
                    {character.name}
                  </h3>
                  <p className="text-gray-400 line-clamp-2">
                    {character.displayDescription}
                  </p>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

const ValuePropositionSection = () => {
  const benefits = [
    {
      title: "Enhanced Conversations",
      description: "From peer-to-peer to AI-enhanced conversations",
    },
    {
      title: "Always Available",
      description: "Available 24/7 - never wait for responses",
    },
    {
      title: "Personalized Experience",
      description: "Personalized interactions based on your interests",
    },
    {
      title: "Private & Secure",
      description: "Private, secure, and judgment-free conversations",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#F8BBD0]">
          Why We Think You Will Love It
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-[#1a1a1a] border-none"
              styles={{ body: { padding: "2rem" } }}
            >
              <CheckCircleOutlined className="text-[#F8BBD0] text-2xl mb-4" />
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#F8BBD0]">
        Frequently Asked Questions
      </h2>
      <Collapse
        className="max-w-2xl mx-auto bg-[#1a1a1a] border-none"
        expandIconPosition="end"
        items={[
          {
            key: "1",
            label: "How is this different from ISC?",
            children: (
              <p>
                While ISC connects you with other users, AI Playmates provides
                intelligent AI companions available 24/7 for conversation,
                offering a complementary experience to your existing ISC
                interactions.
              </p>
            ),
          },
          {
            key: "2",
            label: "Will this replace my ISC experience?",
            children: (
              <p>
                Not at all! AI Playmates is designed to complement your ISC
                experience, not replace it. You can use both platforms based on
                your needs and preferences.
              </p>
            ),
          },
          {
            key: "3",
            label: "Is my ISC data private?",
            children: (
              <p>
                Absolutely. We maintain strict privacy standards. Your email is
                only used for authentication. Your conversations with AI
                Playmates are completely private and separate from your ISC
                activity.
              </p>
            ),
          },
          {
            key: "4",
            label: "How long is the early access period?",
            children: (
              <p>
                The early access period for ISC users will last for 3 months,
                giving you plenty of time to explore and enjoy all premium
                features completely free.
              </p>
            ),
          },
        ]}
      />
    </div>
  </section>
);

export default function LandingPage() {
  const router = useRouter();

  const handleGetAccess = () => {
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">
      <HeroSection onGetAccess={handleGetAccess} />
      <ModelsCarousel />
      <ValuePropositionSection />
      <HowItWorksSection />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#F8BBD0]">
            Exclusive for ISC Users
          </h2>
          <div className="bg-[#1a1a1a] p-8 rounded-lg max-w-2xl mx-auto">
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircleOutlined className="text-[#F8BBD0] mt-1 mr-2" />
                <span>Early access to all premium AI companions</span>
              </li>
              <li className="flex items-start">
                <CheckCircleOutlined className="text-[#F8BBD0] mt-1 mr-2" />
                <span>
                  Unlimited conversations during the early access period
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleOutlined className="text-[#F8BBD0] mt-1 mr-2" />
                <span>Priority access to new features and companions</span>
              </li>
              <li className="flex items-start">
                <CheckCircleOutlined className="text-[#F8BBD0] mt-1 mr-2" />
                <span>Exclusive ISC user feedback program participation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Meet Your AI Playmate?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start enjoying on-demand, intelligent conversations.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleGetAccess}
            className="text-lg h-12 px-8"
            icon={<ArrowRightOutlined />}
          >
            Sign Up for Free
          </Button>
        </div>
      </section>
      <FAQSection />
    </div>
  );
}
