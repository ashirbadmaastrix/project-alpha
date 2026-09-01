const express = require("express");

const router = express.Router();

const {
    CreateFeatureProduct,
    GetFeatureProducts
} = require("../controllers/featureProductController");


router.post(
    "/feature-products",
    CreateFeatureProduct
);


router.get(
    "/feature-products",
    GetFeatureProducts
);


module.exports = router;