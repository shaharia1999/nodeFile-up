const express = require('express');
const app = express();
const cors = require('cors')
const multer = require('multer');
const path = require('path');

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
// const objectID=require('mongodb').objectID;
const   OBG = require('mongodb').ObjectID;


// use Middleware
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://shaharia:tM71pdsglZ08qlEh@cluster0.rgssr8j.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri
//   , {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// }
);

async function run() {
  try {
    await client.connect();
   const commentcolg= await client.db("comment").collection('collection');
  //  app get
  app.get('/comments',async(req,res)=>{
    const query={};
    const cursor=commentcolg.find(query);
    const comments=await cursor.toArray();
    res.send(comments);
  })
// multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
  // app put request
  app.put('/comment/:id',upload.single('file'),async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    console.log(req.body)
    const comment=req.body
  //   if (!comment || !comment.file) {
  //     return res.status(400).send("Invalid comment data");
  // }

    console.log(comment);
    // const filter={_id:ObjectId(id)};
    const filter = { _id: new ObjectId(id) };
    const option={upsert:true}
    const undatecomment={
      $push:{
        // file: comment.file
        data: req.file.buffer.toString('base64'),
      },
      
    }
    const result=await commentcolg.updateOne(filter,undatecomment,option);
    res.send(result);
    // res.status(200).send("Success")


  })
  // app post
    app.post('/commnet',async(req,res)=>{
    // const updateCommnet= req.body;
    const updateComment = req.body;
    console.log(`my data ${JSON.stringify(updateComment)}`);
    res.send('user data resive')
    })
  
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Running')
})



// listen PORT
app.listen(port, () => {
  // console.log("CRUD SERVER IS RUNNING");
})