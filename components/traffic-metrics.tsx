import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

type TrafficDataPoint = {
  time: string;
  volume: number;
  speed: number;
  congestion: number;
};

export function TrafficMetrics() {
  // Change state type from any[] to TrafficDataPoint[]
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>([]);
  // You can also define types for other states if you want, but only trafficData is required for this fix
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [intersectionData, setIntersectionData] = useState<any[]>([]);
  const [alertData, setAlertData] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial data
    generateTrafficData();
    generateHourlyData();
    generateIntersectionData();
    generateAlertData();

    // Update data every 5 seconds for real-time effect
    const interval = setInterval(() => {
      generateTrafficData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateTrafficData = () => {
    const now = new Date();
    const data: TrafficDataPoint[] = [];
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // Every minute
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        volume: Math.floor(Math.random() * 100) + 200 + Math.sin(i * 0.1) * 50,
        speed: Math.floor(Math.random() * 15) + 35 + Math.cos(i * 0.15) * 10,
        congestion: Math.max(0, Math.floor(Math.random() * 50) + Math.sin(i * 0.2) * 25)
      });
    }
    setTrafficData(data);
  };

  const generateHourlyData = () => {
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];
    const data = hours.map(hour => ({
      hour,
      northbound: Math.floor(Math.random() * 500) + 200,
      southbound: Math.floor(Math.random() * 500) + 200,
      eastbound: Math.floor(Math.random() * 500) + 200,
      westbound: Math.floor(Math.random() * 500) + 200
    }));
    setHourlyData(data);
  };

  const generateIntersectionData = () => {
    const intersections = [
      'Main St & 1st Ave',
      'Broadway & 2nd St',
      'Oak Ave & 3rd St',
      'Pine St & 4th Ave',
      'Elm St & 5th Ave'
    ];
    const data = intersections.map(name => ({
      name,
      volume: Math.floor(Math.random() * 1000) + 500,
      efficiency: Math.floor(Math.random() * 30) + 70
    }));
    setIntersectionData(data);
  };

  const generateAlertData = () => {
    const data = [
      { name: 'Normal', value: 85, color: '#10B981' },
      { name: 'Warning', value: 12, color: '#F59E0B' },
      { name: 'Critical', value: 3, color: '#EF4444' }
    ];
    setAlertData(data);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Traffic Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Traffic Flow</CardTitle>
          <CardDescription>Live traffic volume, speed, and congestion levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Volume"
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Avg Speed (mph)"
                />
                <Line 
                  type="monotone" 
                  dataKey="congestion" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Congestion %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Traffic by Direction */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic by Direction</CardTitle>
            <CardDescription>Hourly traffic volume by direction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="northbound" fill="#3B82F6" name="Northbound" />
                  <Bar dataKey="southbound" fill="#10B981" name="Southbound" />
                  <Bar dataKey="eastbound" fill="#F59E0B" name="Eastbound" />
                  <Bar dataKey="westbound" fill="#EF4444" name="Westbound" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current alert distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {alertData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Intersections */}
      <Card>
        <CardHeader>
          <CardTitle>Top Intersections by Volume</CardTitle>
          <CardDescription>Current traffic volume and efficiency ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intersectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                  name="Volume"
                />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stackId="2" 
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.3}
                  name="Efficiency %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}