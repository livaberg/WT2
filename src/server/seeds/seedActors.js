import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { ActorModel } from '../src/models/actor.js'
import { MovieModel } from '../src/models/movie.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

/**
 * Seed actors connected to movies from a CSV file into the MongoDB database.
 * Clears existing actors before inserting new ones.
 *
 * @async
 * @function seedActors
 * @returns {Promise<void>} Resolves when the seeding is complete.
 * @throws {Error} If there is an error connecting to the database or inserting data.
 */
const seedActors = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }

    // Fetch all valid movie IDs from the Movie collection
    const movies = await MovieModel.find({}, { tmdbId: 1, _id: 1 }).lean()
    const tmdbToMongoIdMap = new Map(
      movies.map((m) => [m.tmdbId, m._id.toString()])
    )

    const actorsMap = new Map()

    // Read and parse the CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve('../dataset/credits.csv'))
        .pipe(csv())
        .on('data', (row) => {
          try {
            const tmdbMovieId = Number(row.id)
            const mongoMovieId = tmdbToMongoIdMap.get(tmdbMovieId)

            if (!mongoMovieId) return // Ignore films not in DB to only seed actors for existing movies

            const fixedCast = row.cast
              ? row.cast
                  .replace(/'/g, '"')
                  .replace(/\bNone\b/g, 'null')
                  .replace(/\bTrue\b/g, 'true')
                  .replace(/\bFalse\b/g, 'false')
              : '[]'

            let cast
            try {
              cast = JSON.parse(fixedCast)
            } catch {
              return // Skip invalid cast
            }

            if (!Array.isArray(cast)) return

            cast.forEach(({ id: actorId, name: actorName }) => {
              if (!actorId || !actorName) return

              if (!actorsMap.has(actorId)) {
                actorsMap.set(actorId, {
                  id: actorId,
                  name: actorName,
                  movies_played: new Set([mongoMovieId]),
                })
              } else {
                const actor = actorsMap.get(actorId)
                actor.movies_played.add(mongoMovieId)
              }
            })
          } catch {
            // Ignore malformed rows silently
          }
        })
        .on('end', resolve)
        .on('error', reject)
    })

    const actors = Array.from(actorsMap.values()).map((actor) => ({
      id: actor.id,
      name: actor.name,
      movies_played: Array.from(actor.movies_played),
    }))

    // Clear the Actor collection before seeding
    await ActorModel.deleteMany({})
    await ActorModel.insertMany(actors)
    console.log(`Seeded ${actors.length} actors!`)

    // Disconnect from DB after seeding
    await mongoose.connection.close()
  } catch (err) {
    console.error('Seeding failed:', err)
    throw err
  }
}

export default seedActors
