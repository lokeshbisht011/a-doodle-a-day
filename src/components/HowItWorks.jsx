import { Card } from '@/components/ui/card';
import { Calendar, Palette, Users, Trophy } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Get a Daily Prompt",
      description: "Receive a fresh, inspiring prompt to spark your imagination—no more staring at a blank page.",
      color: "text-purple-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Create Your Doodle",
      description: "Use our powerful in-app editor to bring your unique vision to life.",
      color: "text-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Share & Connect",
      description: "Upload your creation, get likes, and leave comments on doodles from around the world.",
      color: "text-blue-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Track Your Progress",
      description: "Build your creative streak, earn badges for milestones, and celebrate your journey with fellow artists.",
      color: "text-orange-500"
    }
  ];

  return (
    <section className="py-20 gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of artists in a simple, inspiring creative journey that fits into your daily routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className={`p-6 text-center hover-lift bg-white shadow-soft border-0 animate-fade-up`} style={{ animationDelay: `${index * 150}ms` }}>
              <div className="mb-4 flex justify-center">
                <div className={`${step.color} bg-white rounded-full p-3 shadow-medium`}>
                  {step.icon}
                </div>
              </div>
              <div className="mb-2 text-sm font-semibold text-primary uppercase tracking-wider">
                Step {index + 1}
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-soft">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-foreground">Join 50,000+ daily doodlers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;