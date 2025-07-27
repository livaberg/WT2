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

import express from 'express'

export const router = express.Router()

const movieRepository = new MovieRepository()
const ratingRepository = new RatingRepository()
const movieService = new MovieService(movieRepository, ratingRepository)
const movieController = new MovieController(movieService)

router.param('id', (req, res, next, id) =>
  movieController.loadMovieDocument(req, res, next, id)
)

router.get('/', validateQueries, (req, res) => movieController.getAllMovies(req, res))

router.get('/:id', (req, res) => movieController.getMovie(req, res))

router.post('/', validateBody, (req, res) => movieController.createMovie(req, res))

router.put('/:id', validateBody, (req, res) => movieController.updateMovie(req, res))

router.delete('/:id', (req, res) => movieController.deleteMovie(req, res))

router.get('/:id/ratings', (req, res) =>
movieController.getMovieRatings(req, res))
