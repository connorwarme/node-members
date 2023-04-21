var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

/* GET users listing. */
router.get('/', user_controller.user_list);

router.get('/sign-up', user_controller.user_create_get)
router.post('/sign-up', user_controller.user_create_post)

router.get("/:id", user_controller.user_detail)

module.exports = router;