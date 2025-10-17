import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Serve static files
app.use(express.static(path.join(__dirname, '..')))

// Route for the standalone example
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'standalone-example.html'))
})

// Route for the Vue examples (if using build)
app.get('/examples', (req, res) => {
  res.send(`
    <html>
      <head><title>Vue Form Manager Examples</title></head>
      <body>
        <h1>Vue Form Manager Examples</h1>
        <ul>
          <li><a href="/">Standalone Example</a></li>
          <li><a href="/src/examples/BasicUsage.vue">Basic Usage (Source)</a></li>
          <li><a href="/src/examples/ComprehensiveExample.vue">Comprehensive Example (Source)</a></li>
        </ul>
      </body>
    </html>
  `)
})

app.listen(PORT, () => {
  console.log(`🚀 Vue Form Manager Examples running at:`)
  console.log(`   Local:   http://localhost:${PORT}`)
  console.log(`   Examples: http://localhost:${PORT}/examples`)
})
