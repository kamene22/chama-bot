
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Users, TrendingUp, Calendar, DollarSign, Search, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Member {
  id: string;
  name: string;
  phone: string;
  monthlyGoal: number;
  totalPaid: number;
  lastPayment?: Date;
}

interface Contribution {
  id: string;
  memberName: string;
  category: string;
  amount: number;
  period: string;
  datePaid: Date;
}

interface DashboardStats {
  totalMembers: number;
  totalCollected: number;
  averageContribution: number;
  completionRate: number;
  categoryBreakdown: Array<{ category: string; amount: number; color: string }>;
}

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalCollected: 0,
    averageContribution: 0,
    completionRate: 0,
    categoryBreakdown: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingReminders, setIsLoadingReminders] = useState(false);
  const { toast } = useToast();

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Simulate loading data (in a real app, this would come from your backend)
  useEffect(() => {
    // Mock data for demonstration
    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+254700000001',
        monthlyGoal: 5000,
        totalPaid: 4500,
        lastPayment: new Date('2024-06-28')
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '+254700000002',
        monthlyGoal: 3000,
        totalPaid: 3000,
        lastPayment: new Date('2024-06-30')
      },
      {
        id: '3',
        name: 'Mike Johnson',
        phone: '+254700000003',
        monthlyGoal: 7000,
        totalPaid: 6200,
        lastPayment: new Date('2024-06-25')
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        phone: '+254700000004',
        monthlyGoal: 4000,
        totalPaid: 2000,
        lastPayment: new Date('2024-06-20')
      },
      {
        id: '5',
        name: 'David Brown',
        phone: '+254700000005',
        monthlyGoal: 6000,
        totalPaid: 6000,
        lastPayment: new Date('2024-07-01')
      }
    ];

    const mockContributions: Contribution[] = [
      { id: '1', memberName: 'John Doe', category: 'Welfare', amount: 2000, period: 'July 2024', datePaid: new Date('2024-07-01') },
      { id: '2', memberName: 'Jane Smith', category: 'Savings', amount: 1500, period: 'July 2024', datePaid: new Date('2024-07-01') },
      { id: '3', memberName: 'Mike Johnson', category: 'Emergency', amount: 3000, period: 'July 2024', datePaid: new Date('2024-06-30') },
      { id: '4', memberName: 'Sarah Wilson', category: 'Welfare', amount: 1000, period: 'July 2024', datePaid: new Date('2024-06-29') },
      { id: '5', memberName: 'David Brown', category: 'Savings', amount: 2500, period: 'July 2024', datePaid: new Date('2024-07-01') },
      { id: '6', memberName: 'John Doe', category: 'Savings', amount: 2500, period: 'July 2024', datePaid: new Date('2024-06-25') },
    ];

    setMembers(mockMembers);
    setContributions(mockContributions);

    // Calculate stats
    const totalMembers = mockMembers.length;
    const totalCollected = mockMembers.reduce((sum, member) => sum + member.totalPaid, 0);
    const totalGoals = mockMembers.reduce((sum, member) => sum + member.monthlyGoal, 0);
    const averageContribution = totalMembers > 0 ? totalCollected / totalMembers : 0;
    const completionRate = totalGoals > 0 ? (totalCollected / totalGoals) * 100 : 0;

    // Calculate category breakdown
    const categoryTotals = mockContributions.reduce((acc, contribution) => {
      acc[contribution.category] = (acc[contribution.category] || 0) + contribution.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount], index) => ({
      category,
      amount,
      color: colors[index % colors.length]
    }));

    setStats({
      totalMembers,
      totalCollected,
      averageContribution,
      completionRate,
      categoryBreakdown
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const getProgressPercentage = (paid: number, goal: number) => {
    return Math.min((paid / goal) * 100, 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const getEndpointUrl = () => {
    return localStorage.getItem('chamabot_endpoint') || 'http://localhost:5000';
  };

  const sendFridayReminders = async () => {
    setIsLoadingReminders(true);
    try {
      const response = await fetch(`${getEndpointUrl()}/send-reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Reminders Sent",
        description: "Friday reminders have been sent to all members successfully."
      });
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast({
        title: "Failed to Send Reminders",
        description: "There was an error sending the reminders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingReminders(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Chama Dashboard</h1>
            <p className="text-muted-foreground">Overview of your Chama's performance</p>
          </div>
        </div>
        <Button 
          onClick={sendFridayReminders}
          disabled={isLoadingReminders}
          className="flex items-center space-x-2"
        >
          {isLoadingReminders ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Send Friday Reminders</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">Active contributors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCollected)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Contribution</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageContribution)}</div>
            <p className="text-xs text-muted-foreground">Per member</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Of monthly goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Member Contributions</CardTitle>
                  <CardDescription>Track individual member progress towards monthly goals</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Monthly Goal</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => {
                    const progressPercentage = getProgressPercentage(member.totalPaid, member.monthlyGoal);
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>{formatCurrency(member.monthlyGoal)}</TableCell>
                        <TableCell>{formatCurrency(member.totalPaid)}</TableCell>
                        <TableCell className="w-32">
                          <Progress value={progressPercentage} className="w-full" />
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${getStatusColor(progressPercentage)}`}>
                            {progressPercentage >= 100 ? 'Complete' : 
                             progressPercentage >= 75 ? 'On Track' : 'Behind'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contributions Tab */}
        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
              <CardDescription>Latest payments from members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Date Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributions.map((contribution) => (
                    <TableRow key={contribution.id}>
                      <TableCell className="font-medium">{contribution.memberName}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {contribution.category}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(contribution.amount)}</TableCell>
                      <TableCell>{contribution.period}</TableCell>
                      <TableCell>{contribution.datePaid.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Contributions by Category</CardTitle>
                <CardDescription>Monthly breakdown of contribution categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Percentage breakdown of contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {stats.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
