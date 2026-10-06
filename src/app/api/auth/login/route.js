import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // التحقق من البيانات
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 }
      );
    }

    // بيانات الدخول مؤقتًا
    // سننقلها لاحقًا إلى .env.local أو Database
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }

    // إنشاء JWT
    const token = await createToken({
      username,
      role: "admin",
    });

    // إنشاء response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    // وضع JWT داخل HttpOnly Cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}