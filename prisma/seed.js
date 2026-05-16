import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const companies = [
  { name: "Stripe", description: "Payments infrastructure for the internet", industry: "Fintech", batch: "S10", website: "https://stripe.com", tags: '["payments", "api", "fintech"]' },
  { name: "Airbnb", description: "Vacation rentals, cabins, beach houses, unique homes", industry: "Consumer", batch: "W09", website: "https://airbnb.com", tags: '["travel", "marketplace", "consumer"]' },
  { name: "Coinbase", description: "Buy and sell cryptocurrency", industry: "Crypto", batch: "S12", website: "https://coinbase.com", tags: '["crypto", "exchange", "fintech"]' },
  { name: "Doordash", description: "Food delivery", industry: "Consumer", batch: "S13", website: "https://doordash.com", tags: '["delivery", "food", "marketplace"]' },
  { name: "Instacart", description: "Grocery delivery", industry: "Consumer", batch: "S12", website: "https://instacart.com", tags: '["delivery", "grocery", "marketplace"]' },
  { name: "Rippling", description: "Workforce management system", industry: "SaaS", batch: "W17", website: "https://rippling.com", tags: '["hr", "it", "saas"]' },
  { name: "Brex", description: "Corporate cards and spend management", industry: "Fintech", batch: "Y17", website: "https://brex.com", tags: '["fintech", "cards", "b2b"]' },
  { name: "Gusto", description: "Payroll, benefits, and HR", industry: "SaaS", batch: "W12", website: "https://gusto.com", tags: '["hr", "payroll", "saas"]' },
  { name: "Figma", description: "Collaborative interface design tool", industry: "SaaS", batch: "S12", website: "https://figma.com", tags: '["design", "collaboration", "saas"]' },
  { name: "Checkr", description: "Background checks", industry: "SaaS", batch: "S14", website: "https://checkr.com", tags: '["hr", "api", "saas"]' },
  { name: "Scale AI", description: "Data platform for AI", industry: "AI", batch: "S16", website: "https://scale.com", tags: '["ai", "data", "api"]' },
  { name: "Cruise", description: "Self-driving cars", industry: "AI", batch: "W14", website: "https://getcruise.com", tags: '["ai", "robotics", "transportation"]' },
  { name: "Twitch", description: "Live streaming platform", industry: "Consumer", batch: "W07", website: "https://twitch.tv", tags: '["streaming", "gaming", "consumer"]' },
  { name: "Reddit", description: "Social news aggregation", industry: "Consumer", batch: "S05", website: "https://reddit.com", tags: '["community", "social", "consumer"]' },
  { name: "Dropbox", description: "Cloud storage", industry: "SaaS", batch: "S07", website: "https://dropbox.com", tags: '["storage", "collaboration", "saas"]' },
  { name: "LendingClub", description: "Peer-to-peer lending", industry: "Fintech", batch: "S07", website: "https://lendingclub.com", tags: '["fintech", "lending"]' },
  { name: "OpenSea", description: "NFT marketplace", industry: "Crypto", batch: "W18", website: "https://opensea.io", tags: '["crypto", "nft", "marketplace"]' },
  { name: "Ramp", description: "Corporate cards and spend management", industry: "Fintech", batch: "W20", website: "https://ramp.com", tags: '["fintech", "cards", "b2b"]' },
  { name: "Deel", description: "Global payroll and compliance", industry: "SaaS", batch: "W19", website: "https://deel.com", tags: '["hr", "payroll", "global"]' },
  { name: "Benchling", description: "R&D cloud for the life sciences", industry: "SaaS", batch: "S12", website: "https://benchling.com", tags: '["biotech", "software", "saas"]' },
];

async function main() {
  console.log("Seeding companies...");
  await prisma.company.deleteMany({});
  await prisma.relationship.deleteMany({});

  const createdCompanies = [];
  for (const c of companies) {
    const created = await prisma.company.create({ data: c });
    createdCompanies.push(created);
  }

  console.log("Generating relationships...");
  for (let i = 0; i < createdCompanies.length; i++) {
    for (let j = i + 1; j < createdCompanies.length; j++) {
      const c1 = createdCompanies[i];
      const c2 = createdCompanies[j];
      
      let type = null;
      let weight = 0;

      if (c1.industry === c2.industry) {
        if (c1.industry === "Fintech") {
          type = "competitor";
          weight = 5.0; // Strong push
        } else {
          type = "similar";
          weight = 3.0; // Medium pull
        }
      } else if (c1.batch === c2.batch) {
        type = "same_batch";
        weight = 2.0; // weak pull
      } else {
        const t1 = JSON.parse(c1.tags);
        const t2 = JSON.parse(c2.tags);
        const commonTags = t1.filter(t => t2.includes(t));
        if (commonTags.length > 0) {
          type = "shared_tags";
          weight = 1.0;
        }
      }

      if (type) {
        await prisma.relationship.create({
          data: {
            source_company_id: c1.id,
            target_company_id: c2.id,
            type,
            weight
          }
        });
      }
    }
  }
  console.log("Seed complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
