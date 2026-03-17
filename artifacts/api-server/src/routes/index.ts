import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import auditRouter from "./audit";
import adsAuditRouter from "./adsAudit";
import checkoutRouter from "./checkout";
import contactRouter from "./contact";
import serpRouter from "./serp";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inquiriesRouter);
router.use(auditRouter);
router.use(adsAuditRouter);
router.use(checkoutRouter);
router.use(contactRouter);
router.use(serpRouter);

export default router;
