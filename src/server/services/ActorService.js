/**
 * @file Defines the actor service for fetching actor data.
 * @module services/ActorService
 * @author Liv Åberg
 */

/**
 * Service for handling actor-related operations.
 */
export class ActorService {
  /**
   * Creates an instance of the ActorService.
   *
   * @param {object} actorRepository - The repository for accessing actor data.
   */
  constructor(actorRepository) {
    this.actorRepository = actorRepository
  }

  /**
   * Retrieves all actors based on the provided query parameters.
   *
   * @param {object} query - The query parameters for filtering and pagination.
   * @returns {Promise<Array>} - A promise that resolves to an array of actors.
   */
  async getAllActors(query) {
    const filter = {}
    const options = {}

    // Pagination
    const page = parseInt(query.page, 10) || 1
    const limit = Math.min(parseInt(query.limit) || 10, 100)
    const skip = (page - 1) * limit

    options.limit = limit
    options.skip = skip

    const [actors, total] = await Promise.all([
      this.actorRepository.getAllActors(filter, options),
      this.actorRepository.countActors(filter),
    ])

    // Return the actors and pagination information to the controller.
    return {
      actors,
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  }
}
