import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// GET /api/deals — load all deals for the logged-in user
export async function GET() {
const session = await getServerSession(authOptions);
if (!session?.user?.email) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const deals = await prisma.deal.findMany({
where: { user: { email: session.user.email } },
orderBy: { createdAt: "desc" },
});
return NextResponse.json(deals);
}
// POST /api/deals — save a deal manually
export async function POST(req: Request) {
const session = await getServerSession(authOptions);
if (!session?.user?.email) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const { address, price, sqft, bedrooms, bathrooms, analysis, score } =
await req.json();
const deal = await prisma.deal.create({
data: {
address,
price: Number(price),sqft: sqft ? Number(sqft) : null,
bedrooms: bedrooms ? Number(bedrooms) : null,
bathrooms: bathrooms ? Number(bathrooms) : null,
analysis,
score: score ? Number(score) : null,
user: { connect: { email: session.user.email } },
},
});
return NextResponse.json(deal, { status: 201 });
}
// DELETE /api/deals?id=xxx — delete one deal
export async function DELETE(req: Request) {
const session = await getServerSession(authOptions);
if (!session?.user?.email) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const { searchParams } = new URL(req.url);
const id = searchParams.get("id");
if (!id) {
return NextResponse.json({ error: "Missing id" }, { status: 400 });
}
// Safety check — only delete if it belongs to this user
const deal = await prisma.deal.findFirst({
where: { id, user: { email: session.user.email } },
});
if (!deal) {
return NextResponse.json({ error: "Not found" }, { status: 404 });
}
await prisma.deal.delete({ where: { id } });
return NextResponse.json({ success: true });
}
