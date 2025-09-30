import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  X,
  Bell,
  Filter,
  Eye,
} from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  resolved: boolean;
}

interface AlertsPanelProps {
  onAlertsChange: (count: number) => void;
}

export function AlertsPanel({
  onAlertsChange,
}: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<
    "all" | "critical" | "warning" | "info"
  >("all");

  useEffect(() => {
    generateInitialAlerts();

    // Simulate new alerts every 10-20 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new alert
        addRandomAlert();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeAlerts = alerts.filter(
      (alert) => !alert.resolved,
    );
    onAlertsChange(activeAlerts.length);
  }, [alerts, onAlertsChange]);

  const generateInitialAlerts = () => {
    const initialAlerts: Alert[] = [
      {
        id: "1",
        type: "critical",
        title: "Traffic Light Malfunction",
        description:
          "Traffic signal stuck on red causing major backup",
        location: "Oak Ave & 3rd St",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        resolved: false,
      },
      {
        id: "2",
        type: "warning",
        title: "High Traffic Volume",
        description:
          "Unusual traffic volume detected, consider signal timing adjustment",
        location: "Broadway & 2nd St",
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        resolved: false,
      },
      {
        id: "3",
        type: "info",
        title: "Maintenance Scheduled",
        description:
          "Routine maintenance scheduled for tonight 2:00 AM",
        location: "Main St & 1st Ave",
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        resolved: false,
      },
      {
        id: "4",
        type: "warning",
        title: "Sensor Communication Lost",
        description:
          "Lost connection to traffic sensor, using backup timing",
        location: "Pine St & 4th Ave",
        timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
        resolved: true,
      },
    ];
    setAlerts(initialAlerts);
  };

  const addRandomAlert = () => {
    const alertTypes: Array<"critical" | "warning" | "info"> = [
      "critical",
      "warning",
      "info",
    ];
    const locations = [
      "Main St & 1st Ave",
      "Broadway & 2nd St",
      "Oak Ave & 3rd St",
      "Pine St & 4th Ave",
      "Elm St & 5th Ave",
    ];

    const alertTemplates = {
      critical: [
        {
          title: "Traffic Light Malfunction",
          description:
            "Signal system failure requiring immediate attention",
        },
        {
          title: "Emergency Vehicle Priority",
          description:
            "Emergency vehicle detected, adjusting traffic flow",
        },
        {
          title: "Accident Detected",
          description:
            "Potential accident detected based on traffic patterns",
        },
      ],
      warning: [
        {
          title: "High Congestion",
          description:
            "Traffic volume exceeds normal threshold",
        },
        {
          title: "Sensor Degraded",
          description:
            "Traffic sensor reporting inconsistent data",
        },
        {
          title: "Weather Impact",
          description:
            "Weather conditions affecting traffic flow",
        },
      ],
      info: [
        {
          title: "Optimization Applied",
          description:
            "AI optimization successfully applied to intersection",
        },
        {
          title: "Peak Hours Starting",
          description:
            "Entering peak traffic hours, adjusting timing",
        },
        {
          title: "System Update",
          description:
            "Traffic management system updated successfully",
        },
      ],
    };

    const type =
      alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const template =
      alertTemplates[type][
        Math.floor(Math.random() * alertTemplates[type].length)
      ];
    const location =
      locations[Math.floor(Math.random() * locations.length)];

    const newAlert: Alert = {
      id: Date.now().toString(),
      type,
      title: template.title,
      description: template.description,
      location,
      timestamp: new Date(),
      resolved: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, resolved: true }
          : alert,
      ),
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.filter((alert) => alert.id !== alertId),
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertTriangle;
      case "warning":
        return Clock;
      default:
        return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getBadgeVariant = (
    type: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    return alert.type === filter;
  });

  const activeAlerts = filteredAlerts.filter(
    (alert) => !alert.resolved,
  );
  const resolvedAlerts = filteredAlerts.filter(
    (alert) => alert.resolved,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            System Alerts
          </h3>
          <p className="text-sm text-gray-600">
            Monitor and manage traffic system alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={
              filter === "critical" ? "default" : "outline"
            }
            size="sm"
            onClick={() => setFilter("critical")}
          >
            Critical
          </Button>
          <Button
            variant={
              filter === "warning" ? "default" : "outline"
            }
            size="sm"
            onClick={() => setFilter("warning")}
          >
            Warning
          </Button>
          <Button
            variant={filter === "info" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("info")}
          >
            Info
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Active Alerts ({activeAlerts.length})</span>
            </CardTitle>
            <CardDescription>
              Alerts requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {activeAlerts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active alerts</p>
                    <p className="text-sm">
                      All systems operating normally
                    </p>
                  </div>
                ) : (
                  activeAlerts.map((alert) => {
                    const AlertIcon = getAlertIcon(alert.type);
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <AlertIcon className="h-5 w-5 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">
                                  {alert.title}
                                </h4>
                                <Badge
                                  variant={getBadgeVariant(
                                    alert.type,
                                  )}
                                >
                                  {alert.type}
                                </Badge>
                              </div>
                              <p className="text-sm mb-2">
                                {alert.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{alert.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {alert.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                resolveAlert(alert.id)
                              }
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                dismissAlert(alert.id)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Resolved Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>
                Resolved Alerts ({resolvedAlerts.length})
              </span>
            </CardTitle>
            <CardDescription>
              Recently resolved alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {resolvedAlerts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No resolved alerts</p>
                  </div>
                ) : (
                  resolvedAlerts.map((alert) => {
                    const AlertIcon = getAlertIcon(alert.type);
                    return (
                      <div
                        key={alert.id}
                        className="p-4 rounded-lg border bg-gray-50 border-gray-200 opacity-75"
                      >
                        <div className="flex items-start space-x-3">
                          <AlertIcon className="h-5 w-5 mt-0.5 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-700">
                                {alert.title}
                              </h4>
                              <Badge variant="outline">
                                Resolved
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {alert.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{alert.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {alert.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              dismissAlert(alert.id)
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}