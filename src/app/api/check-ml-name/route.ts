// /src/app/api/check-ml-name/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, serverId } = await request.json();

    if (!userId || !serverId) {
      return NextResponse.json({ error: 'User ID and Server ID are required.' }, { status: 400 });
    }

    // Using a known public unofficial API endpoint that provides this service.
    // This is less stable than an official API but fulfills the user's request.
    const response = await fetch(`https://api.velixs.com/id-checker/ml?id=${userId}&zone=${serverId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Upstream API error:", errorData);
      return NextResponse.json({ error: errorData.message || 'Player not found or API error.' }, { status: response.status });
    }

    const data = await response.json();

    if (data.status === true && data.data) {
        return NextResponse.json({ playerName: data.data.username });
    } else {
        return NextResponse.json({ error: data.message || 'Player not found.' }, { status: 404 });
    }

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
