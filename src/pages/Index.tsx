import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Brain, Upload, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Tukey</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            {/* Signup link commented out */}
            {/* <Link to="/signup">
              <Button size="sm" className="rounded-full px-5">Get Started</Button>
            </Link> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Decision Intelligence
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Smarter decisions for your retail business
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Upload your POS data, get instant AI insights, and make data-driven decisions that boost your revenue.
          </p>
          <div className="flex justify-center gap-4">
            {/* Signup link commented out */}
            {/* <Link to="/signup">
              <Button size="lg" className="rounded-full px-8">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link> */}
            <Link to="/login">
              <Button size="lg" className="rounded-full px-8">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Tukey</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Tukey is an AI-powered decision intelligence platform designed for retail businesses. 
            We help store owners and managers make faster, smarter decisions by analyzing POS data 
            and providing actionable insights in plain English.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Named after the statistician John Tukey, our platform combines predictive analytics 
            with conversational AI to answer your business questions instantly — from demand 
            forecasting to inventory optimization.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Upload className="w-5 h-5" />}
              title="Upload Data"
              description="Drag and drop your POS data in CSV or JSON format."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Get Analytics"
              description="View forecasts, trends, and performance metrics instantly."
            />
            <FeatureCard
              icon={<Brain className="w-5 h-5" />}
              title="Ask AI"
              description="Ask questions in plain English and get actionable decisions."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-primary rounded-2xl p-10 text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
            <p className="opacity-90 mb-6">
              Join retailers using Tukey to make better business decisions.
            </p>
            {/* Signup link commented out */}
            {/* <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8">
                Get Started for Free
              </Button>
            </Link> */}
            <Link to="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Tukey</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 Tukey</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Index;
