import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { searchBooks } from "@/lib/books";
export async function GET(request: NextRequest) {
    const q = request.nextUrl.searchParams.get("q") || "";
    const limit = Number(request.nextUrl.searchParams.get("limit") || 8);
    try {
        const results = await searchBooks(q, Math.min(limit, 20));
        return NextResponse.json({ results });
    }
    catch (e) {
        return NextResponse.json({ results: [], error: String(e) }, { status: 500 });
    }
}
