const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://Admin:Admin123@cluster0.vxwux.mongodb.net/SearchApp?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

router.get("/test", (req, res) => {
  return res.json({ message: "working" });
});

router.get("/fetch_users", (req, res) => {
  async function fetchUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection = database.collection(`Users`);

      const usersList = await collection.find().toArray();
      res.json({ users: usersList });
    } catch (err) {
      res.json({ error: err.message });
    }
  }
  fetchUsersList();
});

router.get("/fetch_user_conacts_email", (req, res) => {
  async function fetchUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection = database.collection(`UserContacts`);

      const usersContactsEmail = await collection.findOne;
      res.json({ users: usersList });
    } catch (err) {
      res.json({ error: err.message });
    }
  }
  fetchUsersList();
});

router.get("/fetch_user_api_enrichment", (req, res) => {
  async function fetchUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection = database.collection(`SavedUsers`);

      res.json({ users: collection });
    } catch (err) {
      res.json({ error: err.message });
    }
  }
  fetchUsersList();
});

router.get("/fetch_saved_users", (req, res) => {
  async function fetchUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection = database.collection(`SavedUsers`);

      const usersList = await collection.find().toArray();
      res.json({ users: usersList, error: "" });
    } catch (err) {
      res.json({ error: err.message, users: "" });
    }
  }
  fetchUsersList();
});

router.get("/fetch_calls", (req, res) => {
  async function fetchUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection = database.collection(`UserCalls`);

      const usersList = await collection
        .find({ id: req.query.user_id })
        .toArray();
      // console.log("SUCCESS",usersList[0].calls)
      res.json({ calls: usersList[0].calls, error: "" });
    } catch (err) {
      console.log(err.message);
      res.json({ error: err.message, calls: [] });
    }
  }
  fetchUsersList();
});

router.get("/fetch_tasks", (req, res) => {
  async function fetchTasksList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection = database.collection(`UserTasks`);

      const usersList = await collection
        .find({ id: req.query.user_id })
        .toArray();
      //console.log("SUCCESS",usersList[0].calls)
      res.json({ tasks: usersList[0].tasks, error: "" });
    } catch (err) {
      console.log(err.message);
      res.json({ error: err.message, tasks: [] });
    }
  }
  fetchTasksList();
});

router.get("/fetch_email_provider_details", (req, res) => {
  async function fetchEmailProvider() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection = database.collection(`UserEmailSettings`);

      const usersList = await collection
        .find({ id: req.query.user_id })
        .toArray();
      //console.log("SUCCESS",usersList[0].calls)
      res.json({
        email_provider_settings: usersList[0].email_provider_settings,
        error: "",
      });
    } catch (err) {
      console.log(err.message);
      res.json({ error: err.message, email_provider_settings: {} });
    }
  }
  fetchEmailProvider();
});

router.get("/fetch_contact_emails", (req, res) => {
  async function fetchUserEmailContacts() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");
      const query = req.query;
      const collection = database.collection(`UserContacts`);

      const user = await collection.find({ id: query.user_id }).toArray();

      const userContacts = user[0].contacts;

      //console.log(userContacts)
      return res.json({ email_contacts: userContacts, error: "" });
    } catch (err) {
      return res.json({ error: err.message, email_contacts: "" });
    }
  }
  fetchUserEmailContacts();
});

router.get("/fetch_enrich_csv", (req, res) => {
  async function fetchUserEnrichCSV() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");
      const query = req.query;
      const collection = database.collection(`UserEnrichCSV`);

      const user = await collection.find({ id: query.user_id }).toArray();

      const userEnrichCSV = user[0].enrich_csv;

      //console.log(userContacts)
      return res.json({ enrich_csv: userEnrichCSV, error: "" });
    } catch (err) {
      return res.json({ error: err.message, enrich_csv: [] });
    }
  }
  fetchUserEnrichCSV();
});

