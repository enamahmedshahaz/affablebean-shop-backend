// In routes/purchase.js
import express from "express";
const router = express.Router();

import db from "../db/connection.js";

// Purchase endpoint

router.post("/", async (req, res) => {

    console.log(req.body);
    
    const { productId, productName, price, buyerName, buyerEmail, phone } = req.body;

    if (!productId || !buyerName || !buyerEmail || !phone) {
        return res.status(400).send({ error: "All fields are required." });
    }

    try {
        const purchaseCollection = db.collection("purchases");
        const purchaseRecord = {
            productId,
            productName,
            price,
            buyerName,
            buyerEmail,
            phone,
            purchaseDate: new Date()
        };

        const result = await purchaseCollection.insertOne(purchaseRecord);
        if (result.insertedId) {
            return res.status(200).send({ message: "Purchase successful!" });
        }
    } catch (error) {
        console.error("Error processing purchase:", error);
        res.status(500).send({ error: "Could not complete purchase." });
    }
});

export default router;
