const express = require('express')
const path = require('path')

const port = process.env.PORT || 3000

const app = express();

app.use(express.static(path.join(__dirname, '/build/index.html') ))

app.get('/', (req, res) => {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '/build/index.html'))
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})