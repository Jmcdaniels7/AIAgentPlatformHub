import { Bot, TrendingUp, Shield, Zap, BarChart3, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "Intelligent AI Agents",
    description: "Advanced AI agents that learn and adapt to your logistics workflows, providing intelligent automation and decision support.",
  },
  {
    icon: TrendingUp,
    title: "Route Optimization",
    description: "Optimize delivery routes in real-time using AI algorithms to reduce costs and improve delivery times.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Proactive risk assessment and mitigation strategies powered by predictive analytics and machine learning.",
  },
  {
    icon: Zap,
    title: "Real-time Operations",
    description: "Monitor and manage your entire logistics operation in real-time with instant updates and alerts.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into your operations with comprehensive dashboards and customizable reports.",
  },
  {
    icon: Clock,
    title: "24/7 Automation",
    description: "Round-the-clock automated task handling ensuring your logistics never sleep.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Powerful Features for Modern Logistics
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your logistics operations and scale your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-gray-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
