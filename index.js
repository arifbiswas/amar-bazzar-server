const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7xyixxj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    function verifyToken(req , res, next){
        const authToken = req.headers.authtoken;
        // console.log(authToken);
        if(!authToken){
            return res.status(401).send({message: 'unauthorized access'});
        }
        jwt.verify(authToken,process.env.SECRET_KEY, function(err , decoded){
            if(err){
                return res.status(403).send({message: 'Forbidden access'});
            }
            req.decoded = decoded;
            next();
        })

    }

async function run(){
    try {

        app.post('/jwt',(req,res)=>{
            const user = req.body;

            console.log(user);
            const token = jwt.sign(user, process.env.SECRET_KEY)
            // console.log(token);
            res.send({token});
        })

        const Products = client.db('amarBazzar').collection('products');

        app.get('/products',verifyToken, async(req,res)=>{
            const perPage = Number(req.query.perPage);
            const currentPage = Number(req.query.currentPage);
            console.log(perPage,currentPage);
            const query = {};
            const curse = Products.find(query)
            const products =await curse.skip(perPage*currentPage).limit(perPage).toArray();
            const count = await Products.estimatedDocumentCount()
            console.log(products);
            res.send({products,count});
           
        })
        app.post('/products',async(req,res)=>{
            const products =await Products.insertOne(req.body)
            // console.log(products);
            res.send(products);
           
        })
        app.patch('/products',async(req,res)=>{
            // const id = req.params.id;
            const user = req.body;
            console.log(user);
            const query = {_id: ObjectId(user._id)} 
            console.log(query);
            const products = await Products.updateOne(query,{$set:{
                name: user.name,
                price: user.price,
                photoLink : user.photoLink
            }})
            // console.log(products);
            res.send(products);
           
        })
        app.delete('/products/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)}
            const products =await Products.deleteOne(query)
            // console.log(products);
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