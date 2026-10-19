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

    const { searchParams } = new URL(request.url);

    const tracking = searchParams.get("tracking");
    const format = searchParams.get("format") || searchParams.get("printFormat") || "10x10";

    if (!tracking || tracking === "null" || tracking === "undefined") {
      return NextResponse.json(
        { error: "Numéro de tracking requis" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://ecom-dz.com/api_v2/colis/${tracking}/bordereau?format=${format}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "X-API-Key": apiKey,
          "X-API-Token": apiToken,
          Accept: "application/json, application/pdf",
        },
      }
    );

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/pdf")) {
      const arrayBuffer = await res.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="bordereau-${tracking}.pdf"`,
        },
      });
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("E-com API error:", res.status, data);

      return NextResponse.json(
        {
          error: "Failed to fetch bordereau from E-com Delivery",
          details: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET BORDEREAU ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to get bordereau" },
      { status: 500 }
    );
  }
}