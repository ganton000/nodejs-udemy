const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const addProductValidator = () => {
    return [
        body("title")
            .trim()
            .isAlphanumeric()
            .isLength({ min: 3 })
            .withMessage(
                "Title must be atleast 3 characters long and alphanumeric only"
            ),
        body("price").isFloat().withMessage("Must be a valid float"),
        body("description")
            .isLength({ min: 5, max: 400 })
            .trim()
            .withMessage("Description must be at minimum 5 characters long"),
    ];
};

const editProductValidator = () => {
    return [
        body("title")
            .trim()
            .isString()
            .isLength({ min: 3 })
            .withMessage(
                "Title must be atleast 3 characters long and a string"
            ),
        body("price").isFloat().withMessage("Must be a valid float"),
        body("description")
            .isLength({ min: 5, max: 400 })
            .trim()
            .withMessage("Description must be at minimum 5 characters long"),
    ];
};

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
    "/add-product",
    isAuth,
    addProductValidator(),
    adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

////// /admin/products
router.get("/products", isAuth, adminController.getProducts);

router.post(
    "/edit-product",
    isAuth,
    editProductValidator(),
    adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
