require("dotenv").config();
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1; //query param in url

    Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then((products) => {
            Product.countDocuments()
                .then((totalProductsCount) => {
                    const pagesCount = Math.ceil(
                        totalProductsCount / ITEMS_PER_PAGE
                    );
                    return {
                        totalPages: pagesCount,
                        currPage: page,
                        hasPrev: page > 1,
                        hasNext: page < pagesCount,
                    };
                })
                .then((pagingData) => {
                    return res.render("shop/product-list", {
                        products,
                        docTitle: "All Products",
                        path: "/products",
                        pagination: pagingData,
                    });
                });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
        .then((product) => {
            res.render("shop/product-detail", {
                product,
                docTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1; //query param in url

    //Product.find()
    //    .countDocuments()
    //    .then((numProducts) => {
    //        totalItems = numProducts;
    //        return Product.find()
    //            .skip((page - 1) * ITEMS_PER_PAGE) //skips elements (in SQL use OFFSET)
    //            .limit(ITEMS_PER_PAGE); //limits amount of data fetched
    //    })
    //    .then((products) => {
    //        res.render("shop/index", {
    //            products,
    //            docTitle: "Shop",
    //            path: "/",
    //            currentPage: page,
    //            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    //            hasPreviousPage: page > 1,
    //            nextPage: page + 1,
    //            previousPage: page - 1,
    //            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    //        });
    //    })
    Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then((products) => {
            Product.countDocuments()
                .then((totalProductsCount) => {
                    const pagesCount = Math.ceil(
                        totalProductsCount / ITEMS_PER_PAGE
                    );
                    return {
                        totalPages: pagesCount,
                        currPage: page,
                        hasPrev: page > 1,
                        hasNext: page < pagesCount,
                    };
                })
                .then((pagingData) => {
                    return res.render("shop/index", {
                        products,
                        docTitle: "Shop",
                        path: "/",
                        pagination: pagingData,
                    });
                });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                path: "/cart",
                docTitle: "Your Cart",
                products,
                isCartEmpty: products.length > 0 ? true : false,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.user
        .removeFromCart(productId)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            products = user.cart.items;
            total = 0;
            products.forEach((prod) => {
                total += prod.quantity * prod.productId.price;
            });

            return stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: products.map((p) => {
                    return {
                        name: p.productId.title,
                        description: p.productId.description,
                        amount: p.productId.price * 100,
                        currency: "usd",
                        quantity: p.quantity,
                    };
                }),
                success_url:
                    req.protocol +
                    "://" +
                    req.get("host") +
                    "/checkout/success",
                cancel_url:
                    req.protocol + "://" + req.get("host") + "/checkout/cancel",
            });
        })
        .then((session) => {
            res.render("shop/checkout", {
                path: "/checkout",
                docTitle: "Checkout",
                products,
                totalSum: total,
                sessionId: session.id,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCheckoutSuccess = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items.map((item) => {
                return {
                    quantity: item.quantity,
                    product: { ...item.productId._doc },
                };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user,
                },
                products: products,
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            res.render("shop/orders", {
                path: "/orders",
                docTitle: "Your Orders",
                orders: orders,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    //match orderId with user that created the order
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error("No order found."));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Unauthorized"));
            }

            const invoiceName = "invoice-" + orderId + ".pdf";
            const invoicePath = path.join("data", "invoices", invoiceName);

            //create new PDF doc
            const pdfDoc = new PDFDocument();

            //Set response headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "inline; filename='" + invoiceName + "'"
            );

            //write pdf file and pipe it to response stream object
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            //Style the pdf
            pdfDoc.fontSize(26).text("Invoice", {
                underline: true,
            });

            pdfDoc.text("----------------------");

            let totalPrice = 0;
            order.products.forEach((prod) => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.product.title +
                            " - " +
                            prod.quantity +
                            " x " +
                            "$" +
                            prod.product.price
                    );
            });

            pdfDoc.text("---------------");
            pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

            //closes the streams
            pdfDoc.end();

            //Read file stores read data temporarily in memory
            //Watch can cause a memory overflow
            //fs.readFile(invoicePath, (err, data) => {
            //    if (err) {
            //        return next(err);
            //    }
            //    // res.download(invoicePath) //If is to download
            //    res.setHeader("Content-Type", "application/pdf");
            //    //How content should be served to browser:
            //    res.setHeader(
            //        "Content-Disposition",
            //        //attachment to auto-download on "Invoice" link click
            //        //Note for this to work need incognito-mode on Chrome
            //        //"attachment; filename='" + invoiceName + "'"
            //        "inline; filename='" + invoiceName + "'"
            //    );
            //    res.send(data);
            //});

            //Reads file in chunks
            //const file = fs.createReadStream(invoicePath);
            //res.setHeader("Content-Type", "application/pdf");
            //res.setHeader(
            //    "Content-Disposition",
            //    "inline; filename='" + invoiceName + "'"
            //);
            //file.pipe(res); //res is a writeable stream
        })
        .catch((err) => next(err));
};
