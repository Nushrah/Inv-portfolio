import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: { passwordHash, name: "Demo User" },
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash,
    },
  });

  const seeds: Array<{
    assetName: string;
    symbol: string;
    assetType: Prisma.InvestmentCreateInput["assetType"];
    quantity: string;
    purchasePrice: string;
    currentPrice: string;
    purchaseDate: Date;
    notes: string;
  }> = [
    {
      assetName: "Apple Inc.",
      symbol: "AAPL",
      assetType: "STOCK",
      quantity: "10",
      purchasePrice: "150",
      currentPrice: "180",
      purchaseDate: new Date("2026-01-10"),
      notes: "Seed: long-term tech",
    },
    {
      assetName: "US Treasury Bond",
      symbol: "USBOND",
      assetType: "BOND",
      quantity: "5",
      purchasePrice: "1000",
      currentPrice: "1020",
      purchaseDate: new Date("2026-01-15"),
      notes: "Seed: fixed income",
    },
    {
      assetName: "Vanguard Mutual Fund",
      symbol: "VFIAX",
      assetType: "MUTUAL_FUND",
      quantity: "20",
      purchasePrice: "400",
      currentPrice: "425",
      purchaseDate: new Date("2026-02-01"),
      notes: "Seed: index fund",
    },
    {
      assetName: "Cash Reserve",
      symbol: "CASH",
      assetType: "CASH",
      quantity: "1",
      purchasePrice: "5000",
      currentPrice: "5000",
      purchaseDate: new Date("2026-02-15"),
      notes: "Seed: cash",
    },
  ];

  for (const s of seeds) {
    const existing = await prisma.investment.findFirst({
      where: { userId: user.id, symbol: s.symbol },
    });
    if (existing) continue;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const inv = await tx.investment.create({
        data: {
          userId: user.id,
          assetName: s.assetName,
          symbol: s.symbol,
          assetType: s.assetType,
          quantity: s.quantity,
          purchasePrice: s.purchasePrice,
          currentPrice: s.currentPrice,
          purchaseDate: s.purchaseDate,
          notes: s.notes,
        },
      });
      await tx.transaction.create({
        data: {
          userId: user.id,
          investmentId: inv.id,
          transactionType: "BUY",
          quantity: s.quantity,
          price: s.purchasePrice,
          transactionDate: s.purchaseDate,
          notes: "Initial purchase (seed)",
        },
      });
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
