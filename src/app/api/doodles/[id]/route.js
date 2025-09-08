import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fetch doodle by query parameter ID
export async function GET({ request }, { params }) {
  const doodleId = params.id; // Get 'id' from URL params

  if (!doodleId) {
    return NextResponse.json({ error: 'Doodle ID is required' }, { status: 400 });
  }

  try {
    // Fetch the doodle from the database
    const doodle = await prisma.doodle.findUnique({
      where: {
        id: doodleId,
      },
      include: {
        profile: true, // Include related profile if necessary
      },
    });

    // Check if doodle exists
    if (!doodle) {
      return NextResponse.json({ error: 'Doodle not found' }, { status: 404 });
    }

    // Return the doodle data
    return NextResponse.json(doodle, { status: 200 });
  } catch (error) {
    console.error('Error fetching doodle:', error);
    return NextResponse.json({ error: 'Failed to fetch doodle' }, { status: 500 });
  }
}