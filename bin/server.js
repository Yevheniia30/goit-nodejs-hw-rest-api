const app = require('../app')
const db = require('../model/db')
const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`)
  })
})
  .catch((err) => {
    console.log(`Server is not running. Error: ${err.message}`)
    process.exit(1)
  })

// app.listen(PORT, () => {
//   console.log(`Server running. Use our API on port: ${PORT}`)
// })

// ------------------------------------------
// const PORT = process.env.PORT || 3000
// const uriDb = process.env.DB_HOST

// const connection = mongoose.connect(uriDb, {
//   promiseLibrary: global.Promise,
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// })

// connection
//   .then(() => {
//     app.listen(PORT, function () {
//       console.log(`Server running. Use our API on port: ${PORT}`)
//     })
//   })
//   .catch((err) =>
//     console.log(`Server not running. Error message: ${err.message}`),
//   )
