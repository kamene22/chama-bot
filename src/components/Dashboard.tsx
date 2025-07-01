
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { LayoutDashboard, Users, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  phone: string;
  monthlyGoal: number;
  totalPaid: number;
  lastPayment?: Date;
}

interface DashboardStats {
  totalMembers: number;
  totalCollected: number;
  averageContribution: number;
  completionRate: number;
}

const Dashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalCollected: 0,
    averageContribution: 0,
    completionRate: 0
  });

  // Simulate loading data (in a real app, this would come from Supabase)
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
      }
    ];

    setMembers(mockMembers);

    // Calculate stats
    const totalMembers = mockMembers.length;
    const totalCollected = mockMembers.reduce((sum, member) => sum + member.totalPaid, 0);
    const totalGoals = mockMembers.reduce((sum, member) => sum + member.monthlyGoal, 0);
    const averageContribution = totalMembers > 0 ? totalCollected / totalMembers : 0;
    const completionRate = totalGoals > 0 ? (totalCollected / totalGoals) * 100 : 0;

    setStats({
      totalMembers,
      totalCollected,
      averageContribution,
      completionRate
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Chama Dashboard</h1>
          <p className="text-muted-foreground">Overview of your Chama's performance</p>
        </div>
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

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Member Contributions</CardTitle>
          <CardDescription>Track individual member progress towards monthly goals</CardDescription>
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
              {members.map((member) => {
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

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Add Member</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Schedule Meeting</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Generate Report</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
