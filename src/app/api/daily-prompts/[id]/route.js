import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { prompt, promptDescription, promptDate } = await req.json();
    const updated = await prisma.dailyPrompt.update({
      where: { id: params.id },
      data: {
        prompt,
        promptDescription,
        promptDate: new Date(promptDate),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}
