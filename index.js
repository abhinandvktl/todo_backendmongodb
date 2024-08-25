const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

const mongoURI = 'mongodb+srv://abhinandvazhakkattil:abhi2002@cluster0.md5ul.mongodb.net/mytodos?retryWrites=true&w=majority&appName=Cluster0'

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Define Todo schema and model
const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/todos', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        todo.completed = req.body.completed;
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.delete('/todos/:id', async (req, res) => {
    try {
        const result = await Todo.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(204).end(); // No content, successful deletion
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
