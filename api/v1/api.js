const express = require("express");
const router = express.Router();

const loginAPI = require("./api_login");
const registerAPI = require("./api_register");
const customerAPI = require("./api_customer");
const categoryAPI = require("./api_category");
const productAPI = require("./api_products");
const buyAPI = require("./api_buyProducts");
const saleAPI = require("./api_saleProducts");

router.use(loginAPI);
router.use(registerAPI);
router.use(customerAPI);
router.use(categoryAPI);
router.use(productAPI);
router.use(buyAPI);
router.use(saleAPI);

module.exports = router;
