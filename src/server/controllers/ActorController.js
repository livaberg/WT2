/**
 * Defines the ActorController class that fetches actor data.
 *
 * @module controllers/ActorController
 * @author Liv Åberg
 */

/**
 * Handles actor-related requests and calls the appropriate service methods for further processing.
 */
export class ActorController {
  /**
   * Creates an instance of the ActorController.
   *
   * @param {object} actorService - The service for handling actor-related operations.
   */
  constructor(actorService) {
    this.actorService = actorService
  }

  /**
   * Retrieves all actors based on the provided query parameters.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getAllActors(req, res) {
    try {
    const result = await this.actorService.getAllActors(req.query)

    const actors = result.actors.map((actor) => ({
      id: actor._id,
      name: actor.name,
      movies: actor.movies_played.map((movieId) => `/movies/${movieId.toString()}`)
    }))


    res.status(200).json({
      data: actors,
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
        .json({ message: 'Failed to fetch actors.', error: error.message })
    }
  }
}
