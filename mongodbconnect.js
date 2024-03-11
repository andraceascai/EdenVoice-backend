import mongoose from 'mongoose';
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

mongoose.set('debug', true);

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  postId: Number,
  content: String,
  date: String,
  votes: Number,
  whoVoted: [String]
}, { versionKey: false });

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const connectionString = 'mongodb://edenvoice:PrImlcwkLkJk5pSXysYio7SB57LTZIe0ZDHOXWoLx7DqAZgf5ifO7d7ki50JBfSfvcvQwQ4REqahACDb8RfBDQ==@edenvoice.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@edenvoice@'

const Post = mongoose.model('Post', postSchema, 'Posts');

mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB') 
  })
  .catch(err => console.error('MongoDB connection error:', err));

  // Middleware
  app.use(cors()); 
  app.use(bodyParser.json());

  //ROUTES

  app.post('/api/posts', async(req,res)=>{
    try {
      const newPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        postId: Math.floor(Math.random() * 1000000),
        content: req.body.content,
        date: formatDate(new Date()),
        votes: 0,
        whoVoted: []
      });
      newPost.save()
      .then((savedPost) => {
      console.log('Document inserted successfully:', savedPost);
  })
    } catch (error) {
      console.error('Error inserting document:', error);
    }
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
  })
 