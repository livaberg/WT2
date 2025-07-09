import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { MovieModel } from '../src/models/movie.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

/**
 * Parses a string of genres formatted as JSON and returns a comma-separated string of genre names.
 *
 * @param {string} genresString - The string containing genres in JSON format.
 * @returns {string} A comma-separated string of genre names, or an empty string if parsing fails.
 */
function parseGenres (genresString) {
  try {
    const genresArray = JSON.parse(genresString.replace(/'/g, '"')) // Replace single quotes with double quotes for valid JSON
    if (Array.isArray(genresArray) && genresArray.length > 0) {
      return genresArray.map(g => g.name).join(', ')
    }
    return ''
  } catch (err) {
    return ''
  }
}

/**
 * Seed the first 200 movies from a CSV file into the MongoDB database.
 * Clears existing movies before inserting new ones.
 *
 * @async
 * @function seedMovies
 * @returns {Promise<void>} Resolves when the seeding is complete.
 * @throws {Error} If there is an error connecting to the database or inserting data.
 */
const seedMovies = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }

    const results = []
    const maxEntries = 200
    let count = 0

    return new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve('../dataset/movies_metadata.csv'))
        .pipe(csv())
        .on('data', (data) => {
          if (count < maxEntries) {
            const releaseYear = data.release_date ? new Date(data.release_date).getFullYear() : null
            const genreString = data.genres || ''
            const genresParsed = parseGenres(genreString)

            results.push({
              title: data.title,
              release_year: releaseYear,
              genre: genresParsed,
              description: data.overview || '',
              tmdbId: Number(data.id) || null
            })
            count++
          }
        })
        .on('end', async () => {
          try {
            await MovieModel.deleteMany({})
            await MovieModel.insertMany(results)
            console.log(`Seeded ${results.length} movies!`)
            resolve()
          } catch (err) {
            console.error('Error inserting movies:', err)
            reject(err)
          }
        })
        .on('error', (err) => {
          console.error('Error reading CSV:', err)
          reject(err)
        })
    })
  } catch (err) {
    console.error('Error connecting to DB:', err)
    throw err
  }
}

export default seedMovies
