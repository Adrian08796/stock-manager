const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4800;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/stockdb');

// Define the stock schema and model
const stockSchema = new mongoose.Schema({
  productName: String,
  isOrganic: String,
  quantity: String,
  measureUnit: String,
  pricePerUnit: String,
  createdAt: { type: Date, default: Date.now },
  modifiedAt: Date
});

const Stock = mongoose.model('Stock', stockSchema);

// API endpoints
app.post('/api/stocks', async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    await newStock.save();
    res.status(201).send(newStock);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).send(stocks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/stocks/:id', async (req, res) => {
  try {
    req.body.modifiedAt = new Date();
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStock) {
      return res.status(404).send('Stock not found');
    }
    res.status(200).send(updatedStock);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/api/stocks/:id', async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).send('Stock not found');
    }
    res.status(200).send('Stock deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
