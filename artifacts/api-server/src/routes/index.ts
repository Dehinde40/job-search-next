import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import categoriesRouter from "./categories";

const router: IRouter = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(categoriesRouter);

export default router;
