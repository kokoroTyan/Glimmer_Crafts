const express = require("express");
const userActionsRouter = express.Router();

const fs = require("fs");
const path = require("path");
const { findUserByName } = require("../data/users");

function rewriteUsersBD() {
  const jsonUsers = JSON.stringify(users, null, 4);
  fs.writeFileSync(path.join(__dirname, "../data/users.json"), jsonUsers);
  users = require("../data/users.json");
}

let { products, findProductByName } = require("../data/products");
let users = require("../data/users.json");
let prodArray = { prods: products, userLoggedIn: false, userData: {} };

module.exports = function (prodArray) {
    // adding a product to users featured
  userActionsRouter.post("/addToFeatured", (req, res) => {
    if (
      prodArray.userLoggedIn &&
      !findUserByName(prodArray.userData.username).featured.includes(
        findProductByName(req.body.name)
      )
    ) {
      findUserByName(prodArray.userData.username).featured.push(
        findProductByName(req.body.name)
      );
      rewriteUsersBD();
      res.end().status(200);
    } else {
      res.end().status(400);
    }
  });

  // removing a product from users featured
  userActionsRouter.post("/removeFromFeatured", (req, res) => {
    if (prodArray.userLoggedIn) {
      let filtered = findUserByName(
        prodArray.userData.username
      ).featured.filter((obj) => obj.name !== req.body.name);
      findUserByName(prodArray.userData.username).featured = filtered;
      rewriteUsersBD();
      res.end().status(200);
    }
    res.status(400);
  });

  // adding a product to users cart
  userActionsRouter.post("/addToCart", (req, res) => {
    if (
      prodArray.userLoggedIn &&
      !findUserByName(prodArray.userData.username).cart.includes(
        findProductByName(req.body.name)
      )
    ) {
      findUserByName(prodArray.userData.username).cart.push(
        findProductByName(req.body.name)
      );
      rewriteUsersBD();
      res.end().status(200);
    } else {
      res.end().status(400);
    }
  });

  // removing a product from users cart
  userActionsRouter.post("/removeFromCart", (req, res) => {
    if (prodArray.userLoggedIn) {
      let filtered = findUserByName(prodArray.userData.username).cart.filter(
        (obj) => obj.name !== req.body.name
      );
      findUserByName(prodArray.userData.username).cart = filtered;
      rewriteUsersBD();
      res.end().status(200);
    }
    res.status(400);
  });

  return userActionsRouter;
};
