import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrafficMetrics } from './traffic-metrics';
import { RealTimeMap } from './real-time-map';
import { AlertsPanel } from './alerts-panel';
import { 
  Car, 
  LogOut, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'Active Intersections',
      value: '247',
      change: '+12',
      trend: 'up',
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      title: 'Current Traffic Flow',
      value: '8,924',
      change: '+5.2%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Average Wait Time',
      value: '2.3 min',
      change: '-0.8 min',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts.toString(),
      change: 'Critical: 1',
      trend: 'neutral',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
                  <Car className="h-4 w-4" />
                </div>
                <h1 className="text-xl font-semibold">Smart Traffic AI</h1>
              </div>
              <Badge variant="secondary">Live</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600 mr-1" />}
                      {stat.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600 mr-1" />}
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 
                        stat.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="metrics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Live Map</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <TrafficMetrics />
          </TabsContent>

          <TabsContent value="map">
            <RealTimeMap />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel onAlertsChange={setActiveAlerts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}