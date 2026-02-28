import { Rocket, Settings, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Rocket,
    title: "Quick Setup",
    description: "Get started in minutes with our intuitive onboarding process. No complex configurations required.",
  },
  {
    icon: Settings,
    title: "Configure AI Agents",
    description: "Customize AI agents to match your specific logistics workflows and business requirements.",
  },
  {
    icon: MessageSquare,
    title: "Interact & Monitor",
    description: "Chat with your AI agents and receive intelligent insights with real-time task creation.",
  },
  {
    icon: CheckCircle,
    title: "Optimize & Scale",
    description: "Continuously improve operations with AI-driven recommendations and scale effortlessly.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get up and running with our platform in four simple steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
