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
    return RatingModel.find(filter)
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

  /**
   * Aggregates and retrieves the top-rated movies based on optional genre filtering, minimum votes, and limit.
   * Uses a MongoDB aggregation pipeline to join ratings with movies, filter by genre, group ratings per movie,
   * and return movies with average ratings and vote counts that meet the criteria.
   *
   * @param {object} [options] - Options to filter and limit the aggregation results.
   * @param {RegExp|null} [options.genreRegex=null] - Optional regular expression to filter movies by genre (case-insensitive).
   * @param {number} [options.minVotes=3] - Minimum number of votes required to include a movie in the results.
   * @param {number} [options.limit=10] - Maximum number of movies to return.
   * @returns {Promise<Array>} A promise that resolves to an array of aggregated movie rating objects, each containing:
   * - {string} movieId - The unique identifier of the movie.
   * - {string} title - The title of the movie.
   * - {string} genre - The genre of the movie.
   * - {number} avgRating - The average rating of the movie, rounded to 3 decimals.
   * - {number} voteCount - The number of votes the movie has received.
   */
  async getTopRatedAggregates({
    genreRegex = null,
    minVotes = 3,
    limit = 10,
  } = {}) {
    const pipeline = [
      // Join movie metadata
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movie',
        },
      },
      { $unwind: '$movie' },
    ]

    // Optional genre filter (case-insensitive via provided regex)
    if (genreRegex) {
      pipeline.push({ $match: { 'movie.genre': { $regex: genreRegex } } })
    }

    // Group per movie and compute statistics
    pipeline.push(
      {
        $group: {
          _id: '$movie._id',
          movieId: { $first: '$movie._id' },
          title: { $first: '$movie.title' },
          genre: { $first: '$movie.genre' },
          avgRating: { $avg: '$rating' },
          voteCount: { $sum: 1 },
        },
      },
      // Filter by minimum votes
      { $match: { voteCount: { $gte: Number(minVotes) } } },
      // Sort by average rating, vote count, and title
      { $sort: { avgRating: -1, voteCount: -1, title: 1 } },
      { $limit: Number(limit) },
      // Shape minimal output
      {
        $project: {
          _id: 0,
          movieId: 1,
          title: 1,
          genre: 1,
          avgRating: { $round: ['$avgRating', 3] },
          voteCount: 1,
        },
      }
    )

    return RatingModel.aggregate(pipeline).allowDiskUse(true).exec()
  }
}
