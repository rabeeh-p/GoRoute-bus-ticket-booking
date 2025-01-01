import React from 'react';
import { Shield, Clock, Headphones, Award } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Booking",
      description: "Safe and secure payment options"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Service",
      description: "Round the clock customer support"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Instant Support",
      description: "Quick response to your queries"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Best Prices",
      description: "Guaranteed best fares"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 py-12">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-600 mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;