router.post("/add-user", (req, res) => {
  async function saveUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      //  const collection=database.collection(`Users`)
      const collection1 = database.collection(`SavedUsers`);
      const query = req.body;
      const alreadyExists = await collection1.count(query, { limit: 1 });
      if (alreadyExists == 1) {
        return res.json({ error: "This user is already saved!", refNo: "" });
      }
      //  const userData=await collection.find(query)
      const result = await collection1.insertOne(query);
      return res.json({ refNo: result.insertedId, error: "" });
    } catch (err) {
      return res.json({ error: err.message, refNo: "" });
    }
  }
  saveUsersList();
});

router.post("/add-user-contact-email", (req, res) => {
  async function saveUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      //  const collection=database.collection(`Users`)
      const collection1 = database.collection(`UserContacts`);

      const query = req.body;
      const contactEmailToBeAdded = query.email_adding;

      const userContacts = (await collection1.findOne({ id: query.user_id }))
        .contacts;

      const countOccurences = userContacts.reduce(
        (a, v) => (v == contactEmailToBeAdded ? a + 1 : a),
        0
      );

      if (countOccurences > 0) {
        return res.json({ error: "Contact already exists!", refNo: "" });
      }

      const tempDelete = await collection1.findOneAndDelete({
        id: query.user_id,
      });
      const newContacts = [...userContacts, contactEmailToBeAdded];
      const result = await collection1.insertOne({
        id: query.user_id,
        contacts: newContacts,
      });
      return res.json({ refNo: result.insertedId, error: "" });
    } catch (err) {
      return res.json({ error: err.message, refNo: "" });
    }
  }
  saveUsersList();
});

router.post("/add-call", (req, res) => {
  async function saveUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      //  const collection=database.collection(`Users`)
      const collection1 = database.collection(`UserCalls`);
      const query = req.body;
      const userCalls = await collection1.findOneAndUpdate(
        { id: query.user_id },
        { $push: { calls: query.callInfo } },
        { upsert: true }
      );
    } catch (err) {
      console.log(err.message);
      return res.json({ error: err.message, refNo: "" });
    }
  }
  saveUsersList();
});

router.post("/add-task", (req, res) => {
  async function saveTask() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      //  const collection=database.collection(`Users`)
      const collection1 = database.collection(`UserTasks`);
      const query = req.body;
      const userCalls = await collection1.findOneAndUpdate(
        { id: query.user_id },
        { $push: { tasks: query.taskInfo } },
        { upsert: true }
      );
    } catch (err) {
      console.log(err.message);
      return res.json({ error: err.message, refNo: "" });
    }
  }
  saveTask();
});

router.post("/set-email-provider", (req, res) => {
  async function setEmailProvider() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      //  const collection=database.collection(`Users`)
      const collection1 = database.collection(`UserEmailSettings`);
      const query = req.body;
      const userEmail = await collection1.findOneAndUpdate(
        { id: query.user_id },
        { $set: { email_provider_settings: query.email_provider_settings } },
        { upsert: true }
      );
      return res.json({ error: "", refNo: "SUCCESS" });
    } catch (err) {
      console.log(err.message);
      return res.json({ error: err.message, refNo: "" });
    }
  }
  setEmailProvider();
});

router.post("/delete-user", (req, res) => {
  async function saveUsersList() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      const collection1 = database.collection(`SavedUsers`);
      const query = req.body;

      const result = await collection1.deleteOne(query);
      return res.json({ refNo: result.insertedId, error: "" });
    } catch (err) {
      return res.json({ error: err.message, refNo: "" });
    }
  }
  saveUsersList();
});

router.post("/add-enrich-csv", (req, res) => {
  async function addEnrichCSV() {
    try {
      await client.connect();
      const database = client.db("SearchSAAS");

      //  const collection=database.collection(`Users`)
      const collection1 = database.collection(`UserEnrichCSV`);
      const query = req.body;
      const userAddEnrichCSV = await collection1.findOneAndUpdate(
        { id: query.user_id },
        { $push: { enrich_csv: query.enrich_csv } },
        { upsert: true }
      );
      return res.json({ error: "", refNo: "SUCCESS" });
    } catch (err) {
      console.log(err.message);
      return res.json({ error: err.message, refNo: "" });
    }
  }
  addEnrichCSV();
});

module.exports = router;
