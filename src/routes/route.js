const express = require('express');
const router = express.Router();


const userController = require("../controller/userController")
const bookController = require("../controller/bookController")



router.post("/register", userController.createuser)

router.post("/login", userController.loginUser)

router.post("/books",bookController.createBook)

router.get("/books",bookController.getBooks)


module.exports = router;