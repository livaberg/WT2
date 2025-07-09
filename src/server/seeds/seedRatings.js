import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { RatingModel } from '../src/models/rating.js'
import { MovieModel } from '../src/models/movie.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

/**
 * Seed ratings connected to movies from a CSV file into the MongoDB database. Each rating is linked to an existing movie in the database.
 * Clears existing ratings before inserting new ones.
 *
 * @async
 * @function seedRatings
 * @returns {Promise<void>} Resolves when the seeding is complete.
 * @throws {Error} If there is an error connecting to the database or inserting data.
 */
const seedRatings = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }

    // Fetch all movies to create a mapping from TMDB IDs to MongoDB Object IDs
    const movies = await MovieModel.find({}, { tmdbId: 1, _id: 1 }).lean()
    const tmdbToMongoIdMap = new Map(movies.map(m => [m.tmdbId, m._id]))

    const results = []
    let count = 0
    const maxEntries = 10000 // Limit the number of ratings to seed for performance issues

    await new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve('../dataset/ratings_small.csv'))
        .pipe(csv())
        .on('data', (data) => {
          const tmdbMovieId = Number(data.movieId)
          const mongoMovieId = tmdbToMongoIdMap.get(tmdbMovieId)
          if (mongoMovieId && count < maxEntries) {
            results.push({
              // Assign a unique ID for each rating
              id: count + 1,
              rating: Number(data.rating),
              movie: mongoMovieId
            })
            count++
          }
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
    })

    await RatingModel.deleteMany({})
    await RatingModel.insertMany(results)
    console.log(`Seeded ${results.length} ratings!`)

    await mongoose.connection.close()
  } catch (err) {
    console.error('Error seeding ratings:', err)
    throw err
  }
}

export default seedRatings
