import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const apiKey = process.env.ECOM_API_KEY;
    const apiToken = process.env.ECOM_API_TOKEN;

    if (!apiKey || !apiToken) {
      return NextResponse.json(
        { error: "E-com Delivery credentials are not configured" },
        { status: 500 }
      );
    }

    const wilayaId = request.nextUrl.searchParams.get("id_wilaya");

    if (!wilayaId) {
      return NextResponse.json(
        { error: "Wilaya ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://ecom-dz.com/api_v2/stopdesks?id_wilaya=${wilayaId}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "X-API-Key": apiKey,
          "X-API-Token": apiToken,
          Accept: "application/json",
        },
      }
    );

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("E-com API error:", res.status, data);

      return NextResponse.json(
        {
          error: "Failed to fetch stopdesks from E-com Delivery",
          details: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET stopdesks ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch stopdesks" },
      { status: 500 }
    );
  }
}

