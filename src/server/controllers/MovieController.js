/**
 * Defines the MovieController class that handles movie-related requests.
 *
 * @module controllers/MovieController
 * @author Liv Åberg
 */

import { MovieModel } from '../models/movie.js'

/**
 * Handles movie-related requests and calls the appropriate service methods for further processing.
 */
export class MovieController {
  /**
   * Creates an instance of the MovieController.
   *
   * @param {object} movieService - The service for handling movie-related operations.
   */
  constructor(movieService) {
    this.movieService = movieService
  }

  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the movie to load.
   */
  async loadMovieDocument(req, res, next, id) {
    try {
      // Get the movie document.
      const movieDoc = await MovieModel.findById(id)

      // If the movie document is not found, throw an error.
      if (!movieDoc) {
        const error = new Error('The movie you requested does not exist.')
        error.status = 404
        throw error
      }

      // Provide the movie document to req.
      req.doc = movieDoc

      // Go to the next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves all movies, including filtering and pagination based on query parameters.
   *
   * @param {object} req - Express request object with query parameters: genre, year, page, limit.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getAllMovies(req, res) {
    try {
      const result = await this.movieService.getAllMovies(req.query)

      const movies = result.movies.map((movie) => ({
        id: movie._id,
        title: movie.title,
        release_year: movie.release_year,
        genre: movie.genre,
        description: movie.description,
        links: {
          self: `/movies/${movie._id}`,
          ratings: `/movies/${movie._id}/ratings`,
        },
      }))

      res.status(200).json({
        data: movies,
        total: result.total,
        page: result.page,
        pages: result.pages,
        links: {
          self: req.originalUrl,
        },
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to fetch movies.', error: error.message })
    }
  }

  /**
   * Retrieves a single movie by its ID.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getMovie(req, res) {
    try {
      const movie = await this.movieService.getMovie(req.params.id)
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' })
      }

      res.status(200).json({
        data: {
          id: movie._id,
          title: movie.title,
          release_year: movie.release_year,
          genre: movie.genre,
          description: movie.description,
          links: {
            self: `/movies/${movie._id}`,
            ratings: `/movies/${movie._id}/ratings`,
          },
        },
        links: {
          self: req.originalUrl,
        },
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to fetch movie.', error: error.message })
    }
  }

  /**
   * Creates a new movie with the provided data.
   *
   * @param {object} req - Express request object containing the movie data in the body.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async createMovie(req, res) {
    try {
      const created = await this.movieService.createMovie(req.body)
      res.status(201).json({
        data: {
          id: created._id,
          title: created.title,
          release_year: created.release_year,
          genre: created.genre,
          description: created.description,
          links: {
            self: `/movies/${created._id}`,
            ratings: `/movies/${created._id}/ratings`,
          },
        },
        links: {
          self: req.originalUrl,
        },
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to create movie.', error: error.message })
    }
  }

  /**
   * Updates an existing movie by its ID with the provided data.
   *
   * @param {object} req - Express request object containing the movie ID in the URL and the updated data in the body.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async updateMovie(req, res) {
    try {
      const updated = await this.movieService.updateMovie(
        req.params.id,
        req.body
      )
      if (!updated) {
        return res.status(404).json({ message: 'Movie not found' })
      }
      res.status(200).json({
        data: {
          id: updated._id,
          title: updated.title,
          release_year: updated.release_year,
          genre: updated.genre,
          description: updated.description,
          links: {
            self: `/movies/${updated._id}`,
            ratings: `/movies/${updated._id}/ratings`,
          },
        },
        links: {
          self: req.originalUrl,
        },
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to update movie.', error: error.message })
    }
  }

  /**
   * Deletes a movie by its ID.
   *
   * @param {object} req - Express request object containing the movie ID in the URL.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async deleteMovie(req, res) {
    try {
      const success = await this.movieService.deleteMovie(req.params.id)
      if (!success) {
        return res.status(404).json({ message: 'Movie not found' })
      }
      res.status(204).send()
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to delete movie.', error: error.message })
    }
  }

  /**
   * Retrieves all ratings for a specific movie by its ID.
   *
   * @param {object} req - Express request object containing the movie ID in the URL.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getMovieRatings(req, res) {
    try {
      const ratings = await this.movieService.getMovieRatings(req.params.id)

      const formattedRatings = ratings.map(r => ({
        id: r._id,
        rating: r.rating,
        links: {
          movie: `/movies/${r.movie}`
        }
      }))

      res.status(200).json({
        data: formattedRatings,
        links: {
          self: req.originalUrl,
        },
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch ratings.',
        error: error.message,
      })
    }
  }
}
