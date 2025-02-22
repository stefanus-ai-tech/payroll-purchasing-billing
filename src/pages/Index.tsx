
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";
import {
  UserRound,
  ClipboardCheck,
  Receipt,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    name: "Pending Payroll",
    value: "25",
    description: "Employees",
    icon: UserRound,
  },
  {
    name: "Purchase Requests",
    value: "12",
    description: "Pending approval",
    icon: ClipboardCheck,
  },
  {
    name: "Outstanding Bills",
    value: "8",
    description: "Need attention",
    icon: Receipt,
  },
  {
    name: "Month Revenue",
    value: "Rp 45.2M",
    description: "+12.3% from last month",
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-up">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your business operations
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.name}
              className="p-6 hover:shadow-lg transition-shadow space-y-2"
            >
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </h3>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                "New purchase request from Marketing",
                "Payroll processed for 25 employees",
                "3 invoices due this week",
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-sm text-muted-foreground"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p>{activity}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
