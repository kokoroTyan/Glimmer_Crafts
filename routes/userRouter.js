const express = require("express");
const userRouter = express.Router();

const fs = require("fs");
const path = require("path");
const { findUserByName } = require("../data/users");

function rewriteUsersBD() {
  const jsonUsers = JSON.stringify(users, null, 4);
  fs.writeFileSync(path.join(__dirname, "../data/users.json"), jsonUsers);
  users = require("../data/users.json");
}

let { products } = require("../data/products");
let users = require("../data/users.json");
let prodArray = { prods: products, userLoggedIn: false, userData: {} };


module.exports = function(prodArray) {
  // processing query to log into an existing account
  userRouter.get("/authorise", (req, res) => {
    for (let i = 0; i < users.length; i++) {
      if (
        req.query.username === users[i].username &&
        req.query.password === users[i].password
      ) {
        prodArray.userData = users[i];
        prodArray.userLoggedIn = true;
        break;
      }
    }
    res.redirect("/");
  });
  // processing query to create a new account
  userRouter.post("/register", (req, res) => {
    for (let i = 0; i < users.length; i++) {
      if (req.body.username === users[i].username) {
        res.status(412);
      }
    }
    prodArray.userData = req.body;
    prodArray.userLoggedIn = true;
    users.push({
      username: req.body.username,
      password: req.body.password,
      pfp: "",
      isSeller: false,
      featured: [],
      cart: [],
      added: [],
    });
    rewriteUsersBD();
    res.redirect("/");
  });

  // processing query to edit an account
  userRouter.post("/edit", (req, res) => {
    users[users.indexOf(findUserByName(prodArray.userData.username))].username =
      req.body.username;
    users[users.indexOf(findUserByName(prodArray.userData.username))].password =
      req.body.password;
    prodArray.userData.username = req.body.username;
    prodArray.userData.password = req.body.password;
    if (req.files) {
      fs.writeFileSync(
        path.join(__dirname, `../src/images/pfp/${req.files.pfp.name}`),
        req.files.pfp.data
      );
      fs.unlink(path.join(__dirname, `../src${prodArray.userData.pfp}`), (err) => {
        if (err) throw err;
      });
      users[
        users.indexOf(findUserByName(prodArray.userData.username))
      ].pfp = `/images/pfp/${req.files.pfp.name}`;
      prodArray.userData.pfp = `/images/pfp/${req.files.pfp.name}`;
    }
  
    rewriteUsersBD();
    res.redirect("/user");
  });

  // changing users status to "seller"
  userRouter.get("/becomeSeller", (req, res) => {
    users[users.indexOf(findUserByName(prodArray.userData.username))].isSeller = true;
    prodArray.userData.isSeller = true;
    rewriteUsersBD();
    res.end();
  })

  // processing query to log out of the account
  userRouter.get("/logout", (req, res) => {
    prodArray.userLoggedIn = false;
    prodArray.userData = {};
    res.redirect("/");
  });

  return userRouter;
};