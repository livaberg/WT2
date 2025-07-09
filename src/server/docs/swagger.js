import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// Swagger options for API documentation to be generated.
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie API',
      version: '1.0.0',
      description: 'API documentation with Swagger'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // The location of the API routes to be documented.
  apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export { swaggerUi, swaggerSpec }
