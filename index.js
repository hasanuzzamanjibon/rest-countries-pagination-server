const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
// var allowlist = ["http://localhost:5173/"];

app.use(cors());

const uri =
  "mongodb+srv://fakecountry:fakecountry@cluster0.oxnofiz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // database collection

    const CountryCollection = client.db("Country").collection("CountryDB");

    app.get("/allCountries", async (req, res) => {
      const result = await CountryCollection.countDocuments({ region: "Oceania" });
      res.send({ totalProducts: result });
    });

    // get all countries
    app.get("/api/allcountries", async (req, res) => {
      const page = parseInt(req?.query?.page);
      const limit = parseInt(req?.query?.items);
      console.log(page, limit);
      const skip = page * limit;

      const result = await CountryCollection.find({ region: "Oceania" })
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send(result);
    });
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.log(err);
  }
};
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("welcome to fake country server");
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
