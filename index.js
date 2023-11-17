const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER, process.env.DB_PASS)


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shpjug3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const menuCollection = client.db("bistroDb").collection("menu");
    const cartCollection = client.db("bistroDb").collection("cart");
    const reviewCollection = client.db("bistroDb").collection("reviews");


    /*menu collection*/
    app.get('/menu', async (req, res) => {
      try {
        const result = await menuCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error)
      }
    })

    /*cart collection*/
    app.get('/cart', async (req, res) => {

      try {
        const userEmail = req.query.email;
        const query = { email: userEmail }
        console.log(query)
        const result = await cartCollection.find(query).toArray();
        res.send(result)
      } catch (error) {
        console.log(error)
      }
    })

    app.post('/cart', async (req, res) => {
      try {
        const item = req.body;
        const result = await cartCollection.insertOne(item)
        res.send(result)
      } catch (error) {
        console.log(error)
      }
    })

    /*review collection*/
    app.get('/reviews', async (req, res) => {
      try {
        const result = await reviewCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error)
      }
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('boss is sitting')
})

app.listen(port, () => {
  console.log(`Bistro boss is sitting on port ${port}`);
})