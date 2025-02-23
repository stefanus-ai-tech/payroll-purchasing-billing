import { Card } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";
import { UserRound, ClipboardCheck, Receipt, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
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
  const [pendingPayroll, setPendingPayroll] = useState<number | null>(null);
  const [pendingPurchases, setPendingPurchases] = useState<number | null>(null);
  const [outstandingBills, setOutstandingBills] = useState<number | null>(null);
  const [monthRevenue, setMonthRevenue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: payrollData,
          error: payrollError,
          count: payrollCount,
        } = await supabase
          .from("employees")
          .select("*", { count: "exact" })
          .eq("status", "pending");

        if (payrollError) {
          throw payrollError;
        }

        if (payrollCount !== null) {
          setPendingPayroll(payrollCount);
        }

        const {
          data: purchaseData,
          error: purchaseError,
          count: purchaseCount,
        } = await supabase
          .from("purchase_requests")
          .select("*", { count: "exact" })
          .eq("status", "Pending");

        if (purchaseError) {
          throw purchaseError;
        }

        if (purchaseCount !== null) {
          setPendingPurchases(purchaseCount);
        }

        const {
          data: invoicesData,
          error: invoicesError,
          count: invoicesCount,
        } = await supabase
          .from("invoices")
          .select("*", { count: "exact" })
          .eq("status", "unpaid"); // Assuming 'unpaid' status for outstanding bills

        if (invoicesError) {
          throw invoicesError;
        }

        if (invoicesCount !== null) {
          setOutstandingBills(invoicesCount);
        }

        // Fetch and calculate Month Revenue
        const { data: monthRevenueData, error: monthRevenueError } =
          await supabase.from("invoices").select("amount, created_at");

        if (monthRevenueError) {
          throw monthRevenueError;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const currentMonthInvoices =
          monthRevenueData?.filter((invoice) => {
            const invoiceDate = new Date(invoice.created_at);
            return (
              invoiceDate.getMonth() === currentMonth &&
              invoiceDate.getFullYear() === currentYear
            );
          }) || [];

        const totalRevenue = currentMonthInvoices.reduce(
          (sum, invoice) => sum + invoice.amount,
          0
        );
        setMonthRevenue(totalRevenue);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updatedStats = stats.map((stat) => {
    if (stat.name === "Pending Payroll") {
      return {
        ...stat,
        value: pendingPayroll === null ? "N/A" : pendingPayroll.toString(),
      };
    }
    if (stat.name === "Purchase Requests") {
      return {
        ...stat,
        value: pendingPurchases === null ? "N/A" : pendingPurchases.toString(),
      };
    }
    if (stat.name === "Outstanding Bills") {
      return {
        ...stat,
        value: outstandingBills === null ? "N/A" : outstandingBills.toString(),
      };
    }
    if (stat.name === "Month Revenue") {
      return {
        ...stat,
        value:
          monthRevenue === null ? "N/A" : `Rp ${monthRevenue.toLocaleString()}`, // Format as currency
      };
    }
    return stat;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-up my-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your business operations
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {updatedStats.map((stat) => (
            <Card
              key={stat.name}
              className="p-4 hover:shadow-lg transition-shadow space-y-2"
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

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
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
