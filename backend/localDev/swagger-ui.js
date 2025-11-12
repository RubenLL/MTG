const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

// Load the Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const app = express();
const PORT = 3001; // Different port from your main API

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve the Swagger JSON file directly
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Serve the Swagger YAML file directly
app.get('/swagger.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  fs.createReadStream(path.join(__dirname, 'swagger.yaml')).pipe(res);
});

// Redirect root to the API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Swagger UI is running on http://localhost:${PORT}/api-docs`);
  console.log(`Swagger JSON: http://localhost:${PORT}/swagger.json`);
  console.log(`Swagger YAML: http://localhost:${PORT}/swagger.yaml`);
});
