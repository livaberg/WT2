import { Chart } from 'chart.js/auto'

let currentChart = null

/**
 * Sleep function to pause execution for a given number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise} - A promise that resolves after the specified time.
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

document.getElementById('genreFilter').addEventListener('change', () => {
  getTopRatedMovies()
})

/**
 * Fetches the ten top-rated movies and displays them in a chart.
 *
 * @returns {Promise<void>} - Resolves when the chart is ready.
 * @throws {Error} - If there is an error fetching the data or rendering the chart.
 */
async function getTopRatedMovies() {
  const loadingElem = document.getElementById('loading')
  loadingElem.style.display = 'flex'
  loadingElem.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'

  let page = 1
  const allRatings = []
  const MAX_PAGES = 5

  while (page <= MAX_PAGES) {
    try {
      const res = await fetch(`/api/v1/ratings?page=${page}`)

      if (res.status === 429) {
        await sleep(2000)
        continue
      }

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`)
      }
      const data = await res.json()

      allRatings.push(...data.data)
      page++
      await sleep(200)
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error)
      break
    }
  }

  const ratingMap = {}
  for (const rating of allRatings) {
    const movieId = rating.movie.split('/').pop()
    if (!ratingMap[movieId]) ratingMap[movieId] = []
    ratingMap[movieId].push(rating.rating)
  }

  const avgRatings = Object.entries(ratingMap).map(([movieId, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    return { movieId, avgRating: avg, count: scores.length }
  })

  // Get selected genre
  const selectedGenre = document
    .getElementById('genreFilter')
    .value.toLowerCase()

  // Fetch movie data before filtering
  const enrichedRatings = await Promise.all(
    avgRatings.map(async (r) => {
      const res = await fetch(`/api/v1/movies/${r.movieId}`)
      const movieData = await res.json()
      return {
        ...r,
        genre: movieData.data.genre || '',
        title: movieData.data.title || 'Unknown',
      }
    })
  )

  const filtered = enrichedRatings.filter(
    (r) =>
      (!selectedGenre || r.genre.toLowerCase().includes(selectedGenre)) &&
      r.count >= 3
  )

  const top10 = filtered.sort((a, b) => b.avgRating - a.avgRating).slice(0, 10)

  const movies = await Promise.all(
    top10.map(async (r) => {
      try {
        const res = await fetch(`/api/v1/movies/${r.movieId}`)
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`)
        }
        const data = await res.json()

        return data.data
      } catch {
        return { title: 'Unknown' }
      }
    })
  )

  const chartLabels = movies.map((m, i) => `${i + 1}. ${m.title}`)
  const chartData = top10.map((r) => r.avgRating)

  loadingElem.style.display = 'none'

  const voteCounts = top10.map((r) => r.count)

  const ctx = document.getElementById('myChart')

  if (!(ctx instanceof HTMLCanvasElement)) {
    console.error('Canvas element not found')
    return
  }

  const chartColors = [
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(199, 199, 199, 0.4)',
    'rgba(255, 99, 255, 0.4)',
    'rgba(100, 255, 100, 0.4)',
    'rgba(0, 204, 255, 0.4)',
  ]

  const chartBorders = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(99, 99, 99, 1)',
    'rgba(155, 55, 155, 1)',
    'rgba(0, 155, 0, 1)',
    'rgba(0, 102, 153, 1)',
  ]

  if (currentChart) {
    currentChart.destroy()
  }

  // eslint-disable-next-line no-new
  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Average Rating',
          data: chartData,
          backgroundColor: chartColors,
          borderColor: chartBorders,
          borderWidth: 1,
          voteCounts,
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            /**
             * Tooltip label formatter.
             *
             * @param {import('chart.js').TooltipItem<'bar'>} context - The tooltip context.
             * @returns {string} - Formatted label text.
             */
            label: function (context) {
              const index = context.dataIndex
              const rating = context.dataset.data[index]
              const votes = context.dataset.voteCounts[index]
              return `Rating: ${rating.toFixed(2)} (${votes} votes)`
            },
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 0.5,
            precision: 1,
          },
          beginAtZero: true,
        },
      },
    },
  })
}

getTopRatedMovies()
