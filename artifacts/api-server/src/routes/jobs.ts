import { Router } from "express";
import { db } from "@workspace/db";
import { jobsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, sql, desc } from "drizzle-orm";
import {
  ListJobsQueryParams,
  CreateJobBody,
  GetJobParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/jobs", async (req, res) => {
  const parsed = ListJobsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { keyword, location, categoryId, type, page = 1, limit = 10 } = parsed.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (keyword) conditions.push(ilike(jobsTable.title, `%${keyword}%`));
  if (location) conditions.push(ilike(jobsTable.location, `%${location}%`));
  if (categoryId != null) conditions.push(eq(jobsTable.categoryId, categoryId));
  if (type) conditions.push(eq(jobsTable.type, type));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  try {
    const [jobs, countResult] = await Promise.all([
      db
        .select({
          id: jobsTable.id,
          title: jobsTable.title,
          company: jobsTable.company,
          companyLogo: jobsTable.companyLogo,
          location: jobsTable.location,
          type: jobsTable.type,
          description: jobsTable.description,
          requirements: jobsTable.requirements,
          salary: jobsTable.salary,
          categoryId: jobsTable.categoryId,
          featured: jobsTable.featured,
          applicants: jobsTable.applicants,
          postedAt: jobsTable.postedAt,
          category: {
            id: categoriesTable.id,
            name: categoriesTable.name,
            icon: categoriesTable.icon,
          },
        })
        .from(jobsTable)
        .leftJoin(categoriesTable, eq(jobsTable.categoryId, categoriesTable.id))
        .where(whereClause)
        .orderBy(desc(jobsTable.featured), desc(jobsTable.postedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(jobsTable)
        .where(whereClause),
    ]);

    res.json({
      jobs,
      total: countResult[0]?.count ?? 0,
      page,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list jobs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/jobs/stats", async (req, res) => {
  try {
    const [totalResult, byCategory, byType] = await Promise.all([
      db.select({ count: sql<number>`cast(count(*) as int)` }).from(jobsTable),
      db
        .select({
          categoryId: categoriesTable.id,
          name: categoriesTable.name,
          count: sql<number>`cast(count(${jobsTable.id}) as int)`,
        })
        .from(categoriesTable)
        .leftJoin(jobsTable, eq(jobsTable.categoryId, categoriesTable.id))
        .groupBy(categoriesTable.id, categoriesTable.name),
      db
        .select({
          type: jobsTable.type,
          count: sql<number>`cast(count(*) as int)`,
        })
        .from(jobsTable)
        .groupBy(jobsTable.type),
    ]);

    res.json({
      totalJobs: totalResult[0]?.count ?? 0,
      byCategory,
      byType,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get job stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/jobs/featured", async (req, res) => {
  try {
    const jobs = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        company: jobsTable.company,
        companyLogo: jobsTable.companyLogo,
        location: jobsTable.location,
        type: jobsTable.type,
        description: jobsTable.description,
        requirements: jobsTable.requirements,
        salary: jobsTable.salary,
        categoryId: jobsTable.categoryId,
        featured: jobsTable.featured,
        applicants: jobsTable.applicants,
        postedAt: jobsTable.postedAt,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          icon: categoriesTable.icon,
        },
      })
      .from(jobsTable)
      .leftJoin(categoriesTable, eq(jobsTable.categoryId, categoriesTable.id))
      .where(eq(jobsTable.featured, true))
      .orderBy(desc(jobsTable.postedAt))
      .limit(6);

    res.json(jobs);
  } catch (err) {
    req.log.error({ err }, "Failed to get featured jobs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/jobs/:id", async (req, res) => {
  const parsed = GetJobParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid job ID" });
    return;
  }

  try {
    const [job] = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        company: jobsTable.company,
        companyLogo: jobsTable.companyLogo,
        location: jobsTable.location,
        type: jobsTable.type,
        description: jobsTable.description,
        requirements: jobsTable.requirements,
        salary: jobsTable.salary,
        categoryId: jobsTable.categoryId,
        featured: jobsTable.featured,
        applicants: jobsTable.applicants,
        postedAt: jobsTable.postedAt,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          icon: categoriesTable.icon,
        },
      })
      .from(jobsTable)
      .leftJoin(categoriesTable, eq(jobsTable.categoryId, categoriesTable.id))
      .where(eq(jobsTable.id, parsed.data.id));

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json(job);
  } catch (err) {
    req.log.error({ err }, "Failed to get job");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/jobs", async (req, res) => {
  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [job] = await db.insert(jobsTable).values(parsed.data).returning();
    res.status(201).json(job);
  } catch (err) {
    req.log.error({ err }, "Failed to create job");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
