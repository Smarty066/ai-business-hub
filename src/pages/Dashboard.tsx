import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Megaphone,
  Calendar,
  Wallet,
  TrendingUp,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const stats = [
  { label: "Content Generated", value: "247", change: "+12%", icon: FileText },
  { label: "Bookings This Week", value: "34", change: "+8%", icon: Calendar },
  { label: "Savings Rate", value: "23%", change: "+5%", icon: TrendingUp },
  { label: "Active Clients", value: "156", change: "+18%", icon: Users },
];

const quickActions = [
  {
    title: "Generate Marketing Content",
    description: "Create sales copy, ads, and emails",
    icon: Megaphone,
    href: "/marketing",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Manage Bookings",
    description: "View and manage appointments",
    icon: Calendar,
    href: "/booking",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Track Finances",
    description: "Monitor income and expenses",
    icon: Wallet,
    href: "/budget",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's an overview of your productivity suite.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className="glass-strong border-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium text-success">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={action.title} 
              className="glass-strong border-0 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.05}s` }}
            >
              <Link to={action.href}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bgColor}`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Tip Card */}
      <Card className="glass-strong border-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">AI Productivity Tip</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your marketing content performs 23% better when generated during morning hours.
                Consider scheduling your content creation for optimal engagement.
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
