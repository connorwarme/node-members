var express = require('express');
var router = express.Router();

const post_controller = require("../controllers/postController")

/* GET home page. */
router.get('/', post_controller.index);

router.get("/post/create", post_controller.post_create_get)
router.post("/post/create", post_controller.post_create_post)

router.get("/post/:id", post_controller.post_detail)

router.get("/posts", post_controller.post_list)

module.exports = router;
