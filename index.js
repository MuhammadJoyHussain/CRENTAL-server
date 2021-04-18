const express = require('express');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express()

app.use(express.json());
app.use(cors());

const port = 4000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9eao.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const reviewCollection = client.db("rentACar").collection("reviews");
  const orderCollection = client.db("rentACar").collection("orders");
  const serviceCollection = client.db("rentACar").collection("services");
  

    app.post('/addReview',(req, res) => {
        const reviews = req.body;
        console.log(reviews);
        reviewCollection.insertOne(reviews)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    });

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });

    app.post('/addOrder',(req, res) => {
        const orders = req.body;
        console.log(orders);
        orderCollection.insertOne(orders)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    });

    app.get('/orders', (req, res) => {
        orderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });

    app.post('/addService',(req, res) => {
        const services = req.body;
        console.log(services);
        serviceCollection.insertOne(services)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    });

    app.get('/services', (req, res) => {
        serviceCollection.find({})
        .toArray( (err, documents) =>{
            res.send(documents)
        })
    })

    app.delete('/deleteService/:id', (req, res) =>{
        const id = ObjectID(req.params.id)
        serviceCollection.findOneAndDelete({_id:id})
        .then(documents => res.send(!!documents.value))
      })

      app.post('/isAdmin',(req, res) => {
        const email = req.body.email;
        serviceCollection.find({email: email})
        .toArray((err, admins) => {
            res.send(admins.length > 0)
        })
    });
      

});




app.listen(process.env.PORT || port)