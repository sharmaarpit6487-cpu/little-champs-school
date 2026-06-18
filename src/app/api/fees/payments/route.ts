import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { paymentSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { generateReceiptNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("fees:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = paymentSchema.parse(body);

    const fee = await prisma.fee.findUnique({
      where: { id: data.feeId },
      include: { payments: true },
    });

    if (!fee) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    }

    const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = fee.amount + fee.lateFee - fee.discount - totalPaid;

    if (data.amount > remaining) {
      return NextResponse.json(
        { error: `Payment exceeds remaining amount of ₹${remaining}` },
        { status: 400 }
      );
    }

    const receiptNumber = generateReceiptNumber();

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.feePayment.create({
        data: {
          feeId: data.feeId,
          studentId: fee.studentId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          receiptNumber,
          remarks: data.remarks,
          collectedBy: session!.user.name,
        },
      });

      const newTotalPaid = totalPaid + data.amount;
      const feeTotal = fee.amount + fee.lateFee - fee.discount;
      let newStatus: "PAID" | "PARTIAL" | "PENDING" = "PENDING";

      if (newTotalPaid >= feeTotal) {
        newStatus = "PAID";
      } else if (newTotalPaid > 0) {
        newStatus = "PARTIAL";
      }

      await tx.fee.update({
        where: { id: data.feeId },
        data: { status: newStatus },
      });

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber: `INV${receiptNumber}`,
          studentId: fee.studentId,
          paymentId: payment.id,
          totalAmount: data.amount,
          items: [
            {
              title: fee.title,
              feeType: fee.feeType,
              amount: data.amount,
            },
          ],
          dueDate: fee.dueDate,
        },
      });

      return { payment, invoice };
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "PAYMENT",
      entity: "FeePayment",
      entityId: result.payment.id,
      newData: result,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
