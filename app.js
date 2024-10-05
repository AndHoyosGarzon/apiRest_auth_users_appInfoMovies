import express from "express";
import dotenv from "dotenv";
import router from "./routes/user.routes.js";
import connectionDB from "./db/connectionDB.js";
import cors from "cors";

const app = express();
dotenv.config();

app.disable("x-powered-by");

app.use(cors());

app.use(express.json());

app.use("/api/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectionDB();
  console.log(`Server listening on port http://localhost:${PORT}`);
});
