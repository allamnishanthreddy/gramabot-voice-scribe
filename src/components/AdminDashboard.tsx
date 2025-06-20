
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, MessageSquare, Clock, CheckCircle, AlertTriangle, BarChart3, Settings } from "lucide-react";

const AdminDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState([
    {
      title: "Total Users",
      value: "25,847",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "blue",
      baseValue: 25847
    },
    {
      title: "Active Conversations",
      value: "1,234",
      change: "+8%",
      changeType: "positive",
      icon: MessageSquare,
      color: "green",
      baseValue: 1234
    },
    {
      title: "Avg Response Time",
      value: "2.3 min",
      change: "-15%",
      changeType: "positive",
      icon: Clock,
      color: "orange",
      baseValue: 2.3
    },
    {
      title: "Success Rate",
      value: "94.5%",
      change: "+2%",
      changeType: "positive",
      icon: CheckCircle,
      color: "emerald",
      baseValue: 94.5
    }
  ]);

  // Simulate dynamic data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          const randomChange = (Math.random() - 0.5) * 0.1; // -5% to +5% change
          let newValue = metric.baseValue;
          let newValueString = '';
          let newChange = '';

          switch (metric.title) {
            case "Total Users":
              newValue = Math.floor(metric.baseValue + (Math.random() * 100 - 50));
              newValueString = newValue.toLocaleString();
              newChange = newValue > metric.baseValue ? `+${((newValue - metric.baseValue) / metric.baseValue * 100).toFixed(1)}%` : `${((newValue - metric.baseValue) / metric.baseValue * 100).toFixed(1)}%`;
              break;
            case "Active Conversations":
              newValue = Math.floor(metric.baseValue + (Math.random() * 50 - 25));
              newValueString = newValue.toLocaleString();
              newChange = newValue > metric.baseValue ? `+${((newValue - metric.baseValue) / metric.baseValue * 100).toFixed(1)}%` : `${((newValue - metric.baseValue) / metric.baseValue * 100).toFixed(1)}%`;
              break;
            case "Avg Response Time":
              newValue = parseFloat((metric.baseValue + randomChange).toFixed(1));
              newValueString = `${newValue} min`;
              newChange = newValue < metric.baseValue ? `+${(((metric.baseValue - newValue) / metric.baseValue) * 100).toFixed(1)}%` : `-${(((newValue - metric.baseValue) / metric.baseValue) * 100).toFixed(1)}%`;
              break;
            case "Success Rate":
              newValue = parseFloat((metric.baseValue + randomChange).toFixed(1));
              newValueString = `${newValue}%`;
              newChange = newValue > metric.baseValue ? `+${((newValue - metric.baseValue) / metric.baseValue * 100).toFixed(1)}%` : `${((newValue - metric.baseValue) / metric.baseValue * 100).toFixed(1)}%`;
              break;
          }

          return {
            ...metric,
            value: newValueString,
            change: newChange,
            changeType: newChange.startsWith('+') || (metric.title === "Avg Response Time" && newChange.startsWith('-')) ? "positive" : "negative"
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-center flex items-center justify-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <span>Admin Analytics Dashboard</span>
          </CardTitle>
          <p className="text-gray-300 text-center text-lg">
            Monitor GramaBot performance and user engagement metrics (Live Updates)
          </p>
        </CardHeader>
      </Card>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Analytics Overview</h3>
            <div className="flex gap-2">
              {['24h', '7d', '30d', '90d'].map(range => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                  <Badge 
                    variant={metric.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs mt-1"
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className={`p-3 rounded-full bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { language: 'Telugu', percentage: 45, users: '11,631' },
                { language: 'Hindi', percentage: 30, users: '7,754' },
                { language: 'English', percentage: 25, users: '6,461' }
              ].map((lang, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{lang.language}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${lang.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{lang.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Category Performance (Telangana Focus)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: 'Pension Services', queries: 8547, satisfaction: 95 },
                { service: 'Ration Card', queries: 6234, satisfaction: 92 },
                { service: 'Health Schemes', queries: 4156, satisfaction: 88 },
                { service: 'Education Scholarships', queries: 2987, satisfaction: 91 },
                { service: 'Land Records (Dharani)', queries: 1876, satisfaction: 85 }
              ].map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{service.service}</span>
                    <Badge variant="outline">{service.queries} queries</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${service.satisfaction}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{service.satisfaction}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Voice Recognition</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Translation Services</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Database Services</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Operational</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
