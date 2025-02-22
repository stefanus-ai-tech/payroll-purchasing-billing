
export interface Invoice {
  id: string;
  invoice_id: string;
  client: string;
  amount: number;
  due_date: string;
  status: "Pending" | "Paid" | "Overdue";
}
