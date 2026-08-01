import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Package, Briefcase, GraduationCap, Users, FileText, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  stats: {
    products: number;
    services: number;
    courses: number;
    jobs: number;
    posts: number;
    unreadMessages: number;
  };
  recentActivity: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setData(result.data);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Products', value: data?.stats.products || 0, icon: Package, link: '/admin/products' },
    { title: 'Services', value: data?.stats.services || 0, icon: Briefcase, link: '/admin/services' },
    { title: 'Courses', value: data?.stats.courses || 0, icon: GraduationCap, link: '/admin/courses' },
    { title: 'Jobs', value: data?.stats.jobs || 0, icon: Users, link: '/admin/jobs' },
    { title: 'Blog Posts', value: data?.stats.posts || 0, icon: FileText, link: '/admin/blog' },
    { title: 'Unread Messages', value: data?.stats.unreadMessages || 0, icon: MessageSquare, link: '/admin/messages', alert: (data?.stats.unreadMessages || 0) > 0 },
  ];

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Here is the current status of your platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={stat.alert ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-900' : ''}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.alert ? 'text-blue-600' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.alert ? 'text-blue-700 dark:text-blue-400' : ''}`}>{stat.value}</div>
                <Link to={stat.link} className="text-xs text-muted-foreground flex items-center mt-2 hover:text-primary transition-colors">
                  Manage {stat.title.toLowerCase()} <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!data?.recentActivity?.length ? (
                <p className="text-sm text-muted-foreground">No recent messages.</p>
              ) : (
                data.recentActivity.map((msg) => (
                  <div key={msg._id} className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{msg.fullName}</p>
                        {msg.status === 'unread' && (
                          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{msg.subject || 'No Subject'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</p>
                      <Link to="/admin/messages" className="text-xs text-primary hover:underline mt-1 block">View</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
