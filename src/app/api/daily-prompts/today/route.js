import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { date } = await req.json();

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const clientDate = new Date(date + "T00:00:00");
    const startOfDay = new Date(clientDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(clientDate);
    endOfDay.setHours(23, 59, 59, 999);

    const prompt = (await prisma.dailyPrompt.findFirst({
      where: {
        promptDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })) || {
      id: "default",
      prompt: "Express yourself! Draw anything you like today.",
      promptDescription: "Express yourself! Draw anything you like today.",
      promptDate: startOfDay,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error fetching today's prompt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}