const express = require('express')
const mongoose = require('mongoose')
const Post = require('./models/posts')
const path = require("path")
const cors = require("cors")
const port = 8081 || process.env.PORT
const fileUpload = require("express-fileupload")
const url = `mongodb+srv://RAHULSAGAR:RAHULSAGAR@cluster0.oyyx1sc.mongodb.net/?retryWrites=true&w=majority`
const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload())

mongoose.set('strictQuery', true)
mongoose.connect(url, (err) => {
    if(err) {
        console.log("Connection to mongodb failed")
    }
    else console.log("Connected to mongoDB successfully")
})


app.get('/',(req,res)=>{
  try{
    res.send("Welcome")
  }catch(e){
    res.json(e.message)
  }
})

app.post('/post',async (req,res)=>{
  const data = await Post.create(req.body)
  if(data){
    console.log(data)
    res.status(200).send(data)
  }else{
    res.json({
      status:"failed"
    })
  }
})

app.get('/all',async (req,res)=>{
  const data = await Post.find()
  if(data){
    console.log(data)
    res.send(data)
  }else{
    res.json({
      status:"failed"
    })
  }
})

app.get("/images/:fileName", async (req, resp) => {
  console.log(`./uploads/${req.params.fileName}`)
  resp.sendFile(path.join(__dirname, `./uploads/${req.params.fileName}`))
})


app.post("/api", (req, resp) => {
  const { name, address, description }  = req.body
  const {image} = req.files
  image.mv("./uploads/"+image.name, async (err) => {
      if(err) {
          resp.json({message: err})
      }
      else {
          const post = new Post({
              ...{ name, address, description },
              image: image.name
          })
          try{
              const response = await post.save()
              resp.json({message: 'Everything is fine', response})
          }catch(e){
              resp.json({message: 'Something went wrong' , response: e })
          }
      }
  })
})

app.get('/delete',async (req,res)=>{
  try{
    const data = await Post.deleteMany()
    console.log('deleted')
  }catch(e){
    res.json({message:e.message})
  }
})


app.listen(port,()=>{
  console.log(`server is up at ${port}`)
})