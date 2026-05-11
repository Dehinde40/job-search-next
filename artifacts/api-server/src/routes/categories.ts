import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, jobsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        icon: categoriesTable.icon,
        jobCount: sql<number>`cast(count(${jobsTable.id}) as int)`,
      })
      .from(categoriesTable)
      .leftJoin(jobsTable, eq(jobsTable.categoryId, categoriesTable.id))
      .groupBy(categoriesTable.id);

    res.json(categories);
  } catch (err) {
    req.log.error({ err }, "Failed to list categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
