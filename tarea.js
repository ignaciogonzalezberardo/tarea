const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const app = express();

app.use(express.json());

const DATABASE_URL = "mongodb+srv://nacho:nachopasword@cluster1.tw1qj.mongodb.net/tarea";

mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('Conectado a la base de datos tarea en MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB Atlas:', error);
    process.exit(1);
  });

app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const newTodo = new Todo({ title, description });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(400).json({ message: 'Error al crear la tarea', error });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas', error });
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea', error });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la tarea', error });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
});

app.listen(3000, () => {
  console.log('Servidor ejecutándose en el puerto 3000');
});
