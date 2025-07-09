/**
 * @file Defines the rating service for fetching rating data.
 * @module services/RatingService
 * @author Liv Åberg
 */

/**
 * Service for handling rating-related data.
 */
export class RatingService {
  /**
   * Creates an instance of the RatingService.
   *
   * @param {object} ratingRepository - The repository for accessing rating data.
   */
  constructor(ratingRepository) {
    this.ratingRepository = ratingRepository
  }

  /**
   * Retrieves all ratings based on the provided query parameters.
   *
   * @param {object} query - The query parameters for filtering and pagination.
   * @returns {Promise<Array>} - A promise that resolves to an array of ratings.
   */
  async getAllRatings(query) {
    const filter = {}
    const options = {}

    // Pagination
    const page = parseInt(query.page, 10) || 1
    const limit = Math.min(parseInt(query.limit, 10) || 10, 100)
    const skip = (page - 1) * limit

    options.limit = limit
    options.skip = skip

    const [ratings, total] = await Promise.all([
      this.ratingRepository.getAllRatings(filter, options),
      this.ratingRepository.countRatings(filter),
    ])

    // Return the ratings and pagination information to the controller.
    return {
      ratings,
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  }
}
