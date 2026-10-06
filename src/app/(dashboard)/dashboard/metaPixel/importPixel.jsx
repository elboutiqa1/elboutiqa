"use server";

import connectDB from "@/lib/mongodb";
import Pixel from "@/models/metaPixel";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";

export async function importPixel(formData) {
  try {
    await connectDB();
    
    const pixelId = formData.get("pixelId")?.toString().trim();
    const isActive = formData.get("isActive") === "true";

    if (!pixelId) {
      return { success: false, message: "Veuillez entrer votre Meta Pixel" };
    }

    if (!/^\d+$/.test(pixelId)) {
      return { success: false, message: "L'identifiant Meta Pixel est invalide" };
    }

    if(pixelId.length <15){
      return { success: false, message: "L'identifiant Meta Pixel est court" };
    }

    await Pixel.findOneAndUpdate(
      {},
      { $set: { pixelId, isActive } },
      { upsert: true, returnDocument: "after" }
    );

    return { success: true, message: "Meta Pixel enregistré avec succès" };
  } catch (error) {
    console.error("PIXEL ERROR:", error);
    return { success: false, message: "Une erreur est survenue" };
  }
}


export async function testPixelConnection(pixelId, accessToken) {
  try {
    pixelId = pixelId?.toString().trim();
    accessToken = accessToken?.toString().trim();

    if (!pixelId) {
      return { success: false, message: "Veuillez entrer votre Meta Pixel" };
    }

    if (!/^\d+$/.test(pixelId)) {
      return { success: false, message: "L'identifiant Meta Pixel est invalide" };
    }

    if (!accessToken) {
      return { success: false, message: "Veuillez entrer votre Access Token" };
    }

    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
   
          ...(process.env.META_TEST_EVENT_CODE && {
            test_event_code: process.env.META_TEST_EVENT_CODE,
          }),
          data: [
            {
              event_name: "TestEvent",
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website",
              event_source_url: process.env.NEXT_PUBLIC_SITE_URL,
              user_data: {
                client_user_agent: "connection-test",
              },
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
   
      console.error("META API ERROR:", data?.error?.message);
      return {
        success: false,
        message: data?.error?.message || "Impossible de se connecter à Meta",
      };
    }

    return { success: true, message: "Connexion à Meta Pixel réussie" };
  } catch (error) {
    console.error("TEST PIXEL ERROR:", error.message);
    return { success: false, message: "Erreur lors du test de connexion" };
  }
}



export async function getPixel() {
  try {
    await connectDB();

    const pixel = await Pixel.findOne({}).lean();

    return {
      success: true,
      pixelId: pixel?.pixelId || "",
      isActive: pixel?.isActive ?? true,
    };
  } catch (error) {
    console.error("GET PIXEL ERROR:", error.message);
    return { success: false, pixelId: "", isActive: true };
  }
}