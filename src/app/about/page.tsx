"use client";

import Link from "next/link";
// import AppHeader from '@/components/Header';
import AppFooter from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f10]">
      {/* <AppHeader /> */}

      {/* Hero Section */}
      <section className="w-full bg-[#0a0a0a] py-16">
        <div className="w-full px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F8BBD0] mb-4">
            About Us
          </h1>
          <p className="text-gray-400 text-lg">
            AI Playmate is a generative AI platform that allows users to create
            and interact generated characters for role playing purposes. Users
            can choose from a selection of pre-generated characters and
            scenarios or create their own character and scenarios.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow w-full px-4 py-12">
        {/* Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#F8BBD0] mb-6">Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Card Template */}
            <div className="bg-[#0a0a0a] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#F8BBD0] mb-4">
                Terms of Service
              </h3>
              <p className="text-gray-400">
                Our terms of service can be found{" "}
                <Link href="/tos" className="text-[#F8BBD0] hover:underline">
                  here
                </Link>
                .
              </p>
            </div>
            {/* Add more cards as needed */}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-3xl font-bold text-[#F8BBD0] mb-6">
            Get in Touch
          </h2>
          <div className="bg-[#0a0a0a] rounded-lg p-8">
            <p className="text-gray-400 mb-6">
              Interested in learning more about our company? We'd love to hear
              from you.
            </p>
            <p>
              <Link
                href="https://forms.gle/LeWyLCdyVfrrMzFM6"
                className="text-[#F8BBD0] hover:underline"
              >
                Contact Us
              </Link>
            </p>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
