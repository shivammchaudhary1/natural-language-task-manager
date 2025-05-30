import React from "react";
import { Link } from "react-router-dom";
import { Brain, FileText, CheckCircle, Zap, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PublicLayout from "@/components/PublicLayout";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Parsing",
      description:
        "Transform natural language into organized tasks using advanced AI technology.",
    },
    {
      icon: FileText,
      title: "File Upload Support",
      description:
        "Upload text files, meeting notes, or documents to extract tasks automatically.",
    },
    {
      icon: CheckCircle,
      title: "Smart Task Management",
      description:
        "Automatically detect priorities, deadlines, and assignees from your text.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Instant task creation and updates with confidence scoring for accuracy.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Assign tasks to team members mentioned in your natural language input.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and encryption.",
    },
  ];

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-sage via-sage/90 to-sage/80">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {" "}
            <h1 className="text-5xl md:text-6xl font-bold text-midnight-blue mb-6">
              Transform Your Words Into
              <span className="text-teal block">Organized Tasks</span>
              <span className="text-lg md:text-xl font-normal text-burgundy bg-burgundy/10 px-4 py-2 rounded-full inline-block mt-4">
                🤖 AI-Powered by Google Gemini
              </span>
            </h1>
            <p className="text-xl text-midnight-blue/80 mb-8 max-w-2xl mx-auto">
              The world&apos;s first{" "}
              <strong>AI-Powered Natural Language Task Manager</strong> using
              <span className="text-teal font-semibold">
                {" "}
                Google Gemini API
              </span>
              . Simply type or upload your thoughts, and watch our intelligent
              AI transform them into perfectly organized, actionable tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-white px-8 py-3 text-lg"
                >
                  Start Creating Tasks
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal text-teal hover:bg-teal/10 px-8 py-3 text-lg"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight-blue mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-midnight-blue/70 max-w-2xl mx-auto">
              Everything you need to turn unstructured text into perfectly
              organized tasks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-teal/20 hover:border-teal/40 transition-colors shadow-lg"
              >
                <CardHeader>
                  <div className="p-3 bg-teal/10 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-teal" />
                  </div>
                  <CardTitle className="text-midnight-blue">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-midnight-blue/70 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="container mx-auto px-4 py-20 bg-white/50"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight-blue mb-4">
              How It Works
            </h2>
            <p className="text-xl text-midnight-blue/70 max-w-2xl mx-auto">
              From natural language to organized tasks in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-teal/10 rounded-full w-fit mx-auto mb-4">
                <span className="text-2xl font-bold text-teal">1</span>
              </div>
              <h3 className="text-xl font-semibold text-midnight-blue mb-2">
                Input Your Text
              </h3>
              <p className="text-midnight-blue/70">
                Type naturally or upload documents with your tasks and ideas
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-teal/10 rounded-full w-fit mx-auto mb-4">
                <span className="text-2xl font-bold text-teal">2</span>
              </div>
              <h3 className="text-xl font-semibold text-midnight-blue mb-2">
                AI Processing
              </h3>
              <p className="text-midnight-blue/70">
                Our AI analyzes and extracts tasks, priorities, and deadlines
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-teal/10 rounded-full w-fit mx-auto mb-4">
                <span className="text-2xl font-bold text-teal">3</span>
              </div>
              <h3 className="text-xl font-semibold text-midnight-blue mb-2">
                Organized Results
              </h3>
              <p className="text-midnight-blue/70">
                Get perfectly structured tasks ready for your workflow
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="border-2 border-teal/20 bg-gradient-to-r from-teal/5 to-teal/10">
            <CardContent className="text-center py-16">
              <h3 className="text-3xl font-bold text-midnight-blue mb-4">
                Ready to Transform Your Workflow?
              </h3>
              <p className="text-xl text-midnight-blue/70 mb-8 max-w-2xl mx-auto">
                Join thousands of teams already using AI to streamline their
                task management
              </p>
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-white px-8 py-3 text-lg"
                >
                  Start Your Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Home;
