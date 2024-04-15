const express = require("express");
const prodRouter = express.Router();

const fs = require("fs");
const path = require("path");
const { findUserByName } = require("../data/users");

function rewriteUsersBD() {
  const jsonUsers = JSON.stringify(users, null, 4);
  fs.writeFileSync(path.join(__dirname, "../data/users.json"), jsonUsers);
  users = require("../data/users.json");
}
function rewriteProductsBD() {
  const jsonProducts = JSON.stringify(products, null, 4);
  fs.writeFileSync(path.join(__dirname, "../data/products.json"), jsonProducts);
  products = require("../data/products.json");
}

let { products, findProductByName } = require("../data/products");
let users = require("../data/users.json");
let prodArray = { prods: products, userLoggedIn: false, userData: {} };

module.exports = function (prodArray) {
  // deleting an already existing product
  prodRouter.delete("/delete", (req, res) => {
    const filtered = findUserByName(prodArray.userData.username).added.filter(
      (obj) => obj.name !== req.query.name);
    findUserByName(prodArray.userData.username).added = filtered;
  
  
    let filteredAll = [];
    for (let i = 0; i < products.length; i++) {
      if(products[i].name !== req.query.name){
        filteredAll.push(products[i]);
      }  
    }
    let filteredCart = [];
    for (let i = 0; i < prodArray.userData.cart.length; i++) {
      if(prodArray.userData.cart[i].name !== req.query.name){
        filteredCart.push(prodArray.userData.cart[i]);
      }  
    }
    let filteredLike = [];
    for (let i = 0; i < prodArray.userData.featured.length; i++) {
      if(prodArray.userData.featured[i].name !== req.query.name){
        filteredLike.push(prodArray.userData.featured[i]);
      }  
    }
    prodArray.userData.cart = filteredCart;
    prodArray.userData.featured = filteredLike;
    findUserByName(prodArray.userData.username).featured = prodArray.userData.featured;
    findUserByName(prodArray.userData.username).cart = prodArray.userData.cart;
  
    if(findProductByName(req.query.name).img.includes("images")){
      fs.unlink(path.join(__dirname, `../src${findProductByName(req.query.name).img}`), (err) => {
        if (err) throw err;
      });
    }
    
    products = filteredAll;
    prodArray.prods = products;
    rewriteUsersBD();
    rewriteProductsBD();
    res.render("products.hbs", prodArray);
  })
  
  // editing a product that was added by a user before
  prodRouter.post("/edit", (req, res) => {
    const namesArr = products.map((obj) => obj.name);
    if(namesArr.includes(req.body.name)){
      res.redirect(`/product?name=${prodArray.product.name}`);
    }
    const firstName = findProductByName(prodArray.product.name).name;
    let editedProd = products[products.findIndex(el => el.name === firstName)];
    if (req.files) {
      fs.writeFileSync(
        path.join(__dirname, `../src/images/products/${req.files.pdPict.name}`),
        req.files.pdPict.data
      );
      if(findProductByName(firstName).img.includes("/images/products/")){
        fs.unlink(path.join(__dirname, `../src${editedProd.img}`), (err) => {
          if (err) throw err;
        });
      }
      editedProd.img = `/images/products/${req.files.pdPict.name}`;
    }
    editedProd.name = req.body.name;
    editedProd.desc = req.body.description;
    editedProd.price = req.body.price;
    editedProd.category = req.body.category;
    
    for (let i = 0; i < prodArray.userData.added.length; i++) {
      if(prodArray.userData.added[i].name === firstName){
        prodArray.userData.added[i]=editedProd;
      }
    }
    for (let i = 0; i < prodArray.userData.featured.length; i++) {
      if(prodArray.userData.featured[i].name === firstName){
        prodArray.userData.featured[i]=editedProd;
      }
    }
    for (let i = 0; i < prodArray.userData.cart.length; i++) {
      if(prodArray.userData.cart[i].name === firstName){
        prodArray.userData.cart[i]=editedProd;
      }
    }
    
    prodArray.product = editedProd;
    prodArray.prods = products;
    users[users.findIndex(el => el.name === prodArray.userData.username)] = prodArray.userData;
    rewriteProductsBD();
    rewriteUsersBD();
    res.redirect(`/product?name=${prodArray.product.name}`);
  });
  
  // adding a new review to a product
  prodRouter.post("/addReview", (req, res) => {
    prodArray.product.reviews.push({
      username: req.body.user,
      reviewtext: req.body.review,
      stars: req.body.stars,
    })
    products[products.findIndex(el => el.name === req.body.name)] = prodArray.product;
    rewriteProductsBD();
    res.render("prodView.hbs", prodArray);
  });
  
  // adding a new product
  prodRouter.post("/add", (req, res) => {
    const namesArr = products.map((obj) => obj.name);
    if(namesArr.includes(req.body.name)){
      res.redirect('/user');
    }
    let newProduct = {
      img: `/images/products/${req.files.pdPict.name}`,
      name: req.body.name,
      desc: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      seller: prodArray.userData.username,
      rating: 0,
      reviews: []
    }
  
    if (req.files) {
      fs.writeFileSync(path.join(__dirname, `../src/images/products/${req.files.pdPict.name}`), req.files.pdPict.data);
    } else {
      newProduct.img = "https://turbok.by/public/img/no-photo--lg.png";
    };
    products.push(newProduct);
    prodArray.userData.added.push(newProduct);
    rewriteUsersBD();
    rewriteProductsBD();
    res.redirect('/user');
  })

  return prodRouter;
};
