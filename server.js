import express from "express";
import cors from "cors";
import users from "./routes/user.js";
import categories from "./routes/category.js";
import products from "./routes/product.js";
import purchase from "./routes/purchase.js";



import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", users); // Mount the user routes at /user
app.use("/category", categories); // Mount the category routes at /category
app.use("/product", products); 
app.use("/purchase", purchase); 




// start the Express server
app.listen(PORT, () => {
  console.log(`AffableBean Server listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send(`AffableBean server is running on port: ${PORT} ...`);
});