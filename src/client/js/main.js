/**
 * This script fetches the top-10 user-rated movies from the backend API
 * and displays them in an interactive bar chart. Updates the chart and loading indicators based on user interactions with the genre filter.
 */

import { Chart } from 'chart.js/auto'

let currentChart = null
let currentController

const chartColors = [
  'rgba(255, 99, 132, 0.3)',
  'rgba(54, 162, 235, 0.3)',
  'rgba(255, 206, 86, 0.3)',
  'rgba(75, 192, 192, 0.3)',
  'rgba(153, 102, 255, 0.3)',
  'rgba(255, 159, 64, 0.3)',
  'rgba(199, 199, 199, 0.3)',
  'rgba(255, 99, 255, 0.3)',
  'rgba(100, 255, 100, 0.3)',
  'rgba(0, 204, 255, 0.3)',
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

document.getElementById('genreFilter').addEventListener('change', () => {
  getTopRatedMovies()
})

/**
 * Fetches the top-10 rated movies from the backend API and renders them in a bar chart. Shows/hides the loading indicator, builds query from #genreFilter, and re-renders the chart with the new data.
 *
 * @returns {Promise<void>} - Resolves when the chart is ready.
 * @throws {Error} - If there is an error fetching the data or rendering the chart.
 */
async function getTopRatedMovies() {
  if (currentController)
    // Abort the previous request if it exists
    currentController.abort()
  currentController = new AbortController()
  const { signal } = currentController

  const loadingElem = document.getElementById('loading')
  const chartElem = document.getElementById('myChart')

  const genreSelect = document.getElementById('genreFilter')
  loadingElem.style.display = 'flex'
  genreSelect.disabled = true
  loadingElem.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'

  try {
    const selectedGenre = genreSelect.value.trim()
    const queryParams = new URLSearchParams()
    if (selectedGenre) {
      queryParams.append('genre', selectedGenre)
    }
    queryParams.append('minVotes', '3')
    queryParams.append('limit', '10')

    // Fetch the top-rated movies from the API
    const res = await fetch(
      `/api/v1/movies/top-rated?${queryParams.toString()}`,
      { signal }
    )

    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`)
    }

    const result = await res.json()

    // Build labels and data sets for the chart
    const chartLabels = result.data.map((m, i) => `${i + 1}. ${m.title}`)
    const chartData = result.data.map((m) => m.avgRating)
    const voteCounts = result.data.map((m) => m.voteCount)

    const ctx = document.getElementById('myChart')

    if (!(ctx instanceof HTMLCanvasElement)) return

    if (currentChart) currentChart.destroy()

    // Build and render the chart with Chart.js
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
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Failed to load top rated movies:', error)
      alert('Failed to load top rated movies. Please try again later.')
    }
  } finally {
    // Re-enable the genre filter after loading
    loadingElem.style.display = 'none'
    loadingElem.hidden = true
    chartElem.hidden = false
    genreSelect.disabled = false
  }
}

getTopRatedMovies()
