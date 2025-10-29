import React from "react";

interface SubtitleProps {
  title: string;
}

export default function Subtitle({ title }: SubtitleProps) {
  return (
    <div className="bg-gradient-to-b from-[#0d3b66] to-[#062440] py-50">
      <h1 className="text-white text-5xl font-semibold text-center">{title}</h1>
    </div>
  );
}