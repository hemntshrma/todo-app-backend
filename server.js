import express from 'express'
import connectToDatabase from './db.js'
import cors from 'cors'

const app = express()
const port = 3000


let db;

app.use(express.json())
app.use(cors({
    origin:"http://localhost:3001"
}))

app.listen(port, async () => {
    console.log(`todo app backed server server started at port ${port}`)
    db = await connectToDatabase('todo-db')
})


app.get('/test', (req, res) => {
    res.send('ApI is up!')
})

app.post('/create-todo', async (req, res) => {
  try {
    let body = req.body;
    await db.collection('todo').insertOne(body);
    res.status(201).json({ msg: "Todo inserted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});


app.get('/read-todos', async (req, res) => {
    try{
        let todoList = await db.collection('todo').find().toArray();
        res.status(200).json(todoList)
    } catch (error) {
        res.status(500).json({ msg: "internal server occur"})
    }
})


app.get('/read-todo', async (req, res) => {
  try {
    let queryTodoId = req.query.todoId; 
    let todo = await db.collection('todo').findOne({ "todoID": queryTodoId });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message
    });
  }
})

app.patch('/update-todo', async (req, res) => {
    try {
       let queryTodoId = req.query.todoId;
       let reqBody = req.body;

      let result = await db.collection('todo').updateOne({ "todoId": queryTodoId }, { $set: reqBody });
        if (result.matchCount === 0) {
            res.status(404).json({ msg: "Todo not found" })
        }else
            res.status(201).json({ msg: "Todo updated successfully" })
}catch (error) {

    res.status(500).json({
        msg: "Internal server error",
        error: error.message
    })
             
        }
    })
    app.delete('/delete-todo', async (req, res) => {
  try {
    let queryTodoID = req.query.todoID;

    let result = await db.collection('todo').deleteOne({ "todoID": queryTodoID });

    if (result.deletedCount === 0) {
      res.status(404).json({ msg: "Todo not found" });
    } else {
      res.status(200).json({ msg: "Todo deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
});



