import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Solana Fiat Exchange API',
      version: '1.0.0',
      description: 'API documentation for the Solana Fiat Exchange application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export default (app: express.Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
