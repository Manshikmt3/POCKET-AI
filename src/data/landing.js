import { 
  BarChart3, 
  Receipt, 
  PieChart, 
  CreditCard, 
  Globe, 
  Zap 
} from "lucide-react";

export const statsData = [
  { label: "Active Users", value: "50K+" },
  { label: "Transactions Tracked", value: "$2B+" },
  { label: "Uptime", value: "99.9%" },
  { label: "User Rating", value: "4.9/5" },
];

export const featuresData = [
  {
    title: "Advanced Analytics",
    description: "Get detailed insights into your spending patterns with AI-powered analytics",
    icon: BarChart3,
  },
  {
    title: "Smart Receipt Scanner",
    description: "Extract data automatically from receipts using advanced AI technology",
    icon: Receipt,
  },
  {
    title: "Budget Planning",
    description: "Create and manage budgets with intelligent recommendations",
    icon: PieChart,
  },
  {
    title: "Multi-Account Support",
    description: "Manage multiple accounts and credit cards in one place",
    icon: CreditCard,
  },
  {
    title: "Multi-Currency",
    description: "Support for multiple currencies with real-time conversion",
    icon: Globe,
  },
  {
    title: "Automated Insights",
    description: "Get automated financial insights and recommendations",
    icon: Zap,
  },
];

export const howItWorksData = [
  {
    step: "1. Create Your Account",
    description: "Get started in minutes with our simple and secure sign-up process",
    icon: CreditCard,
  },
  {
    step: "2. Track Your Spending",
    description: "Automatically categorize and track your transactions in real-time",
    icon: BarChart3,
  },
  {
    step: "3. Get Insights",
    description: "Receive AI-powered insights and recommendations to optimize your finances",
    icon: PieChart,
  },
];

export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://i.pravatar.cc/150?u=sarah",
    content: "Pocket AI has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: "https://i.pravatar.cc/150?u=michael",
    content: "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: "https://i.pravatar.cc/150?u=emily",
    content: "I recommend Pocket AI to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.",
  },
];
