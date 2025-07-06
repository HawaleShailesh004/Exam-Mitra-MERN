import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import dropdownRoutes from "./routes/dropdownRoute.js";
import extractRoutes from "./routes/extractRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/", extractRoutes);
app.use("/", dropdownRoutes);
app.use("/", contactRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
