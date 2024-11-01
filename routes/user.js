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

  let collection = await db.collection("users");

  // if query email is provided
  if (req.query.email) {
    const email = req.query.email;
    const user = await collection.findOne({ email: email });
    if (user) {
      res.send(user).status(200);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  }

});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    let newDocument = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      profilePhotoUrl: req.body.profilePhotoUrl,
      role: req.body.role,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you update a record by id.
router.patch("/changeRole/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const role = req.query.role;
    const newRole = role === 'admin' ? 'user' : 'admin';
    const updates = {
      $set: {
        role: newRole
      },
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("users");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});


//API to check if a email is admin user

router.get("/checkAdmin/:email", async (req, res) => {

  try {
    let collection = await db.collection("users");
    
    const email = req.params.email;
    const query = { email: email };

    const user = await collection.findOne(query);

    let adminStatus = false;

    if (user) {
      adminStatus = user?.role === 'admin';

      res.send({ adminStatus }).status(200);
    } else {
      res.status(404).json({ message: "User with email not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while checking admin");
  }
});


export default router;