/**
 * @file Defines the actor repository for accessing actor data from the MongoDB database.
 * @module repositories/ActorRepository
 * @author Liv Åberg
 */

import { ActorModel } from '../models/actor.js'

/**
 * Repository for accessing actor data.
 */
export class ActorRepository {
  /**
   * Retrieves all actors from the database based on filter and pagination options.
   *
   * @param {object} filter - The filter criteria for querying actors.
   * @param {object} options - The pagination options, including limit and skip.
   * @returns {Promise<Array>} - A promise that resolves to an array of actor documents.
   */
  async getAllActors(filter = {}, options = {}) {
    return ActorModel
      .find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 10)
      .exec()
    }

  /**
   * Counts the number of actors in the database that match the given filter criteria.
   *
   * @param {object} filter - The filter criteria for counting actors.
   * @returns {Promise<number>} - A promise that resolves to the count of matching actors.
   */
  async countActors(filter = {}) {
    return ActorModel.countDocuments(filter).exec()
  }
}