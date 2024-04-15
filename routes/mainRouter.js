const express = require("express");
const mainRouter = express.Router();

const fs = require("fs");
const path = require("path");


let { products, findProductBySubName } = require("../data/products");
let prodArray = { prods: products, userLoggedIn: false, userData: {} };

module.exports = function (prodArray) {
  // searching for a product by its subname
  mainRouter.get("/search", (req, res) => {
    prodArray.prods = findProductBySubName(req.query.subname);
    res.redirect("/");
  });

  // filtering products by price & category, choosing the format of sorting
  mainRouter.get("/filter", (req, res) => {
    prodArray.prods = products;
    const { minPrice, maxPrice, category, sorting } = req.query;
    prodArray.prods = prodArray.prods
      .filter((prod) => prod.price >= minPrice)
      .filter((prod) => prod.price <= maxPrice)
      .filter((prod) => prod.category == category);

    switch (sorting) {
      case "priceAsc":
        prodArray.prods = prodArray.prods.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        prodArray.prods = prodArray.prods.sort((a, b) => b.price - a.price);
        break;
      case "ratingAsc":
        prodArray.prods = prodArray.prods.sort((a, b) => a.rating - b.rating);
        break;
      case "ratingDesc":
        prodArray.prods = prodArray.prods.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    res.redirect("/");
  });

  // cleaning filters that were used before
  mainRouter.get("/clearFilters", (req, res) => {
    prodArray.prods = products;
    res.redirect("/");
  });

  return mainRouter;
};
