import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    const relationships = await prisma.relationship.findMany();

    const nodes = companies.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      industry: c.industry,
      batch: c.batch,
      website: c.website,
      tags: c.tags,
      val: 2,
    }));

    const links = relationships.map(r => ({
      source: r.source_company_id,
      target: r.target_company_id,
      type: r.type,
      weight: r.weight,
    }));

    return NextResponse.json({ nodes, links });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
