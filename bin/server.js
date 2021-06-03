const app = require('../app')
// const path = require('path')
const db = require('../model/db')
const createFolderIsNotExist = require('../helpers/create-dir')
require('dotenv').config()
const PORT = process.env.PORT || 3000
const UPLOAD_DIR = process.env.UPLOAD_DIR
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOAD_DIR)
    await createFolderIsNotExist(AVATARS_OF_USERS)
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
