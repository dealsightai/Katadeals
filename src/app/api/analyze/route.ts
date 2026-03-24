import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { address, price, sqft, bedrooms, bathrooms, notes } = await req.json();

const prompt = `
    You are a real estate investment analyst. Analyze this deal:
    Address: ${address}
    Price: $${price}
    Size: ${sqft} sqft | ${bedrooms}bd / ${bathrooms}ba
    Notes: ${notes}

    Respond with JSON containing exactly these fields:
    - dealScore: number between 1-10
    - recommendation: "BUY", "HOLD", or "PASS"
    - estimatedARV: number (no dollar sign)
    - estimatedMonthlyRent: number (no dollar sign)
    - estimatedCashFlow: number (no dollar sign)
    - capRate: number (percentage like 4.8)
    - positives: array of strings (no dashes or bullets)
    - redFlags: array of strings (no dashes or bullets)
    - summary: string
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const analysis = JSON.parse(response.choices[0].message.content || "{}");

  const session = await getServerSession();
  let user = null;
  if (session?.user?.email) {
    user = await prisma.user.findUnique({ where: { email: session.user.email } });
  }

  if (user) {
    const deal = await prisma.deal.create({
      data: {
        address,
        price: parseFloat(price),
        sqft: sqft ? parseFloat(sqft) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseFloat(bathrooms) : null,
        notes: notes || null,
        analysis,
        userId: user.id,
      },
    });
    return NextResponse.json({ dealId: deal.id, analysis });
  }

  return NextResponse.json({ dealId: null, analysis });
}