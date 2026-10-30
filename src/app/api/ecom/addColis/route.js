import { NextResponse } from "next/server";

function normalizePhone(phone) {
  if (!phone) return "";
  let clean = String(phone).replace(/[\s\-.()]/g, "");
  if (clean.startsWith("+213")) {
    clean = "0" + clean.slice(4);
  } else if (clean.startsWith("00213")) {
    clean = "0" + clean.slice(5);
  } else if (clean.startsWith("213") && clean.length > 9) {
    clean = "0" + clean.slice(3);
  } else if (/^[567]\d{8}$/.test(clean)) {
    clean = "0" + clean;
  }
  return clean.slice(0, 25);
}

function formatApiError(data) {
  if (!data) return "Échec de l'enregistrement du colis auprès d'E-com Delivery";

  if (typeof data === "string") return data;

  if (data.error) {
    if (typeof data.error === "string") return data.error;

    const msg = data.error.message || "Erreur de validation";
    if (Array.isArray(data.error.details) && data.error.details.length > 0) {
      const detailsStr = data.error.details
        .map((d) => {
          if (d.champ && d.raison) return `${d.champ}: ${d.raison}`;
          if (typeof d === "string") return d;
          return JSON.stringify(d);
        })
        .join("; ");
      return `${msg}: ${detailsStr}`;
    }
    return msg;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return "Erreur lors de la communication avec E-com Delivery";
}

export async function POST(request) {
  try {
    const apiKey = process.env.ECOM_API_KEY;
    const apiToken = process.env.ECOM_API_TOKEN;

    if (!apiKey || !apiToken) {
      return NextResponse.json(
        { success: false, error: "E-com Delivery credentials are not configured" },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Données de colis invalides" },
        { status: 400 }
      );
    }

    // E-com API attend un tableau de 1 à 100 colis
    const rawList = Array.isArray(body) ? body : [body];

    if (rawList.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun colis fourni" },
        { status: 400 }
      );
    }

    if (rawList.length > 100) {
      return NextResponse.json(
        { success: false, error: "Maximum 100 colis par requête" },
        { status: 422 }
      );
    }

    const colisArray = rawList.map((item) => {
      const isStopdesk = Number(item.stopdesk) === 1 ? 1 : 0;

      const colis = {
        nom_complet: String(item.nom_complet || "").trim().slice(0, 60),
        mobile_1: normalizePhone(item.mobile_1),
        id_wilaya: parseInt(item.id_wilaya, 10),
        quantite: Math.max(1, parseInt(item.quantite, 10) || 1),
        total: item.total === "" || isNaN(Number(item.total)) ? 0 : Number(item.total),
        stopdesk: isStopdesk,
        echange: Number(item.echange) === 1 ? 1 : 0,
        confirmee: Number(item.confirmee) === 1 ? 1 : 0,
      };

      if (isStopdesk === 1) {
        colis.code_stopdesk = String(item.code_stopdesk || "").trim().slice(0, 10);
      } else {
        colis.commune = String(item.commune || "").trim().slice(0, 50);
      }

      if (item.ref_article && String(item.ref_article).trim()) {
        colis.ref_article = String(item.ref_article).trim().slice(0, 64);
      } else if (item.article && String(item.article).trim()) {
        colis.article = String(item.article).trim().slice(0, 255);
      }

      const mobile2 = normalizePhone(item.mobile_2);
      if (mobile2) {
        colis.mobile_2 = mobile2;
      }

      const adresse = String(item.adresse || "").trim();
      if (adresse) {
        colis.adresse = adresse.slice(0, 100);
      }

      const note = String(item.note_fournisseur || "").trim();
      if (note) {
        colis.note_fournisseur = note.slice(0, 255);
      }

      const idExt = String(item.id_externe || "").trim();
      if (idExt) {
        colis.id_externe = idExt.slice(0, 20);
      }

      return colis;
    });

    const res = await fetch("https://ecom-dz.com/api_v2/colis", {
      method: "POST",
      cache: "no-store",
      headers: {
        "X-API-Key": apiKey,
        "X-API-Token": apiToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(colisArray),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("E-com addColis API error:", res.status, data);
      const errorMessage = formatApiError(data);

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: data,
        },
        { status: res.status }
      );
    }

    // Réponse Best-effort HTTP 201 avec éventuels échecs par ligne
    if (data && Array.isArray(data.resultats)) {
      const failed = data.resultats.find((r) => r.ok === false);
      if (failed) {
        console.error("E-com row-level error:", failed);
        let rowErrMsg = failed.erreur || failed.code || "Erreur lors de la création du colis";
        if (failed.code === "total_insuffisant" && failed.details?.total_minimum) {
          rowErrMsg = `Total minimum requis : ${failed.details.total_minimum} DA pour cette wilaya`;
        }
        return NextResponse.json(
          {
            success: false,
            error: rowErrMsg,
            code: failed.code,
            details: failed,
            data,
          },
          { status: 422 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("POST addColis ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create colis" },
      { status: 500 }
    );
  }
}

