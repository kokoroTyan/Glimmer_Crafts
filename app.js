const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const hbs = require("hbs");
const port = 2007;


// connecting all needed modules
app.set("view engine", "hbs");
app.use(express.json());
app.use(bodyParser.text());
app.use("/api/user/register", bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({}));
hbs.registerPartials(path.join(__dirname, "/views/partials"));
let { products, findProductByName } = require("./data/products");


// a variable that contains all info for rendering a page with hbs
let prodArray = { prods: products, userLoggedIn: false, userData: {} };


// register helpers for further use in hbs
hbs.registerHelper("addFeaturedButton", function (userData, prodName) {
  if (userData) {
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].name === prodName) {
        return true;
      }
    }
  }
  return false;
});
hbs.registerHelper("addCartButton", function (userData, prodName) {
  if (userData) {
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].name === prodName) {
        return true;
      }
    }
  }
  return false;
});
hbs.registerHelper("addSellerButtons", function (userData, prodName) {
  if (userData) {
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].name === prodName) {
        return true;
      }
    }
  }
  return false;
})

// opening main page, setting the catalog of files for further use in hbs
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.render("products.hbs", prodArray);
});

// opening user profile
app.get("/user", (req, res) => {
  res.render("profile.hbs", prodArray);
});

// opening product page
app.get("/product", (req, res) => {
  prodArray.product = findProductByName(req.query.name);
  res.render("prodView.hbs", prodArray);
});


// processing all query connected with user
const userRouter = require("./routes/userRouter")(prodArray);
app.use('/api/user', userRouter);

//processing all query from main page
const mainRouter = require("./routes/mainRouter")(prodArray);
app.use('/main', mainRouter);

// processing all query connecting with user actions
const userActionsRouter = require("./routes/userActionsRouter")(prodArray);
app.use('/user-actions', userActionsRouter);

// processing all query connecting with product
const productRouter = require("./routes/productRouter")(prodArray);
app.use('/product', productRouter);


// processing any other invalid query
app.use((req, res, next) => res.status(404).send("<h2>Not found</h2>"));
// listening to server
app.listen(port, () => console.log(`Server listening on port ${port}`));


