
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Briefcase, 
  Users, 
  Target, 
  Award,
  ArrowRight,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

const About = () => {
  const stats = [
    { label: "Companies", value: "500+", description: "Trust ProjectHub" },
    { label: "Projects", value: "10,000+", description: "Managed successfully" },
    { label: "Users", value: "50,000+", description: "Active monthly users" },
    { label: "Countries", value: "80+", description: "Worldwide presence" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image: "/avatars/sarah.jpg",
      bio: "Former VP of Engineering at tech unicorn. 15+ years building scalable products.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      image: "/avatars/michael.jpg",
      bio: "Ex-Google engineer with expertise in distributed systems and product architecture.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Emily Davis",
      role: "Head of Design",
      image: "/avatars/emily.jpg",
      bio: "Design leader who previously shaped user experience at leading design agencies.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "David Kim",
      role: "VP of Engineering",
      image: "/avatars/david.jpg",
      bio: "Full-stack engineer with a passion for clean code and scalable architectures.",
      social: { twitter: "#", linkedin: "#", github: "#" }
    }
  ];

  const values = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team First",
      description: "We believe great products are built by great teams. Everything we do is designed to help teams collaborate better and achieve more together."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Simplicity",
      description: "Complex problems don't require complex solutions. We focus on creating intuitive, powerful tools that just work."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "We set high standards for ourselves and our product. Every feature is crafted with attention to detail and user experience."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ProjectHub</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link to="/billing-landing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" className="border-gray-300">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About ProjectHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to help teams work better together. ProjectHub was born from the 
            frustration of using complicated project management tools that got in the way of actual work.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-gray-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                ProjectHub started in 2022 when our founders, Sarah and Michael, were leading 
                engineering teams at fast-growing tech companies. They noticed that existing 
                project management tools were either too simple or overwhelmingly complex.
              </p>
              <p className="mb-6">
                After countless hours spent in meetings trying to figure out project status, 
                they decided there had to be a better way. They wanted something that would 
                give teams clarity without the overhead.
              </p>
              <p>
                Today, ProjectHub serves over 500 companies worldwide, from startups to 
                Fortune 500 enterprises. We're proud to help teams ship better products 
                faster while maintaining work-life balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-gray-200 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a diverse team of builders, designers, and problem-solvers united by our 
              passion for creating tools that help teams succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-blue-600 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-500">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={member.social.github} className="text-gray-400 hover:text-gray-900">
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
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
            Ready to join thousands of teams?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Start your free trial today and see why teams choose ProjectHub for their project management needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                Contact Sales
              </Button>
            </Link>
          </div>
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
                The modern project management platform for teams that want to get things done.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/billing-landing" className="hover:text-white">Pricing</Link></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
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

export default About;
