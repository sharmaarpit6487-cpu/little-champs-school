"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, IndianRupee, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ERPPageHeader } from "@/components/erp/page-header";

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
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState<{ id: string; firstName: string; lastName: string; studentId: string }[]>([]);
  const [newFee, setNewFee] = useState({
    studentId: "",
    feeType: "TUITION",
    title: "",
    amount: "",
    dueDate: new Date().toISOString().split("T")[0],
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });
  const fetchFees = useCallback(async () => {
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
  }, [statusFilter]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const loadStudents = useCallback(async () => {
    const res = await fetch("/api/students?limit=100");
    const data = await res.json();
    setStudents(data.students || []);
  }, []);

  const openPayment = (fee: Fee) => {
    const paid = fee.payments.reduce((s, p) => s + p.amount, 0);
    const remaining = fee.amount + fee.lateFee - paid;
    setSelectedFee(fee);
    setPayAmount(String(remaining));
    setPayMethod("CASH");
    setPayDialogOpen(true);
  };

  const submitPayment = async () => {
    if (!selectedFee) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/fees/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeId: selectedFee.id,
          amount: Number(payAmount),
          paymentMethod: payMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      toast.success("Payment recorded successfully");
      setPayDialogOpen(false);
      fetchFees();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const openAddFee = () => {
    loadStudents();
    setAddDialogOpen(true);
  };

  const submitNewFee = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFee,
          amount: Number(newFee.amount),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add fee");
      toast.success("Fee added");
      setAddDialogOpen(false);
      fetchFees();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add fee");
    } finally {
      setSubmitting(false);
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
      <ERPPageHeader
        title="Fee Management"
        description="Track fees, payments, and generate receipts"
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.info("Open Reports to export fee data.")}>
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="default" className="gap-2" onClick={openAddFee}>
              <Plus className="h-4 w-4" />
              Add Fee
            </Button>          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-0 shadow-soft">
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
        <Card className="rounded-2xl border-0 shadow-soft">
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
        <Card className="rounded-2xl border-0 shadow-soft">
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

      <Card className="rounded-2xl border-0 shadow-soft">
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
            <div className="overflow-x-auto -mx-1 px-1">
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
                          <Button variant="default" size="sm" onClick={() => openPayment(fee)}>
                            Collect Payment
                          </Button>
                        )}                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedFee.student.firstName} {selectedFee.student.lastName} — {selectedFee.title}
              </p>
              <div>
                <Label htmlFor="payAmount">Amount (₹)</Label>
                <Input id="payAmount" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE", "ONLINE"].map((m) => (
                      <SelectItem key={m} value={m}>{m.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={submitPayment} disabled={submitting}>
                {submitting ? "Processing..." : "Record Payment"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Student</Label>
              <Select value={newFee.studentId} onValueChange={(v) => setNewFee((f) => ({ ...f, studentId: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feeTitle">Title</Label>
              <Input id="feeTitle" value={newFee.title} onChange={(e) => setNewFee((f) => ({ ...f, title: e.target.value }))} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fee Type</Label>
                <Select value={newFee.feeType} onValueChange={(v) => setNewFee((f) => ({ ...f, feeType: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["TUITION", "TRANSPORT", "EXAM", "LIBRARY", "LAB", "SPORTS", "UNIFORM", "OTHER"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="feeAmount">Amount</Label>
                <Input id="feeAmount" type="number" value={newFee.amount} onChange={(e) => setNewFee((f) => ({ ...f, amount: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={newFee.dueDate} onChange={(e) => setNewFee((f) => ({ ...f, dueDate: e.target.value }))} className="mt-1" />
            </div>
            <Button className="w-full" onClick={submitNewFee} disabled={submitting || !newFee.studentId || !newFee.title || !newFee.amount}>
              {submitting ? "Saving..." : "Create Fee"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}