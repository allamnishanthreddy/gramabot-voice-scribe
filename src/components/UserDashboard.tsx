import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, FileText, Clock, CheckCircle, AlertCircle, Calendar, Bell, Star, Download } from "lucide-react";

const UserDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const applications = [
    {
      id: 1,
      title: "Pension Application",
      type: "Pension",
      status: "approved",
      submittedDate: "2024-01-15",
      lastUpdate: "2024-02-01",
      progress: 100,
      nextAction: "Collect pension card",
      applicationNumber: "PEN2024001234",
      estimatedCompletion: "Completed"
    },
    {
      id: 2,
      title: "Ration Card Application",
      type: "Ration",
      status: "in-progress",
      submittedDate: "2024-02-01",
      lastUpdate: "2024-02-15",
      progress: 60,
      nextAction: "Document verification",
      applicationNumber: "RAT2024005678",
      estimatedCompletion: "2024-03-10"
    },
    {
      id: 3,
      title: "Health Scheme Enrollment",
      type: "Health",
      status: "pending",
      submittedDate: "2024-02-10",
      lastUpdate: "2024-02-12",
      progress: 30,
      nextAction: "Aadhaar verification",
      applicationNumber: "HEA2024009012",
      estimatedCompletion: "2024-03-01"
    },
    {
      id: 4,
      title: "Land Record Update",
      type: "Land",
      status: "rejected",
      submittedDate: "2023-12-20",
      lastUpdate: "2024-01-05",
      progress: 100,
      nextAction: "Re-apply with correct documents",
      applicationNumber: "LAN2023003456",
      estimatedCompletion: "N/A"
    },
    {
      id: 5,
      title: "Scholarship Application",
      type: "Education",
      status: "approved",
      submittedDate: "2023-11-15",
      lastUpdate: "2023-12-01",
      progress: 100,
      nextAction: "Receive scholarship amount",
      applicationNumber: "SCH2023007890",
      estimatedCompletion: "Completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => 
    selectedFilter === 'all' || app.status === selectedFilter
  );

  const stats = {
    total: applications.length,
    approved: applications.filter(app => app.status === 'approved').length,
    inProgress: applications.filter(app => app.status === 'in-progress').length,
    pending: applications.filter(app => app.status === 'pending').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-center flex items-center justify-center space-x-3">
            <User className="h-8 w-8" />
            <span>Personal Dashboard</span>
          </CardTitle>
          <p className="text-indigo-100 text-center text-lg">
            Track all your government service applications and their status
          </p>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Applications</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Approved</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">In Progress</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Pending</div>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            <div className="text-sm text-red-700 dark:text-red-300">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'approved', 'in-progress', 'pending', 'rejected'].map(filter => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
              >
                {filter === 'in-progress' ? 'In Progress' : filter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-6">
        {filteredApplications.map(application => (
          <Card key={application.id} className="hover:shadow-xl transition-all bg-white dark:bg-gray-800 border-2 hover:border-indigo-300 dark:hover:border-indigo-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{application.title}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">#{application.applicationNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">{application.type}</Badge>
                  <Badge 
                    variant={application.status === 'approved' ? 'default' : 'secondary'} 
                    className={`text-xs ${getStatusColor(application.status)} text-white`}
                  >
                    {getStatusIcon(application.status)}
                    <span className="ml-1 capitalize">{application.status.replace('-', ' ')}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Submitted Date</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{new Date(application.submittedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Last Update</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{new Date(application.lastUpdate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Next Action</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{application.nextAction}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Estimated Completion</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{application.estimatedCompletion}</p>
                  </div>
                </div>
                
                {application.status !== 'approved' && application.status !== 'rejected' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{application.progress}%</span>
                    </div>
                    <Progress value={application.progress} className="w-full" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    View Timeline
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Download Receipt
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Bell className="w-3 h-3 mr-1" />
                    Set Reminder
                  </Button>
                  {application.status === 'approved' && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Rate Service
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-purple-800 dark:text-purple-300">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900">
              <FileText className="w-4 h-4 mr-2" />
              New Application
            </Button>
            <Button variant="outline" className="border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900">
              <Download className="w-4 h-4 mr-2" />
              Download All Reports
            </Button>
            <Button variant="outline" className="border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900">
              <Bell className="w-4 h-4 mr-2" />
              Notification Settings
            </Button>
            <Button variant="outline" className="border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900">
              <User className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
