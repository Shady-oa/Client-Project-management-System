
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Star, Shield, Zap, Users, Briefcase, ChevronRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const translations = {
    en: {
      hero: {
        title: "Transform Your Project Management",
        subtitle: "Streamline workflows, enhance collaboration, and deliver exceptional results with our intelligent project management platform.",
        cta: "Get Started Today"
      },
      features: {
        title: "Powerful Features for Modern Teams",
        cards: [
          {
            icon: Briefcase,
            title: "Smart Project Tracking",
            description: "AI-powered insights and real-time progress monitoring to keep your projects on track.",
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            icon: Users,
            title: "Team Collaboration",
            description: "Seamless communication tools and role-based access for efficient teamwork.",
            gradient: "from-emerald-500 to-teal-500"
          },
          {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-level security with advanced encryption and compliance standards.",
            gradient: "from-purple-500 to-pink-500"
          },
          {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized performance with instant loading and real-time synchronization.",
            gradient: "from-orange-500 to-red-500"
          }
        ]
      },
      pricing: {
        title: "Choose Your Plan",
        plans: [
          {
            name: "Starter",
            price: "$29",
            period: "/month",
            features: ["Up to 5 projects", "10 team members", "Basic analytics", "Email support"]
          },
          {
            name: "Professional",
            price: "$79",
            period: "/month",
            features: ["Unlimited projects", "50 team members", "Advanced analytics", "Priority support", "Custom integrations"]
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "",
            features: ["Unlimited everything", "Custom solutions", "Dedicated support", "On-premise option", "SLA guarantee"]
          }
        ]
      }
    },
    es: {
      hero: {
        title: "Transforma Tu Gestión de Proyectos",
        subtitle: "Optimiza flujos de trabajo, mejora la colaboración y entrega resultados excepcionales con nuestra plataforma inteligente.",
        cta: "Comenzar Hoy"
      },
      features: {
        title: "Características Poderosas para Equipos Modernos",
        cards: [
          {
            icon: Briefcase,
            title: "Seguimiento Inteligente",
            description: "Insights impulsados por IA y monitoreo en tiempo real para mantener tus proyectos en curso.",
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            icon: Users,
            title: "Colaboración en Equipo",
            description: "Herramientas de comunicación fluida y acceso basado en roles para trabajo eficiente.",
            gradient: "from-emerald-500 to-teal-500"
          },
          {
            icon: Shield,
            title: "Seguridad Empresarial",
            description: "Seguridad nivel bancario con encriptación avanzada y estándares de cumplimiento.",
            gradient: "from-purple-500 to-pink-500"
          },
          {
            icon: Zap,
            title: "Súper Rápido",
            description: "Rendimiento optimizado con carga instantánea y sincronización en tiempo real.",
            gradient: "from-orange-500 to-red-500"
          }
        ]
      },
      pricing: {
        title: "Elige Tu Plan",
        plans: [
          {
            name: "Inicial",
            price: "$29",
            period: "/mes",
            features: ["Hasta 5 proyectos", "10 miembros del equipo", "Análisis básico", "Soporte por email"]
          },
          {
            name: "Profesional",
            price: "$79",
            period: "/mes",
            features: ["Proyectos ilimitados", "50 miembros del equipo", "Análisis avanzado", "Soporte prioritario", "Integraciones personalizadas"]
          },
          {
            name: "Empresarial",
            price: "Personalizado",
            period: "",
            features: ["Todo ilimitado", "Soluciones personalizadas", "Soporte dedicado", "Opción local", "Garantía SLA"]
          }
        ]
      }
    },
    fr: {
      hero: {
        title: "Transformez Votre Gestion de Projet",
        subtitle: "Rationalisez les flux de travail, améliorez la collaboration et obtenez des résultats exceptionnels.",
        cta: "Commencer Aujourd'hui"
      },
      features: {
        title: "Fonctionnalités Puissantes pour Équipes Modernes",
        cards: [
          {
            icon: Briefcase,
            title: "Suivi Intelligent",
            description: "Insights alimentés par IA et surveillance en temps réel pour garder vos projets sur la bonne voie.",
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            icon: Users,
            title: "Collaboration d'Équipe",
            description: "Outils de communication fluides et accès basé sur les rôles pour un travail efficace.",
            gradient: "from-emerald-500 to-teal-500"
          },
          {
            icon: Shield,
            title: "Sécurité d'Entreprise",
            description: "Sécurité de niveau bancaire avec cryptage avancé et normes de conformité.",
            gradient: "from-purple-500 to-pink-500"
          },
          {
            icon: Zap,
            title: "Ultra Rapide",
            description: "Performance optimisée avec chargement instantané et synchronisation en temps réel.",
            gradient: "from-orange-500 to-red-500"
          }
        ]
      },
      pricing: {
        title: "Choisissez Votre Plan",
        plans: [
          {
            name: "Débutant",
            price: "$29",
            period: "/mois",
            features: ["Jusqu'à 5 projets", "10 membres d'équipe", "Analytiques de base", "Support email"]
          },
          {
            name: "Professionnel",
            price: "$79",
            period: "/mois",
            features: ["Projets illimités", "50 membres d'équipe", "Analytiques avancées", "Support prioritaire", "Intégrations personnalisées"]
          },
          {
            name: "Entreprise",
            price: "Personnalisé",
            period: "",
            features: ["Tout illimité", "Solutions personnalisées", "Support dédié", "Option sur site", "Garantie SLA"]
          }
        ]
      }
    }
  };

  const t = translations[selectedLanguage];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={selectedLanguage === lang.code ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLanguage(lang.code)}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <Globe className="w-4 h-4 mr-1" />
              {lang.flag} {lang.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white">Trusted by 10,000+ teams worldwide</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t.hero.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1">
                {t.hero.cta}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the tools that will revolutionize how your team works together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.cards.map((feature, index) => (
              <Card 
                key={index} 
                className="group border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-gray-300">
              Flexible plans that grow with your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.pricing.plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 ${
                  index === 1 ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20' : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  <Button 
                    className={`w-full mt-6 ${
                      index === 1 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    } text-white font-semibold py-3 rounded-full transition-all duration-300`}
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
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of teams already using our platform to deliver better results.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1">
              Start Your Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
