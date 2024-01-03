const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());

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

    // get all countries
    app.get("/api/allcountries", async (req, res) => {
      let region = req.query?.region;
      let subRegion = req.query?.subregion;
      const page = parseInt(req.query?.page) - 1 || 0;
      const limit = parseInt(req.query?.items);
      const skip = page * limit;
      let query = {};
      if (region) {
        query = { region: region };
        const totalProducts = await CountryCollection.countDocuments(query);
        const result = await CountryCollection.find(query).skip(skip).limit(limit).toArray();
        const regionResult = await CountryCollection.find().toArray();
        res.send({ totalProducts, regionResult, result });
      } else if (subRegion) {
        const totalProducts = await CountryCollection.countDocuments({
          subregion: { $regex: subRegion, $options: "i" },
        });
        const result = await CountryCollection.find({
          subregion: { $regex: subRegion, $options: "i" },
        })
          .skip(skip)
          .limit(limit)
          .toArray();
        const regionResult = await CountryCollection.find().toArray();
        res.send({ totalProducts, regionResult, result });
      } else {
        const totalProducts = await CountryCollection.countDocuments();
        const result = await CountryCollection.find({}).skip(skip).limit(limit).toArray();
        const regionResult = await CountryCollection.find().toArray();
        res.send({ totalProducts, regionResult, result });
      }
    });
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.error(err);
  }
};
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("welcome to fake country server");
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
