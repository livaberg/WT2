/**
 * @file Defines the main application.
 * @module server
 * @author Liv Åberg
 */

// Built-in modules.

// User-land modules.
import '@lnu/json-js-cycle'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

// Application modules.

try {
  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: './.env.production' })
  } else {
    dotenv.config()
  }

  // Create an Express application.
  const app = express()

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // Trust first proxy
  }

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://gitlab.lnu.se'],
        imgSrc: ["'self'", 'https://secure.gravatar.com', 'https://gitlab.lnu.se']
      }
    }
  }))

  // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  app.use(cors())

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // Parse requests of the content type application/json.
  app.use(express.json())

  app.use(express.static('public'))

  app.use((req, res, next) => {
    res.locals.baseURL = (process.env.BASE_URL || '').replace(/\/$/, '') + '/'
    next()
  })

  // Error handler.
  app.use((err, req, res, next) => {
    console.error(err.message, { error: err })

    if (process.env.NODE_ENV === 'production') {
      // Ensure a valid status code is set for the error.
      // If the status code is not provided, default to 500 (Internal Server Error).
      // This prevents leakage of sensitive error details to the client.
      if (!err.status) {
        err.status = 500
        err.message = err.message || 'Internal Server Error'
      }

      // Send only the error message and status code to prevent leakage of sensitive information.
      res
        .status(err.status)
        .json({
          error: err.message
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

    return res
      .status(err.status || 500)
      .json(copy)
  })

  const PORT = process.env.PORT || 3000

  // Starts the HTTP server listening for connections.
  // const server = app.listen(PORT, () => {
  //   console.log(server.address())
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err.message, { error: err })
  process.exitCode = 1
}
