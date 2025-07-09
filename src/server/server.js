/**
 * Defines the starting point of the API server.
 *
 * @author Liv Åberg<lh224hh@student.lnu.se>
 * @version 1.0.0
 */

import cors from 'cors' // Middleware for enabling CORS
import express from 'express' // Express framework
import helmet from 'helmet' // Middleware for setting various HTTP headers for security
import dotenv from 'dotenv' // Module to load environment variables from a .env file
import http from 'http' // Node.js HTTP module for creating the server
import '@lnu/json-js-cycle'
import rateLimit from 'express-rate-limit' // Middleware for rate limiting

import { connectToDatabase } from '../db.js' // Function to connect to MongoDB
import { swaggerUi, swaggerSpec } from './docs/swagger.js' // Swagger UI for API documentation
import { router as apiRouter } from './routes/router.js' // Main router for handling API routes

dotenv.config() // Load environment variables from .env file

// Connect to MongoDB.
// await connectToDatabase(process.env.DB_CONNECTION_STRING)
await connectToDatabase(process.env.MONGODB_URI)

// Create an Express application.
const app = express()

// Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  })
)

// Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
app.use(cors())

app.use(express.json())

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minut
  max: 100, // Max 100 requests per IP
  message: 'Too many requests. Please slow down.',
})

app.use(globalLimiter)

// Register routes.
app.use('/api/v1', apiRouter)

// Use the Swagger UI middleware to serve API documentation.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Error handler.
app.use((err, req, res, next) => {
  console.error(err) // Log the error to the console

  if (process.env.NODE_ENV === 'production') {
    // Ensure a valid status code is set for the error.
    // If the status code is not provided, default to 500 (Internal Server Error).
    // This prevents leakage of sensitive error details to the client.
    if (!err.status) {
      err.status = 500
      err.message = http.STATUS_CODES[err.status]
    }

    // Send only the error message and status code to prevent leakage of sensitive information.
    res.status(err.status).json({
      error: err.message,
    })

    return
  }

  // ---------------------------------------------------
  // ⚠️ WARNING: Development Environment Only!
  //             Detailed error information is provided.
  // ---------------------------------------------------

  // Deep copies the error object and returns a new object with
  // enumerable and non-enumerable properties (cyclical structures are handled).
  const copy = JSON.decycle(err, { includeNonEnumerableProperties: true })

  return res.status(err.status || 500).json(copy)
})

// Starts the HTTP server listening for connections.
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${server.address().port}`)
  console.log('Press Ctrl-C to terminate...')
})
