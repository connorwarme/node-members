var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

/* GET users listing. */
router.get('/', user_controller.user_list);

router.get('/sign-up', user_controller.user_create_get)
router.post('/sign-up', user_controller.user_create_post)

router.get('/login', user_controller.user_login_get)
router.post('/login', user_controller.user_login_post)

router.get('/logout', user_controller.user_logout_get)

router.get("/:id", user_controller.user_detail)

module.exports = router;