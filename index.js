require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");

const app = express();
const port = process.env.APP_PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const usersRouter = require("./api/users/user.router");
const brandsRouter = require("./api/brands/brand.router");
const companyRouter = require("./api/company/company.router");
const genericRouter = require("./api/generic/generic.router");
const productRouter = require("./api/products/product.router");
const chemistDrugistRouter = require("./api/chemist_drugist/chemistDrugist.router");
const orderRouter = require("./api/orders/order.router");
const newsRouter = require("./api/news/news.router");
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/generic", genericRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/chemist-drugist", chemistDrugistRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/news", newsRouter);

app.listen(port, () => {
  console.log("app started on port " + port);
});
