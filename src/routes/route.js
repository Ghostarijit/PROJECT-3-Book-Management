const express = require('express');
const router = express.Router();

const auth = require("../middleWare/auth")
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")



router.post("/register", userController.createuser)

router.post("/login", userController.loginUser)

router.post("/books",auth.validateToken,bookController.createBook)

router.get("/books",auth.validateToken,bookController.getBooks)

router.get("/books/:bookId",auth.validateToken,bookController.getBookById)

router.put("/books/:bookId",auth.validateToken,bookController.updateBooks)

router.delete("/books/:bookId",auth.validateToken,bookController.deleteBooks)

module.exports = router;