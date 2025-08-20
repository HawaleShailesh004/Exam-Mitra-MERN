import express from "express";

import  contactMe  from "../controllers/contactController.js";

const router = express.Router();

router.post("/contact", contactMe);

export default router;
