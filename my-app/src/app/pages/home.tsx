'use client';

import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Benefits } from "../components/Benefits";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}