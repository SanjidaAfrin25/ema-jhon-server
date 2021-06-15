const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const port=4001;


const app = express();
app.use(bodyParser.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vixpe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
 
  app.post('/addProduct',(req,res)=>{
      const product=req.body;
      console.log(product);
    collection.insertOne(product)
    .then(result=>{
        console.log(result)
        console.log(result.insertedCount);
        res.send(result.insertedCount)
   })

  })

  app.get('/product',(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
})
  
  
});

app.get('/singleproduct:key',(req,res)=>{
  collection.find({key:req.params.key})
  .toArray((err,documents)=>{
    res.send(documents[0]);
})


});

app.post('/productByKeys',(req,res)=>{
  const productKeys=req.body
  collection.find({key:{$in:productKeys}})
  .toArray((err,documents)=>{
    res.send(documents);
})


});



app.post('/addOrders',(req,res)=>{
  const orders=req.body;
  console.log(orders);
ordersCollection.insertOne(orders)
.then(result=>{
    
    res.send(result.insertedCount>0)
})

})
})


// respond with "hello world" when a GET request is made to the homepage

app.listen(process.env.PORT||port);