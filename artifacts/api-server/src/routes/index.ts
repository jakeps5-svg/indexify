import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import auditRouter from "./audit";
import adsAuditRouter from "./adsAudit";
import checkoutRouter from "./checkout";
import contactRouter from "./contact";
import serpRouter from "./serp";
import bookingRouter from "./booking";
import authRouter from "./auth";
import portalRouter from "./portal";
import adminRouter from "./admin";
import googleAdsRouter from "./googleAds";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inquiriesRouter);
router.use(auditRouter);
router.use(adsAuditRouter);
router.use(checkoutRouter);
router.use(contactRouter);
router.use(serpRouter);
router.use(bookingRouter);
router.use(authRouter);
router.use(portalRouter);
router.use(adminRouter);
router.use(googleAdsRouter);

export default router;
