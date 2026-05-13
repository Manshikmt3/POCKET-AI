"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-20 pb-32 px-4 relative overflow-hidden">
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-4 gradient-title leading-[1.1] tracking-tighter">
          Manage Your Finances <br /> with Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>

        <div className="flex justify-center space-x-4 relative z-20">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 h-12 bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 transition-all hover:-translate-y-1 rounded-lg text-base font-bold">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-20">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner-hero.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
