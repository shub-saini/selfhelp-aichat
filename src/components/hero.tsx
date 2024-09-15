"use client";
import React from "react";
import { Spotlight } from "@/components/ui/Spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import MagicButton from "@/components/ui/magic-button";

function Hero() {
  return (
    <div className="pb-20 pt-36 h-screen w-full">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="orange" />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
      </div>

      <div className="flex justify-center relative mt-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-black dark:text-blue-100 max-w-80">
            Feel Better, Live Better, Be Better
          </h2>
        </div>
      </div>

      <div className="flex justify-center">
        <TextGenerateEffect
          words="Your Journey to Self Discovery Starts Here"
          className="text-center text-[40px] md:text-5xl lg:text-6xl uppercase mb-6 lg:max-w-5xl"
        />
      </div>

      <div className="text-center md:tracking-wider mb-8">
        Small Steps, Big Changes
      </div>

      <div className="flex justify-center">
        <MagicButton href="/new" content="Explore Platform" />
      </div>
    </div>
  );
}

export default Hero;
