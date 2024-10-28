const express = require('express');
const dotenv = require('dotenv');
const { v4: uuid } = require('uuid');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS
app.use(cors());