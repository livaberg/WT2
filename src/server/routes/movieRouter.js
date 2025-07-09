/**
 * @file Defines the movie router.
 * @module routes/movieRouter
 * @author Liv Åberg
 */

import { MovieRepository } from '../repositories/MovieRepository.js'
import { RatingRepository } from '../repositories/RatingRepository.js'
import { MovieService } from '../services/MovieService.js'
import { MovieController } from '../controllers/MovieController.js'
import { validateQueries, validateBody } from '../middlewares/validation.js'
import { authenticateJWT } from '../middlewares/auth.js'

import express from 'express'

export const router = express.Router()

const movieRepository = new MovieRepository()
const ratingRepository = new RatingRepository()
const movieService = new MovieService(movieRepository, ratingRepository)
const movieController = new MovieController(movieService)

router.param('id', (req, res, next, id) =>
  movieController.loadMovieDocument(req, res, next, id)
)

/**
 * @swagger
 *  /movies:
 *    get:
 *      tags:
 *        - Movies
 *      summary: Get all movies
 *      parameters:
 *        - in: query
 *          name: genre
 *          schema:
 *            type: string
 *          description: Filter by genre
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: Page number
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *          description: Number of movies per page
 *      responses:
 *        200:
 *          description: List of movies
 *        500:
 *          description: Server error
 */
router.get('/', validateQueries, (req, res) => movieController.getAllMovies(req, res))

/**
 * @swagger
 *  /movies/{id}:
 *    get:
 *      tags:
 *        - Movies
 *      summary: Get a single movie by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            description: Movie ID
 *      responses:
 *        200:
 *          description: Movie details
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    $ref: '#/components/schemas/Movie'
 *        404:
 *          description: Movie not found
 *        500:
 *          description: Server error
 */
router.get('/:id', (req, res) => movieController.getMovie(req, res))

/**
 * @swagger
 *  /movies:
 *    post:
 *      tags:
 *        - Movies
 *      summary: Create a new movie
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MovieInput'
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        201:
 *          description: Movie created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    $ref: '#/components/schemas/Movie'
 *        500:
 *          description: Server error
 */
router.post('/', authenticateJWT, validateBody, (req, res) => movieController.createMovie(req, res))

/**
 * @swagger
 *  /movies/{id}:
 *    put:
 *      tags:
 *        - Movies
 *      summary: Update an existing movie by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Movie ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MovieInput'
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Movie updated
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    $ref: '#/components/schemas/Movie'
 *        404:
 *          description: Movie not found
 *        500:
 *          description: Server error
 */
router.put('/:id', authenticateJWT, validateBody, (req, res) => movieController.updateMovie(req, res))

/**
 * @swagger
 *  /movies/{id}:
 *    delete:
 *      tags:
 *        - Movies
 *      summary: Delete a movie by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            description: Movie ID
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        204:
 *          description: Movie deleted successfully (No Content)
 *        404:
 *          description: Movie not found
 *        500:
 *          description: Server error
 */
router.delete('/:id', authenticateJWT, (req, res) => movieController.deleteMovie(req, res))

/**
 * @swagger
 *  /movies/{id}/ratings:
 *    get:
 *      tags:
 *        - Movies
 *      summary: Get ratings for a movie by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Movie ID
 *      responses:
 *         200:
 *          description: List of ratings for the movie
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Rating'
 *                  links:
 *                    type: object
 *                    properties:
 *                      self:
 *                        type: string
 *                        example: "/movies/{id}/ratings"
 *                      movie:
 *                        type: string
 *                        example: "/movies/{id}"
 *         500:
 *           description: Server error
 */
router.get('/:id/ratings', (req, res) =>
  movieController.getMovieRatings(req, res)
)
