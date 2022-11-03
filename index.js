const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7xyixxj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try {
        const Products = client.db('amarBazzar').collection('products');

        app.get('/products',async(req,res)=>{
            const query = {};
            const curse = Products.find(query)
            const products =await curse.toArray();
            console.log(products);
            res.send(products);
           
        })
        app.post('/products',async(req,res)=>{
            const products =await Products.insertOne(req.body)
            console.log(products);
            res.send(products);
           
        })
        app.delete('/products/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)}
            const products =await Products.deleteOne(query)
            console.log(products);
            res.send(products);
           
        })


    } catch (error) {
        console.log(error);
    }

}
run().catch(error => console.error(error))

app.get('/',(req,res)=>{
    res.send('Amar Bazzar Server is Running')
})

app.listen(port,()=>{
    console.log(`Amar Bazzar Runing ${port} Port`);
})