"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  Users as UsersIcon,
  Briefcase,
  Mail,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
export default function AdminDashboardPage() {
  const [kpi, setKpi] = useState({
    totalUsers: 0,
    totalJobs: 0,
    newApplications: 0,
    revenue: 0,
  });
  const [dailyUsers, setDailyUsers] = useState<
    { date: string; caregivers: number; employers: number }[]
  >([]);
  const [jobsPosted, setJobsPosted] = useState<
    { month: string; posted: number; filled: number }[]
  >([]);
  const [roleBreakdown, setRoleBreakdown] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const router = useRouter();

  const pieConfig = useMemo(() => {
    const cfg: Record<string, { label?: string; color?: string }> = {};
    roleBreakdown.forEach((r) => {
      if (r?.name) cfg[r.name] = { label: r.name, color: r.color };
    });
    return cfg;
  }, [roleBreakdown]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [metricsRes, analyticsRes] = await Promise.all([
          fetch("/api/admin/metrics", { cache: "no-store" }),
          fetch("/api/admin/analytics", { cache: "no-store" }),
        ]);
        const metrics = await metricsRes.json();
        const analytics = await analyticsRes.json();

        if (cancelled) return;
        setKpi({
          totalUsers: metrics?.data?.totalUsers ?? 0,
          totalJobs: metrics?.data?.totalJobs ?? 0,
          newApplications: metrics?.data?.newApplications ?? 0,
          revenue: metrics?.data?.revenue ?? 0,
        });
        setDailyUsers(analytics?.data?.dailyUsers ?? []);
        setJobsPosted(analytics?.data?.jobsPosted ?? []);

        const colors: Record<string, string> = {
          EMPLOYEE: "#2563eb",
          EMPLOYER: "#60a5fa",
          STAFF: "#1e3a8a",
          ADMIN: "#0b316b",
        };
        const breakdown = (analytics?.data?.roleBreakdown ?? []).map(
          (r: any) => ({
            name: r.role.charAt(0) + r.role.slice(1).toLowerCase(),
            value: r.value,
            color: colors[r.role] || "#2563eb",
          })
        );
        setRoleBreakdown(breakdown);
      } catch (e) {
        // silent fallback
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const kpiCards = useMemo(
    () => [
      {
        label: "Total Users",
        value: kpi.totalUsers,
        delta: "+12%",
        icon: UsersIcon,
      },
      {
        label: "Active Jobs",
        value: kpi.totalJobs,
        delta: "+5%",
        icon: Briefcase,
      },
      {
        label: "New Applications",
        value: kpi.newApplications,
        delta: "+18%",
        icon: Mail,
      },
      {
        label: "Revenue",
        value:
          typeof kpi.revenue === "number"
            ? `$${kpi.revenue.toLocaleString()}`
            : kpi.revenue,
        delta: "+9%",
        icon: DollarSign,
      },
    ],
    [kpi]
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-10" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of platform performance and activity
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="relative bg-white/0 hover:bg-gray-100 border-gray-300"
            >
              Export Reports
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/admin/analytics")}
            >
              Go to Analytics <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((item) => (
          <Card key={item.label} className="shadow-sm ring-1 ring-slate-200/60">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm text-slate-500">
                {item.label}
              </CardTitle>
              <item.icon className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-emerald-600 text-sm flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" /> {item.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="shadow-sm ring-1 ring-slate-200/60 xl:col-span-2">
          <CardHeader>
            <CardTitle>Daily Signups (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                caregivers: {
                  label: "Caregivers",
                  color: "hsl(217.2 91.2% 59.8%)",
                },
                employers: {
                  label: "Employers",
                  color: "hsl(214.8 83.2% 51.0%)",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={dailyUsers} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  dy={6}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={{ stroke: "#cbd5e1" }}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
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

        <Card className="shadow-sm ring-1 ring-slate-200/60">
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            {roleBreakdown.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                No role data available
              </div>
            ) : (
              <ChartContainer
                config={pieConfig as any}
                className="h-[300px] flex items-center justify-center"
              >
                <PieChart>
                  <Pie
                    data={roleBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {roleBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm ring-1 ring-slate-200/60">
        <CardHeader>
          <CardTitle>Jobs Posted vs Filled</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              posted: { label: "Posted", color: "#60a5fa" },
              filled: { label: "Filled", color: "#1d4ed8" },
            }}
            className="h-[320px]"
          >
            <BarChart data={jobsPosted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} dy={6} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="posted"
                fill="var(--color-posted)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="filled"
                fill="var(--color-filled)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
