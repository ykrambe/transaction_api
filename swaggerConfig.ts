// swaggerConfig.js
// const swaggerJsdoc = require('swagger-jsdoc');
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for the transaction API endpoints',
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/**/*.js'], // Path ke file berisi anotasi Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec
