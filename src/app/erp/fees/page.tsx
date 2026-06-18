"use client";

import { useEffect, useState } from "react";
import { Plus, Search, IndianRupee, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Fee {
  id: string;
  title: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: string;
  lateFee: number;
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
    class: { name: string };
  };
  payments: { amount: number }[];
}

const statusVariant: Record<string, "success" | "warning" | "destructive" | "default"> = {
  PAID: "success",
  PENDING: "warning",
  OVERDUE: "destructive",
  PARTIAL: "default",
};

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchFees();
  }, [statusFilter]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/fees?${params}`);
      const data = await res.json();
      setFees(data.fees || []);
    } catch {
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = fees.filter((fee) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      fee.student.firstName.toLowerCase().includes(term) ||
      fee.student.lastName.toLowerCase().includes(term) ||
      fee.student.studentId.toLowerCase().includes(term) ||
      fee.title.toLowerCase().includes(term)
    );
  });

  const totalPending = fees
    .filter((f) => ["PENDING", "OVERDUE", "PARTIAL"].includes(f.status))
    .reduce((sum, f) => {
      const paid = f.payments.reduce((s, p) => s + p.amount, 0);
      return sum + (f.amount + f.lateFee - paid);
    }, 0);

  const totalCollected = fees
    .flatMap((f) => f.payments)
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Fee Management</h1>
          <p className="text-muted-foreground">Track fees, payments, and generate receipts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="gold" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Fee
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCollected)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue Fees</p>
              <p className="text-2xl font-bold">
                {fees.filter((f) => f.status === "OVERDUE").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="PAID">Paid</TabsTrigger>
                <TabsTrigger value="OVERDUE">Overdue</TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No fees found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((fee) => {
                  const paid = fee.payments.reduce((s, p) => s + p.amount, 0);
                  return (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {fee.student.firstName} {fee.student.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fee.student.studentId} &bull; {fee.student.class.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{fee.feeType}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{fee.title}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{formatCurrency(fee.amount)}</p>
                        {paid > 0 && (
                          <p className="text-xs text-green-600">Paid: {formatCurrency(paid)}</p>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(fee.dueDate)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[fee.status] || "default"}>
                          {fee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {fee.status !== "PAID" && (
                          <Button variant="gold" size="sm">
                            Collect Payment
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
