import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      wilayaDisplay,
      commune,
      deliveryTypeLabel,
      shippingFee = 0,
      grandTotal = 0,
      address,
      note,
      product,
      cart,
      quantity = 1,
    } = body;

    const token =
      process.env.TELEGRAM_BOT_TOKEN ||
      process.env.API_KEY ||
      process.env.VITE_API_KEY;

    const chatId =
      process.env.TELEGRAM_CHAT_ID ||
      process.env.CHAT_ID ||
      process.env.VITE_CHAT_ID;

    if (!token || !chatId) {
      console.error("❌ Telegram tokens are missing in environment variables!");
      return NextResponse.json(
        {
          error:
            "Telegram credentials not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local",
        },
        { status: 500 }
      );
    }

    const cleanPhone = (phone || "").replace(/\s+/g, "");
    const formattedPhoneForWa = cleanPhone.startsWith("0")
      ? "213" + cleanPhone.slice(1)
      : cleanPhone;

    let itemsInfo = "";
    if (product) {
      itemsInfo = `📦 <b>Produit :</b> ${product.name}\n🔢 <b>Quantité :</b> ${quantity} pièce(s)\n💵 <b>Prix unitaire :</b> ${Number(product.price || 0).toLocaleString()} DZD`;
    } else if (cart && cart.length > 0) {
      const totalCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);
      itemsInfo =
        `📦 <b>Produits commandés (${totalCount} pièce(s)) :</b>\n` +
        cart
          .map(
            (item, idx) =>
              `  ${idx + 1}. ${item.name} × ${item.quantity} (${(
                (item.price || 0) * (item.quantity || 1)
              ).toLocaleString()} DZD)`
          )
          .join("\n");
    } else {
      itemsInfo = `📦 <b>Produit :</b> Commande boutique`;
    }

    const telegramMessage = `
🛒 <b>Nouvelle commande sur elboutiqa !</b>
━━━━━━━━━━━━━━━━━━
${itemsInfo}

👤 <b>Nom et Prénom :</b> ${fullName ? fullName.trim() : ""}
📞 <b>Téléphone :</b> <code>${cleanPhone}</code>
📍 <b>Wilaya :</b> ${wilayaDisplay || "Non spécifiée"}
🏛️ <b>Commune :</b> ${commune ? commune.trim() : "Non spécifiée"}
🚚 <b>Mode de livraison :</b> ${deliveryTypeLabel} (${Number(shippingFee).toLocaleString()} DZD)
🏡 <b>Adresse :</b> ${address ? address.trim() : "Non spécifiée"}
📝 <b>Notes :</b> ${note ? note.trim() : "Aucune"}
━━━━━━━━━━━━━━━━━━
💰 <b>Prix Total à payer :</b> <b>${Number(grandTotal).toLocaleString()} DZD</b>
    `.trim();

    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: "💬 Contacter sur WhatsApp",
            url: `https://wa.me/${formattedPhoneForWa}?text=${encodeURIComponent(
              `Bonjour ${fullName ? fullName.trim() : ""}, nous vous contactons depuis elboutiqa pour confirmer votre commande.`
            )}`,
          },
        ],
      ],
    };

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const telegramRes = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    });

    const telegramData = await telegramRes.json().catch(() => ({}));

    if (!telegramRes.ok || !telegramData.ok) {
      console.error("❌ Telegram API Error:", telegramData);
      return NextResponse.json(
        {
          error: telegramData.description || "Failed to send message to Telegram",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Order API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
