
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, CreditCard, Download, Calendar, Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

const Billing = () => {
  const [currentPlan] = useState("Professional");
  const [billingCycle] = useState("monthly");

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 team members",
        "10 projects",
        "Basic issue tracking",
        "Email support",
        "5GB storage"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "per month",
      description: "Most popular for growing businesses",
      features: [
        "Up to 25 team members",
        "Unlimited projects",
        "Advanced issue tracking",
        "Priority support",
        "50GB storage",
        "Custom workflows",
        "GitHub integration"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Enterprise issue tracking",
        "24/7 phone support",
        "500GB storage",
        "Custom integrations",
        "Advanced analytics",
        "SSO integration"
      ],
      recommended: false
    }
  ];

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-05-01",
      amount: "$79.00",
      status: "Paid",
      plan: "Professional",
      period: "May 2024"
    },
    {
      id: "INV-2024-002",
      date: "2024-04-01",
      amount: "$79.00",
      status: "Paid",
      plan: "Professional",
      period: "April 2024"
    },
    {
      id: "INV-2024-003",
      date: "2024-03-01",
      amount: "$79.00",
      status: "Paid",
      plan: "Professional",
      period: "March 2024"
    },
    {
      id: "INV-2024-004",
      date: "2024-02-01",
      amount: "$29.00",
      status: "Paid",
      plan: "Starter",
      period: "February 2024"
    }
  ];

  const usageStats = [
    { title: "Team Members", current: 18, limit: 25, unit: "users" },
    { title: "Projects", current: 12, limit: "unlimited", unit: "projects" },
    { title: "Storage Used", current: 32, limit: 50, unit: "GB" },
    { title: "API Calls", current: 15420, limit: 100000, unit: "calls" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payment">Payment Method</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Current Plan */}
            <Card className="border-blue-200 shadow-sm">
              <CardHeader className="bg-blue-50 border-b border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                      Current Plan: {currentPlan}
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </CardTitle>
                    <CardDescription>Your subscription is active and in good standing</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">$79.00</div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Next billing date</div>
                      <div className="text-sm text-gray-600">June 1, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Team members</div>
                      <div className="text-sm text-gray-600">18 of 25 used</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Plan since</div>
                      <div className="text-sm text-gray-600">March 1, 2024</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Usage Overview</CardTitle>
                <CardDescription>Current usage across your plan limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {usageStats.map((stat, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                        <span className="text-xs text-gray-500">
                          {stat.current} {stat.limit !== "unlimited" && `/ ${stat.limit}`} {stat.unit}
                        </span>
                      </div>
                      {stat.limit !== "unlimited" && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(stat.current / stat.limit) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Upgrade Plan</h3>
                  <p className="text-sm text-gray-600 mb-4">Get more features and higher limits</p>
                  <Button className="w-full">Upgrade Now</Button>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Download className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Download Invoice</h3>
                  <p className="text-sm text-gray-600 mb-4">Get your latest billing statement</p>
                  <Button variant="outline" className="w-full">Download PDF</Button>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Update Payment</h3>
                  <p className="text-sm text-gray-600 mb-4">Change your payment method</p>
                  <Button variant="outline" className="w-full">Update Card</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Select the perfect plan for your team's needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`border-gray-200 shadow-sm ${plan.recommended ? 'ring-2 ring-blue-500 border-blue-200' : ''}`}>
                  <CardHeader className="text-center pb-4">
                    {plan.recommended && (
                      <Badge className="w-fit mx-auto mb-3 bg-blue-100 text-blue-800">
                        Recommended
                      </Badge>
                    )}
                    <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.name === currentPlan ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                      disabled={plan.name === currentPlan}
                    >
                      {plan.name === currentPlan ? 'Current Plan' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Billing History</CardTitle>
                <CardDescription>Download and view your past invoices</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{invoice.id}</div>
                          <div className="text-sm text-gray-600">{invoice.plan} - {invoice.period}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{invoice.amount}</div>
                          <div className="text-sm text-gray-600">{invoice.date}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {invoice.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Method Tab */}
          <TabsContent value="payment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Payment Method */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Current Payment Method</CardTitle>
                  <CardDescription>Your primary payment method for subscriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/25</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Primary</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Add New Payment Method */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Add Payment Method</CardTitle>
                  <CardDescription>Add a backup payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Billing Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Billing Information</CardTitle>
                <CardDescription>Update your billing address and company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                    <Input id="taxId" placeholder="123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Business St" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" defaultValue="94102" />
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Update Billing Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;
