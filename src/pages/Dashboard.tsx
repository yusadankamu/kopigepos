import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { DashboardStats } from "../types";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  BadgeDollarSign,
  TrendingUp,
  Calendar,
  Users,
  Coffee,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(timer);
      }
      setDisplayValue(Math.floor(current));
    }, 50);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatIDR(displayValue)}</span>;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    dailyEarnings: 0,
    monthlyEarnings: 0,
    annualEarnings: 0,
    topSellingItems: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const salesRef = collection(db, "sales");

        // Daily earnings
        const dailyQuery = query(
          salesRef,
          where("timestamp", ">=", Timestamp.fromDate(startOfDay))
        );
        const dailySnapshot = await getDocs(dailyQuery);
        const dailyTotal = dailySnapshot.docs.reduce(
          (acc, doc) => acc + doc.data().amount,
          0
        );

        // Monthly earnings
        const monthlyQuery = query(
          salesRef,
          where("timestamp", ">=", Timestamp.fromDate(startOfMonth))
        );
        const monthlySnapshot = await getDocs(monthlyQuery);
        const monthlyTotal = monthlySnapshot.docs.reduce(
          (acc, doc) => acc + doc.data().amount,
          0
        );

        // Annual earnings
        const annualQuery = query(
          salesRef,
          where("timestamp", ">=", Timestamp.fromDate(startOfYear))
        );
        const annualSnapshot = await getDocs(annualQuery);
        const annualTotal = annualSnapshot.docs.reduce(
          (acc, doc) => acc + doc.data().amount,
          0
        );

        setStats({
          dailyEarnings: dailyTotal,
          monthlyEarnings: monthlyTotal,
          annualEarnings: annualTotal,
          topSellingItems: [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: number;
    icon: any;
    trend?: { value: number; positive: boolean };
  }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          {trend && (
            <span
              className={`flex items-center text-sm font-medium ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.positive ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {trend.value}%
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">
          <AnimatedNumber value={value} />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
    </div>
  );

  const QuickInsightCard = ({
    title,
    value,
    description,
    icon: Icon,
  }: {
    title: string;
    value: string;
    description: string;
    icon: any;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-xl">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  const chartData = [
    { name: "Mon", revenue: stats.dailyEarnings * 0.8 },
    { name: "Tue", revenue: stats.dailyEarnings * 0.9 },
    { name: "Wed", revenue: stats.dailyEarnings * 1.1 },
    { name: "Thu", revenue: stats.dailyEarnings * 1.2 },
    { name: "Fri", revenue: stats.dailyEarnings * 1.3 },
    { name: "Sat", revenue: stats.dailyEarnings * 1.4 },
    { name: "Sun", revenue: stats.dailyEarnings },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Track your business performance and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Daily Revenue"
          value={stats.dailyEarnings}
          icon={BadgeDollarSign}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.monthlyEarnings}
          icon={Calendar}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Annual Revenue"
          value={stats.annualEarnings}
          icon={TrendingUp}
          trend={{ value: 15, positive: true }}
        />
        <StatCard
          title="Today's Orders"
          value={stats.dailyEarnings / 100000}
          icon={ShoppingBag}
          trend={{ value: 5, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Revenue Trend
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Weekly performance overview
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(value) => formatIDR(value as number)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <QuickInsightCard
            title="Active Customers"
            value="245"
            description="12% increase from last week"
            icon={Users}
          />
          <QuickInsightCard
            title="Popular Items"
            value="Cappuccino"
            description="Most ordered item today"
            icon={Coffee}
          />
          <QuickInsightCard
            title="Peak Hours"
            value="2PM - 4PM"
            description="Highest traffic period"
            icon={TrendingUp}
          />
        </div>
      </div>
    </div>
  );
}
