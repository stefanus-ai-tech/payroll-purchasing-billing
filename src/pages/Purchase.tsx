
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const requests = [
  {
    id: "PR001",
    requester: "Marketing Team",
    items: "Office Supplies",
    amount: "Rp 2,500,000",
    status: "Pending",
  },
  {
    id: "PR002",
    requester: "IT Department",
    items: "Hardware Equipment",
    amount: "Rp 15,000,000",
    status: "Approved",
  },
  {
    id: "PR003",
    requester: "Sales Team",
    items: "Marketing Materials",
    amount: "Rp 5,000,000",
    status: "Rejected",
  },
];

export default function Purchase() {
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-up">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Purchase Requests
            </h2>
            <p className="text-muted-foreground">
              Manage and track purchase requests
            </p>
          </div>
          <Button>New Request</Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.items}</TableCell>
                  <TableCell>{request.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "Approved"
                          ? "default"
                          : request.status === "Rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
}
