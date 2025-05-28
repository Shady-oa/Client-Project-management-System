
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Check, CreditCard, Download, Calendar, Users, Zap } from "lucide-react";

const Billing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlan] = useState("Pro");

  const plans = [
    {
      name: "Starter",
      price: billingCycle === "monthly" ? 29 : 290,
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
      price: billingCycle === "monthly" ? 79 : 790,
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
      price: billingCycle === "monthly" ? 199 : 1990,
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

  const usage = {
    projects: { current: 8, limit: 25 },
    members: { current: 12, limit: 25 },
    storage: { current: 23, limit: 50 }
  };

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-05-01",
      amount: 79,
      status: "Paid",
      downloadUrl: "#"
    },
    {
      id: "INV-2024-002",
      date: "2024-04-01",
      amount: 79,
      status: "Paid",
      downloadUrl: "#"
    },
    {
      id: "INV-2024-003",
      date: "2024-03-01",
      amount: 79,
      status: "Paid",
      downloadUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
        </div>

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Plan */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl text-gray-900">Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentPlan}</h3>
                  <p className="text-gray-600">
                    ${billingCycle === "monthly" ? "79" : "790"} / {billingCycle === "monthly" ? "month" : "year"}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Next billing: June 1, 2024</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment method: •••• 4242</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="border-gray-300">
                  Update Payment Method
                </Button>
                <Button variant="outline" className="border-gray-300">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl text-gray-900">Usage This Month</CardTitle>
              <CardDescription>Current usage across your plan limits</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Projects</span>
                  <span className="text-sm text-gray-500">
                    {usage.projects.current} / {usage.projects.limit}
                  </span>
                </div>
                <Progress 
                  value={(usage.projects.current / usage.projects.limit) * 100} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Team Members</span>
                  <span className="text-sm text-gray-500">
                    {usage.members.current} / {usage.members.limit}
                  </span>
                </div>
                <Progress 
                  value={(usage.members.current / usage.members.limit) * 100} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Storage</span>
                  <span className="text-sm text-gray-500">
                    {usage.storage.current}GB / {usage.storage.limit}GB
                  </span>
                </div>
                <Progress 
                  value={(usage.storage.current / usage.storage.limit) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing Cycle Toggle */}
        <Card className="border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${billingCycle === "monthly" ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
              />
              <span className={`text-sm ${billingCycle === "yearly" ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                Yearly
              </span>
              {billingCycle === "yearly" && (
                <Badge className="bg-green-100 text-green-800 ml-2">Save 20%</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <Card className="border-gray-200 shadow-sm mb-8">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900">Available Plans</CardTitle>
            <CardDescription>Choose the plan that best fits your team's needs</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative rounded-lg border p-6 ${
                  plan.name === currentPlan 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 bg-white"
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  {plan.name === currentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-600 text-white">Current Plan</Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.name === currentPlan 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={plan.name === currentPlan}
                  >
                    {plan.name === currentPlan ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900">Billing History</CardTitle>
            <CardDescription>Download your invoices and payment history</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-6 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{invoice.id}</div>
                    <div className="text-sm text-gray-600">{invoice.date}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${invoice.amount}</div>
                      <Badge className={
                        invoice.status === "Paid" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }>
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
