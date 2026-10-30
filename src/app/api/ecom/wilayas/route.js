import { NextResponse } from "next/server";

export async function GET(){


    try {
    const apiKey = process.env.ECOM_API_KEY;
    const apiToken = process.env.ECOM_API_TOKEN;

    if (!apiKey || !apiToken) {
      return NextResponse.json(
        { error: "E-com Delivery credentials are not configured" },
        { status: 500 }
      );
    }

    //import wilayas

    const res= await fetch("https://ecom-dz.com/api_v2/wilayas",{
        method:"GET",
        cache:"no-store",
        headers:{
            "X-API-Key":apiKey,
            "X-API-Token":apiToken,
            "Accept":"application/json",
        },
    })

    const data = await res.json().catch(() => null);
    
     if (!res.ok) {
      console.error("E-com API error:", res.status, data);

      return NextResponse.json(
        {
          error: "Failed to fetch wilayas from E-com Delivery",
          details: data,
        },
        { status: res.status }
      );
    }

   
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("GET WILAYAS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch wilayas" },
      { status: 500 }
    );
  }

}