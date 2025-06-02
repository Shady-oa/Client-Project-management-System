
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, Users, BarChart3, Shield, Zap, Globe, CheckCircle, Star, ArrowRight, Award, Target, Rocket, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatKES, convertUSDToKES } from "@/utils/currency";

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleStartFreeTrial = () => {
    navigate("/register");
  };

  const handleWatchDemo = () => {
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
      description: "Organize and track projects with powerful tools and intuitive workflows that scale with your team.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates, instant communication, and shared workspaces.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into your team's performance with AI-powered analytics and predictive reporting.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with advanced permissions, compliance tools, and data encryption.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Automate repetitive tasks with AI-powered workflows and focus on what matters most.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your projects from anywhere with our cloud-based platform and mobile apps.",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const stats = [
    { icon: Award, number: "10K+", label: "Active Companies", gradient: "from-blue-500 to-purple-600" },
    { icon: Target, number: "500K+", label: "Projects Completed", gradient: "from-emerald-500 to-teal-600" },
    { icon: Users, number: "1M+", label: "Happy Users", gradient: "from-orange-500 to-red-600" },
    { icon: Clock, number: "99.9%", label: "Uptime", gradient: "from-purple-500 to-pink-600" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechCorp",
      content: "ProjectHub has completely transformed how we manage our projects. The Kanban boards and real-time collaboration features are game-changers.",
      rating: 5,
      avatar: "SJ",
      company: "TechCorp"
    },
    {
      name: "Michael Chen",
      role: "CTO at StartupXYZ",
      content: "The GitHub integration and automated workflows save us 20+ hours every week. It's like having an extra team member dedicated to efficiency.",
      rating: 5,
      avatar: "MC",
      company: "StartupXYZ"
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Director",
      content: "Finally, a project management tool that our entire team actually enjoys using. The interface is intuitive and the features are powerful.",
      rating: 5,
      avatar: "ER",
      company: "Global Dynamics"
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
        "5GB storage",
        "Mobile app access"
      ],
      popular: false,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Professional",
      originalPrice: 79,
      description: "Best for growing teams and businesses",
      features: [
        "Up to 25 team members",
        "Unlimited projects",
        "Advanced reporting & analytics",
        "Priority support",
        "50GB storage",
        "GitHub integration",
        "Custom workflows",
        "Time tracking",
        "API access"
      ],
      popular: true,
      gradient: "from-emerald-500 to-teal-600"
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
        "Full API access",
        "Custom integrations",
        "SSO authentication",
        "Advanced permissions",
        "White-label options"
      ],
      popular: false,
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ProjectHub
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Features</Link>
              <Link to="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Pricing</Link>
              <Link to="/about" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Contact</Link>
              <Button variant="outline" onClick={handleSignIn} className="border-emerald-200 hover:bg-emerald-50">
                Sign In
              </Button>
              <Button onClick={handleStartFreeTrial} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
              🚀 New: AI-Powered Project Insights Available Now
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Projects
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate project management platform for teams who want to work smarter, not harder. 
              With AI-powered insights, seamless integrations, and stunning design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleStartFreeTrial} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" onClick={handleWatchDemo} className="border-emerald-200 hover:bg-emerald-50 text-lg px-8 py-4">
                <Rocket className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ✨ No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
              🎯 Core Features
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From project planning to team collaboration, we've got all the tools 
              your team needs to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200">
              ⭐ Customer Stories
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-gray-600">See what our customers have to say about ProjectHub</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-emerald-600 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 border-emerald-200">
              💰 Transparent Pricing
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your team size and needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative ${
                plan.popular ? "ring-2 ring-emerald-400 scale-105" : ""
              } bg-white`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg">
                      🔥 Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatKES(convertUSDToKES(plan.originalPrice))}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg" 
                        : "bg-gray-900 hover:bg-gray-800"
                    } transition-all duration-300`}
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
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-emerald-100 mb-8 text-xl leading-relaxed">
            Join thousands of teams who have improved their productivity with ProjectHub.
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/90 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-500"
            />
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleStartFreeTrial}
              className="bg-white text-emerald-600 hover:bg-gray-50 shadow-lg whitespace-nowrap"
            >
              Start Free Trial
            </Button>
          </div>
          <p className="text-emerald-100 text-sm mt-6">
            ✨ No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ProjectHub</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The modern project management platform for teams who want to work smarter and achieve more.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">Features</Link></li>
                <li><button onClick={handleWatchDemo} className="hover:text-white transition-colors">Demo</button></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">API Reference</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 ProjectHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400">
              <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
