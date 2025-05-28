
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, Users, BarChart3, Shield, Zap, Globe, CheckCircle, Star, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatKES, convertUSDToKES } from "@/utils/currency";

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleStartFreeTrial = () => {
    navigate("/register");
  };

  const handleWatchDemo = () => {
    // In a real app, this would open a demo video
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
  };

  const handleGetStarted = (plan: string) => {
    localStorage.setItem("selectedPlan", plan);
    navigate("/register");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: Briefcase,
      title: "Project Management",
      description: "Organize and track projects with powerful tools and intuitive workflows."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and communication."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Get insights into your team's performance with detailed analytics."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with advanced permissions and compliance."
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate repetitive tasks and focus on what matters most."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your projects from anywhere with our cloud-based platform."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechCorp",
      content: "ProjectHub has transformed how we manage our projects. The Kanban boards are incredibly intuitive.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "CTO at StartupXYZ",
      content: "The GitHub integration saves us hours every week. Highly recommended for development teams.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Director",
      content: "Finally, a project management tool that our entire team actually enjoys using.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      originalPrice: 29,
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 team members",
        "10 projects",
        "Basic reporting",
        "Email support",
        "5GB storage"
      ],
      popular: false
    },
    {
      name: "Pro",
      originalPrice: 79,
      description: "Best for growing teams and businesses",
      features: [
        "Up to 25 team members",
        "Unlimited projects",
        "Advanced reporting & analytics",
        "Priority support",
        "50GB storage",
        "GitHub integration",
        "Custom workflows"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      originalPrice: 199,
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced security & compliance",
        "Dedicated support manager",
        "500GB storage",
        "API access",
        "Custom integrations",
        "SSO authentication"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ProjectHub</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
              <Button onClick={handleStartFreeTrial}>Start Free Trial</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Projects Like a Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate project management platform for teams who want to work smarter, 
            not harder. With powerful integrations and intuitive design.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleStartFreeTrial}>
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={handleWatchDemo}>
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From project planning to team collaboration, we've got all the tools 
              your team needs to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-gray-600">See what our customers have to say about ProjectHub</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-600">Choose the plan that fits your team size and needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`border-gray-200 relative ${
                plan.popular ? "border-blue-500 shadow-lg" : ""
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatKES(convertUSDToKES(plan.originalPrice))}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    onClick={() => handleGetStarted(plan.name)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of teams who have improved their productivity with ProjectHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-sm bg-white"
            />
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleStartFreeTrial}
            >
              Start Free Trial
            </Button>
          </div>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ProjectHub</span>
              </div>
              <p className="text-gray-400">
                The modern project management platform for teams who want to work smarter.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><button onClick={handleWatchDemo} className="hover:text-white">Demo</button></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
