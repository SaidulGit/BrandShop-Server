const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send('Server site is running')
})

app.listen(port,() =>{
    console.log(`Server site is running on port: ${port}`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2v17pzr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allData = client.db("brandShop").collection("product");
    const cartData = client.db("brandShop").collection("cart");

    app.get("/allproduct",async (req,res)=>{
       const data = allData.find();
       const result = await data.toArray();
       res.send(result);
    })
    app.get("/brand/:brand",async (req,res)=>{
      const brand = req.params.brand;
       const data = allData.find({brand : brand});
       const result = await data.toArray();
       res.send(result);
    })
    app.get("/product/:name",async (req,res)=>{
      const name = req.params.name;
       const data = allData.find({ name : name  });
       const result = await data.toArray();
       res.send(result);
    })

    // cart 
    app.post("/cart",async (req,res)=> {
      const cart = req.body;
      const result = await cartData.insertOne(cart)
      res.send(result)
    })

    app.get("/cartdata", async (req,res)=> {
      const data =  cartData.find()
      const cart = await data.toArray()
      res.send(cart)
    })

    app.delete("/cartdata/:id", async (req,res)=> {
      const data = req.params.id;
      const query = { _id: new ObjectId (data)}
      const result = cartData.deleteOne(query)
      res.send(result);
    })
   
     app.post("/add",async (req,res)=>{
      const data = req.body;
      const result = await allData.insertOne(data);
      res.send(result)
     })

     app.put("/updatedata/:id", async (req,res)=>{
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId (id)}
      const updateUser = {
        $set: {
          name: data.name,
          price: data.price,
          rating: data.rating,
          brand: data.brand,
          type: data.type,
          photourl: data.photoUrl
        }
      };
      const result = await allData.updateOne(filter,updateUser);
      res.send(result);
     })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
