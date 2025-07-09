/**
 * @file Defines the rating repository for accessing rating data from the MongoDB database.
 * @module repositories/RatingRepository
 * @author Liv Åberg
 */

import { RatingModel } from '../models/rating.js'

/**
 * Repository for accessing rating data.
 */
export class RatingRepository {
  /**
   * Retrieves all ratings from the database based on filter and pagination options.
   *
   * @param {object} filter - The filter criteria for querying ratings.
   * @param {object} options - The pagination options, including limit and skip.
   * @returns {Promise<Array>} - A promise that resolves to an array of rating documents.
   */
  async getAllRatings(filter = {}, options = {}) {
    return RatingModel
      .find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 10)
      .exec()
    }

  /**
   * Counts the number of ratings in the database that match the given filter criteria.
   *
   * @param {object} filter - The filter criteria for counting ratings.
   * @returns {Promise<number>} - A promise that resolves to the count of matching ratings.
   */
  async countRatings(filter = {}) {
    return RatingModel.countDocuments(filter).exec()
  }

/**
 * Retrieves ratings for a specific movie by its ID.
 *
 * @param {string} movieId - The ID of the movie.
 * @returns {Promise<Array>} - A promise that resolves to an array of rating documents.
 */
  async getRatingsByMovieId(movieId) {
    return RatingModel.find({ movie: movieId }).exec()
  }
}