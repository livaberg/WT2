/**
 * @file Defines the movie service for fetching and manipulating movie data.
 * @module services/MovieService
 * @author Liv Åberg
 */

/**
 * Service for handling movie-related operations.
 */
export class MovieService {
  /**
   * Creates an instance of the MovieService.
   *
   * @param {object} movieRepository - The repository for accessing movie data.
   * @param {object} ratingRepository - The repository for accessing rating data.
   */
  constructor(movieRepository, ratingRepository) {
    this.movieRepository = movieRepository
    this.ratingRepository = ratingRepository
  }

  /**
   * Retrieves all movies based on the provided query parameters.
   *
   * @param {object} query - The query parameters for filtering and pagination.
   * @returns {Promise<Array>} - A promise that resolves to an array of movies.
   */
  async getAllMovies(query) {
    const filter = {}
    const options = {}

    // Filtrering
    if (query.genre) {
      filter.genre = { $regex: new RegExp(query.genre, 'i') }
    }

    const year = parseInt(query.year)
    if (!isNaN(year)) {
      filter.release_year = year
    }

    // Pagination
    const page = parseInt(query.page) || 1
    const limit = Math.min(parseInt(query.limit) || 10, 100)
    const skip = (page - 1) * limit

    options.limit = limit
    options.skip = skip

    const [movies, total] = await Promise.all([
      this.movieRepository.getAllMovies(filter, options),
      this.movieRepository.countMovies(filter),
    ])

    // Return the movies and pagination information to the controller.
    return {
      movies,
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  /**
   * Retrieves a single movie by its ID.
   *
   * @param {string} id - The ID of the movie to retrieve.
   * @returns {Promise<object|null>} - A promise that resolves to the movie object if found, or null if not.
   */
  async getMovie(id) {
    // Call the repository method to fetch the movie by ID.
    const movie = await this.movieRepository.getMovie(id)
    return movie || null
  }

  /**
   * Creates a new movie.
   *
   * @param {object} movieData - The data for the movie to create.
   * @returns {Promise<object>} - The created movie document.
   */
  async createMovie(movieData) {
    // Validering eller annan affärslogik kan läggas här
    const createdMovie = await this.movieRepository.createMovie(movieData)
    return createdMovie
  }

  /**
   * Updates an existing movie by ID.
   *
   * @param {string} id - The ID of the movie to update.
   * @param {object} updateData - The data to update the movie with.
   * @returns {Promise<object|null>} - The updated movie document or null if not found.
   */
  async updateMovie(id, updateData) {
    // Validering eller affärslogik
    const updatedMovie = await this.movieRepository.updateMovie(id, updateData)
    return updatedMovie
  }

  /**
   * Deletes a movie by ID.
   *
   * @param {string} id - The ID of the movie to delete.
   * @returns {Promise<boolean>} - True if deleted, false if not found.
   */
  async deleteMovie(id) {
    const deleted = await this.movieRepository.deleteMovie(id)
    return deleted
  }

  /**
   * Retrieves ratings for a specific movie.
   *
   * @param {string} movieId - The ID of the movie to get ratings for.
   * @returns {Promise<Array>} - An array of ratings.
   */
  async getMovieRatings(movieId) {
    return this.ratingRepository.getRatingsByMovieId(movieId)
  }
}
