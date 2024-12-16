const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Formation Documentation',
      version: '1.0.0',
      description: 'Documentation de l’API Formation pour gérer les formations',
    },
    servers: [
      {
        url: 'https://projet1-node.onrender.com', // Remplacez par l'URL déployée de votre API
      },
      {
        url: 'http://localhost:3001', // URL locale pour tester en développement
      },
    ],
  },
  apis: ['./app.js'], // Chemin vers vos fichiers contenant des routes/documentation
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
