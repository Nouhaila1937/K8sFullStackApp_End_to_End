const express = require('express');
const client = require("prom-client");
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
const collectDefaultMetrics= client.collectDefaultMetrics;
collectDefaultMetrics({timeout:5000});

app.get("/metrics",async(req,res)=>{
  res.set("Content-type",client.register.contentType);
  res.end(await client.register.metrics())

});


// Connect to DB
connectDB();

// Routes
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
