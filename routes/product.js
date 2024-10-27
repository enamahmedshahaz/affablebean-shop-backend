import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
    let collection = await db.collection("products");
    let results = await collection.find().sort({ date_create: -1 }).toArray();
    res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
    let collection = await db.collection("products");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
    try {
        let newDocument = {
            name: req.body.name,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            rating: req.body.rating,
            category_id: req.body.category_id,
            date_create: req.body.date_create,
        };

        let collection = await db.collection("products");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding product");
    }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {

    console.log('Product id -', req.params.id);

    try {
        const query = { _id: new ObjectId(req.params.id) };

        const updates = {
            $set: {
                name: req.body.name,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                rating: req.body.rating,
                category_id: req.body.category_id,
                date_create: req.body.date_create
            },
        };
        
        let collection = await db.collection("products");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating product");
    }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("products");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});

export default router;