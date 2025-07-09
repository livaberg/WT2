/**
 * Defines the RatingController class that fetches rating data related to movies.
 *
 * @module controllers/RatingController
 * @author Liv Åberg
 */

/**
 * Handles rating-related requests and calls the appropriate service methods for further processing.
 */
export class RatingController {
  /**
   * Creates an instance of the RatingController.
   *
   * @param {object} ratingService - The service for handling rating-related operations.
   */
  constructor(ratingService) {
    this.ratingService = ratingService
  }

  /**
   * Retrieves all ratings based on the provided query parameters.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getAllRatings(req, res) {
    try {
    const result = await this.ratingService.getAllRatings(req.query)

    const ratings = result.ratings.map((rating) => ({
      id: rating._id,
      rating: rating.rating,
      movie: `/movies/${rating.movie.toString()}`,
    }))


    res.status(200).json({
      data: ratings,
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
        .json({ message: 'Failed to fetch ratings.', error: error.message })
    }
  }
}
