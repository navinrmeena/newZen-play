// import multer from 'multer'
import multer from "multer"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // this commented part is use to genrate unique and systhematic name
      cb(null, file.originalname)
    }
  })

  
  export const upload = multer({ storage})

