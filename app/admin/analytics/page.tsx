"use client";

import React, { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAnalyticsPage() {
  const [daily, setDaily] = useState<
    { date: string; caregivers: number; employers: number }[]
  >([]);
  const [dailyApps, setDailyApps] = useState<
    { date: string; applications: number }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/analytics", { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        setDaily(json?.data?.dailyUsers ?? []);
        setDailyApps(json?.data?.dailyApplications ?? []);
      } catch {}
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-slate-500">
          Track growth, engagement, and conversion metrics
        </p>
      </div>

      <Tabs defaultValue="signups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="signups">Signups</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="signups">
          <Card className="shadow-sm ring-1 ring-slate-200/60">
            <CardHeader>
              <CardTitle>Daily Signups (Last 30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  caregivers: { label: "Caregivers", color: "#2563eb" },
                  employers: { label: "Employers", color: "#60a5fa" },
                }}
                className="h-[320px]"
              >
                <LineChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    dy={6}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="caregivers"
                    stroke="var(--color-caregivers)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="employers"
                    stroke="var(--color-employers)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card className="shadow-sm ring-1 ring-slate-200/60">
            <CardHeader>
              <CardTitle>Daily Applications (Last 30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  applications: { label: "Applications", color: "#1d4ed8" },
                }}
                className="h-[320px]"
              >
                <AreaChart data={dailyApps}>
                  <defs>
                    <linearGradient id="fillApps" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    dy={6}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#1d4ed8"
                    fill="url(#fillApps)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
