/**
 * @file Defines the movie repository for accessing movie data from the MongoDB database.
 * @module repositories/MovieRepository
 * @author Liv Åberg
 */

import { MovieModel } from '../models/movie.js'
import { RatingModel } from '../models/rating.js'

/**
 * Repository for accessing movie data.
 */
export class MovieRepository {
  /**
   * Retrieves all movies from the database based on filter and pagination options.
   *
   * @param {object} filter - The filter criteria for querying movies.
   * @param {object} options - The pagination options, including limit and skip.
   * @returns {Promise<Array>} - A promise that resolves to an array of movie documents.
   */
  async getAllMovies(filter = {}, options = {}) {
    return MovieModel
      .find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 10)
      .exec()
  }

  /**
   * Counts the number of movies in the database that match the given filter criteria.
   *
   * @param {object} filter - The filter criteria for counting movies.
   * @returns {Promise<number>} - A promise that resolves to the count of matching movies.
   */
  async countMovies(filter = {}) {
  return MovieModel.countDocuments(filter).exec()
  }

  /**
   * Retrieves a single movie document by its ID.
   *
   * @param {string} id - The ID of the movie to retrieve.
   * @returns {Promise<object|null>} - A promise that resolves to the movie document if found, or null if not.
   */
  async getMovie(id) {
    return MovieModel
    .findById(id)
    .exec()
  }

  /**
   * Creates a new movie document in the database.
   *
   * @param {object} movieData - The data for the movie to create.
   * @returns {Promise<object>} - The created movie document.
   */
  async createMovie(movieData) {
    const movie = new MovieModel(movieData)
    return movie.save()
  }

  /**
   * Updates a movie document by its ID.
   *
   * @param {string} id - The ID of the movie to update.
   * @param {object} updateData - The data to update the movie with.
   * @returns {Promise<object|null>} - The updated movie document or null if not found.
   */
  async updateMovie(id, updateData) {
    return MovieModel.findByIdAndUpdate(id, updateData, { new: true }).exec()
  }

  /**
   * Deletes a movie document by its ID.
   *
   * @param {string} id - The ID of the movie to delete.
   * @returns {Promise<boolean>} - True if deleted, false otherwise.
   */
  async deleteMovie(id) {
    const result = await MovieModel.deleteOne({ _id: id }).exec()
    return result.deletedCount > 0
  }

  /**
   * Retrieves ratings for a specific movie.
   *
   * @param {string} movieId - The ID of the movie to get ratings for.
   * @returns {Promise<Array>} - An array of rating documents.
   */
  async getMovieRatings(movieId) {
    return RatingModel.find({ movie: movieId })
      .exec()
  }
}