import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types';
import type { PlatformStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authorization
  if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock stats for now - replace with actual API call
      const mockStats: PlatformStats = {
        totalUsers: 1234,
        activeHosts: 156,
        totalExperiences: 542,
        approvedExperiences: 487,
        totalBookings: 3850,
        totalRevenue: 425000,
        averageRating: 4.7,
        topCategories: [
          { category: 'OUTDOOR_ADVENTURE' as any, count: 145 },
          { category: 'FOOD_DRINK' as any, count: 132 },
          { category: 'ART_CULTURE' as any, count: 95 },
        ],
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-12 w-12 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Hosts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeHosts}</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Experiences</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.totalExperiences}
                      </p>
                    </div>
                    <Package className="h-12 w-12 text-purple-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        ${(stats.totalRevenue / 1000).toFixed(1)}k
                      </p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-emerald-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Experiences Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Experiences Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Approved</span>
                        <span className="text-sm font-bold text-gray-900">
                          {stats.approvedExperiences}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(stats.approvedExperiences / stats.totalExperiences) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Pending Review</span>
                        <span className="text-sm font-bold text-gray-900">
                          {stats.totalExperiences - stats.approvedExperiences}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{
                            width: `${((stats.totalExperiences - stats.approvedExperiences) / stats.totalExperiences) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Bookings</span>
                      <span className="font-bold text-lg text-gray-900">{stats.totalBookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-bold text-lg text-gray-900">
                        {stats.averageRating.toFixed(1)} ⭐
                      </span>
                    </div>
                    <div className="border-t pt-4 flex items-center justify-between">
                      <span className="text-gray-600">Revenue per Booking</span>
                      <span className="font-bold text-lg text-gray-900">
                        ${(stats.totalRevenue / stats.totalBookings).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Experience Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {category.category}
                        </span>
                        <span className="text-sm font-bold text-gray-900">{category.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(category.count / (stats.topCategories[0]?.count || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="mt-8 border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Pending Review
                    </h3>
                    <p className="text-yellow-800">
                      You have {stats.totalExperiences - stats.approvedExperiences} experiences
                      pending review. Please review them as soon as possible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
