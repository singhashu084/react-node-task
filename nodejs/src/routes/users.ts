import express, { Router } from "express";
import { getAllUsers, signin, signup } from "../controllers/user";

const router: Router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/", getAllUsers);

export default router;
