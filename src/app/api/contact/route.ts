import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    contactSchema.parse(body);

    // In production, send email via nodemailer or save to database
    // await sendContactEmail(data);

    return NextResponse.json({ message: "Message received successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send message";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
