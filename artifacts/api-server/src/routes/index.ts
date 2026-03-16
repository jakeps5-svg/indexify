import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import auditRouter from "./audit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inquiriesRouter);
router.use(auditRouter);

export default router;
