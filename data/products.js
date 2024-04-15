const fs = require("fs");
const path = require("path");

let products = JSON.parse(fs.readFileSync(path.join(__dirname, "./products.json")));

// поиск товара по имени из всего списка
function findProductByName(name){
    products = JSON.parse(fs.readFileSync(path.join(__dirname, "./products.json")))
    for(i=0; i<products.length; i++){
        if(products[i].name === name){
            return products[i];
        }
    }
    return;
}
// поиск товара по подстроке, содержащейся в имени, из всего списка
function findProductBySubName(subname){
    products = JSON.parse(fs.readFileSync(path.join(__dirname, "./products.json")));
    let result = [];
    for(i=0; i<products.length; i++){
        if(products[i].name.toLowerCase().includes(subname)){
            result.push(products[i]);
        }
    }
    return result;
}

module.exports = {products, findProductByName, findProductBySubName};