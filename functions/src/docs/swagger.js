import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ecommerce accenture',
      version: '1.0.0',
      description: 'API docs',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
      {
        url: "https://us-central1-ecommerce-accenture.cloudfunctions.net/api"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
  },
  apis: ['./src/routes/*.js', './routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log(`api documentation: /api-docs`);
}