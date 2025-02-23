export type Employee = {
  id: string;
  name: string;
  position: string;
  salary: number;
  status: "Pending" | "Processed";
  created_at: string;
};
