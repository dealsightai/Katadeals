import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(req: Request) {
  const { address, price, sqft, bedrooms, bathrooms, notes } = await req.json();

  const prompt = `You are an expert real estate investment analyst with deep knowledge of financing, construction, zoning, and exit strategies. Analyze this deal comprehensively:

Address: ${address}
Asking Price: $${price}
Size: ${sqft || "Unknown"} sqft | ${bedrooms || "Unknown"} bed / ${bathrooms || "Unknown"} bath
Additional Notes: ${notes || "None"}

Respond with a JSON object containing ALL of these fields:

{
  "dealScore": (number 1-10),
  "recommendation": ("BUY", "HOLD", or "PASS"),
  "summary": (2-3 sentence overview of the deal),

  "propertyDetails": {
    "estimatedBedrooms": (number or null if provided),
    "estimatedBathrooms": (number or null if provided),
    "estimatedSqft": (number or null if provided),
    "estimatedLotSize": (string like "0.25 acres" - estimate based on area),
    "propertyType": (string like "Single Family", "Multi-Family", "Land", "Commercial"),
    "yearBuiltEstimate": (string like "1970s" or "Unknown"),
    "neighborhood": (string - brief description of area)
  },

  "valuationAnalysis": {
    "estimatedARV": (number - after repair value),
    "estimatedAsIsValue": (number),
    "estimatedMonthlyRent": (number),
    "estimatedCashFlow": (number - monthly),
    "capRate": (number like 5.2),
    "cashOnCashReturn": (number - percentage),
    "rentToPrice": (number - percentage)
  },

  "rehabAnalysis": {
    "cosmetic": {
      "description": "Light cosmetic updates - paint, fixtures, landscaping, minor repairs",
      "estimatedCost": (number),
      "timelineWeeks": (number),
      "arvAfterRehab": (number)
    },
    "moderate": {
      "description": "Kitchen/bath remodel, flooring, some structural, updated systems",
      "estimatedCost": (number),
      "timelineWeeks": (number),
      "arvAfterRehab": (number)
    },
    "fullGut": {
      "description": "Complete renovation - new layout, all systems, structural work",
      "estimatedCost": (number),
      "timelineWeeks": (number),
      "arvAfterRehab": (number)
    }
  },

  "financingOptions": [
    {
      "type": "Conventional",
      "downPayment": (string like "20-25%"),
      "interestRate": (string like "6.5-7.5%"),
      "term": (string like "30 years"),
      "bestFor": (string - one line description),
      "monthlyPayment": (number - estimated)
    },
    {
      "type": "FHA",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "FHA 203K",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "VA Loan",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "DSCR Loan",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "Owner Financing",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "Subject To",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "Seller Carryback",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "JV Equity Split",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    },
    {
      "type": "Syndication Partnership",
      "downPayment": (string),
      "interestRate": (string),
      "term": (string),
      "bestFor": (string),
      "monthlyPayment": (number)
    }
  ],

  "developmentOptions": [
    {
      "option": (string - e.g. "ADU Addition", "Multifamily Expansion", "Mixed-Use Conversion", "Storage Rentals", "Truck Parking", "Franchise Development"),
      "description": (string),
      "estimatedCost": (number),
      "estimatedRevenue": (number - annual),
      "timelineMonths": (number),
      "zoningNotes": (string - what zoning changes may be needed based on typical rules in this area)
    }
  ],

  "constructionEstimate": {
    "totalRehabCost": (number - for moderate rehab),
    "costPerSqft": (number),
    "timelineWeeks": (number),
    "stabilizedMonthlyIncome": (number),
    "annualOperatingIncome": (number),
    "operatingExpenses": (number - annual)
  },

  "exitStrategies": [
    {
      "strategy": (string - e.g. "Fix and Flip", "Buy and Hold Rental", "BRRRR", "Wholesale", "Lease Option", "1031 Exchange", "Seller Finance to Buyer", "Short-Term Rental/Airbnb"),
      "projectedProfit": (number),
      "timelineMonths": (number),
      "riskLevel": ("Low", "Medium", or "High"),
      "description": (string)
    }
  ],

  "positives": [(array of strings - key advantages of this deal)],
  "redFlags": [(array of strings - key risks and concerns)],

  "marketInsights": {
    "areaGrowthTrend": (string - "Growing", "Stable", or "Declining"),
    "demandLevel": (string - "High", "Medium", or "Low"),
    "rentGrowthProjection": (string like "3-5% annually"),
    "keyFactors": [(array of strings - 2-3 market factors)]
  }
}

Provide realistic estimates based on the address location and current market conditions. Include at least 3 development options relevant to this property. Include at least 5 exit strategies. All numbers should be realistic for the market area.`;

  try {
    const openai = getOpenAI();
const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");

    const session = await getServerSession(authOptions);
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
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}