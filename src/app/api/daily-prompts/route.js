import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const prompts = await prisma.dailyPrompt.findMany({
      orderBy: { promptDate: "asc" },
    });
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { prompt, promptDescription, promptDate } = await req.json();
    const newPrompt = await prisma.dailyPrompt.create({
      data: { prompt, promptDescription, promptDate: new Date(promptDate) },
    });
    return NextResponse.json(newPrompt);
  } catch (error) {
    console.error("Error adding prompt:", error);
    return NextResponse.json({ error: "Failed to add prompt" }, { status: 500 });
  }
}
