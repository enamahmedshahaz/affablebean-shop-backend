import express from "express";
import cors from "cors";
import users from "./routes/user.js";

import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", users); // Mount the user routes at /user



// start the Express server
app.listen(PORT, () => {
  console.log(`AffableBean Server listening on port ${PORT}`);
});

