import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API',
      version: '1.0.0',
      description: 'Ví dụ API với Express, TypeScript và Swagger'
    },
    servers: [
      {
        url: 'http://localhost:3000',
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/index.ts'],
};