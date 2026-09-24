import { Router } from "express";
import { getStaffUsers } from "../controllers/userController.js";

const router = Router();

router.get("/staff", getStaffUsers);

export default router;
