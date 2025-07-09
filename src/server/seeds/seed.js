import seedMovies from './seedMovies.js'
import seedActors from './seedActors.js'
import seedRatings from './seedRatings.js'

/**
 * Seeds the database with initial data for movies and associated actors and ratings.
 *
 * @async
 * @function runSeeders
 * @returns {Promise<void>} Resolves when all seeders have completed successfully.
 */
const runSeeders = async () => {
  try {
    console.log('Seeding movies...')
    await seedMovies()
    console.log('Seeding actors...')
    await seedActors()
    console.log('Seeding ratings...')
    await seedRatings()
    console.log('All data seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

runSeeders()
