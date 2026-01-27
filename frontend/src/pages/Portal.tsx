import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Download,
  ExternalLink,
  Shield
} from "lucide-react";

export default function Portal() {
  const [ticketMessage, setTicketMessage] = useState("");
  const { toast } = useToast();

  const projects = [
    {
      name: "Cold Email Engine",
      status: "Live",
      progress: 100,
      statusColor: "bg-green-500",
      nextMilestone: "Performance review scheduled",
      metrics: {
        leads: "+285%",
        time: "20hrs saved/week",
        roi: "650%"
      }
    },
    {
      name: "AI Support Assistant",
      status: "Testing",
      progress: 85,
      statusColor: "bg-yellow-500",
      nextMilestone: "Final testing phase",
      metrics: {
        deflection: "65%",
        response: "2.5x faster",
        satisfaction: "+40%"
      }
    },
    {
      name: "Invoice Processing Bot",
      status: "Development",
      progress: 60,
      statusColor: "bg-blue-500",
      nextMilestone: "Integration testing next week",
      metrics: {
        speed: "90% faster",
        accuracy: "99.2%",
        processing: "15min → 2min"
      }
    }
  ];

  const tickets = [
    {
      id: "TK-001",
      title: "Email templates need A/B testing",
      status: "Open",
      priority: "Medium",
      created: "2 days ago"
    },
    {
      id: "TK-002", 
      title: "Integration with Salesforce CRM",
      status: "In Progress",
      priority: "High",
      created: "5 days ago"
    },
    {
      id: "TK-003",
      title: "Performance optimization request",
      status: "Resolved",
      priority: "Low",
      created: "1 week ago"
    }
  ];

  const files = [
    {
      name: "Q4 Performance Report.pdf",
      size: "2.4 MB",
      type: "Report",
      date: "Dec 15, 2024"
    },
    {
      name: "Integration Guide.docx",
      size: "1.1 MB", 
      type: "Documentation",
      date: "Dec 10, 2024"
    },
    {
      name: "Training Materials.zip",
      size: "5.7 MB",
      type: "Training",
      date: "Dec 5, 2024"
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ticket created",
      description: "We'll respond within 24 hours.",
    });
    setTicketMessage("");
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Sarah</h1>
              <p className="text-muted-foreground">
                Manage your AI automations and track performance metrics.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Link>
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="hero">
                <Calendar className="w-4 h-4 mr-2" />
                Book Sync
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                  <p className="text-2xl font-bold">43hrs</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-2xl font-bold">580%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tickets">Support</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>
                  Track the progress of your automation implementations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-border rounded-xl p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{project.name}</h3>
                          <p className="text-muted-foreground">{project.nextMilestone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${project.statusColor}`}></div>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-bold text-gradient">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Ticket */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <CardDescription>
                    Get help with your automations or request changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Brief description of your request" required />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Provide details about your issue or request..."
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    <Button type="submit" variant="hero" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Tickets */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Your Tickets</CardTitle>
                  <CardDescription>
                    Track your support requests and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium">{ticket.title}</div>
                            <div className="text-sm text-muted-foreground">{ticket.id}</div>
                          </div>
                          <Badge variant={ticket.status === "Resolved" ? "default" : "secondary"}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{ticket.created}</span>
                          <Badge variant="outline" className="text-xs">
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Project Files & Documentation</CardTitle>
                <CardDescription>
                  Access your project deliverables, reports, and training materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {file.type} • {file.size} • {file.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Detailed metrics and insights from your AI automations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive performance metrics and ROI tracking coming soon.
                  </p>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Analytics Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
