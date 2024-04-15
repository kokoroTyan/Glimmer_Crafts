// ---------------------------------------------- functions from product page ----------------------------------------------


// creating an array of all buttons to add/remove product to featured
let heartArr = document.querySelectorAll(".addToFeatured");
// adding event listeners to each button and sending requests to add to/remove from featured
heartArr.forEach(button => {
    button.addEventListener("click", async function(){
        if(!button.classList.contains("clicked") && document.querySelector(".user-actions").innerHTML.includes("h3")){
            const response = await fetch('/user-actions/addToFeatured', {
                method: 'POST',
                body: JSON.stringify({name: button.parentElement.parentElement.querySelector("h4").innerText}),
                headers: {'Content-Type': 'application/json'}
            });
            if(response.status === 200){
                button.classList.add("clicked");
                button.innerText = "♥";
                return;
            } else if(response.status === 400){
                button.classList.remove("clicked");
                alert("This item is already in your 'featured' list!");
                return;
            }
        } else if(button.classList.contains("clicked")) {
            const response = await fetch('/user-actions/removeFromFeatured', {
                method: 'POST',
                body: JSON.stringify({name: button.parentElement.parentElement.querySelector("h4").innerText}),
                headers: {'Content-Type': 'application/json'}
            });
            if(response.status === 200){
                button.classList.remove("clicked");
                button.innerText = "♡";   
            } else {
                alert("Sorry, occured an error while removing :(");
            }
        } else{
            signIn();
            alert("To add something to featured you have to log into an account!");
            return;  
        }
    });
});

// creating an array of all buttons to add/remove product to cart
let cartArr = document.querySelectorAll(".addToCart");
// adding event listeners to each button and sending requests to add to/remove from cart
cartArr.forEach(button => {
    button.addEventListener("click", async function(){
        if(!button.classList.contains("clicked") && document.querySelector(".user-actions").innerHTML.includes("h3")){
            const response = await fetch('/user-actions/addToCart', {
                method: 'POST',
                body: JSON.stringify({name: button.parentElement.parentElement.querySelector("h4").innerText}),
                headers: {'Content-Type': 'application/json'}
            });
            if(response.status === 200){
                button.classList.add("clicked");
                button.innerText = "In cart!";
                return;
            } else if(response.status === 400){
                button.classList.remove("clicked");
                alert("This item is already in your cart!");
                return;
            }
        } else if(button.classList.contains("clicked")) {
            const response = await fetch('/user-actions/removeFromCart', {
                method: 'POST',
                body: JSON.stringify({name: button.parentElement.parentElement.querySelector("h4").innerText}),
                headers: {'Content-Type': 'application/json'}
            });
            if(response.status === 200){
                button.classList.remove("clicked");
                button.innerHTML = "Add to cart";   
            } else {
                alert("Sorry, occured an error while removing :(");
            }
        } else{
            signIn();
            alert("To add something to cart you have to log into an account!");
            return;  
        }
    });
});

// sending request to delete product
document.querySelector(".deleteProd").addEventListener("click", async function () {
    const response = await fetch(`/product/delete?name=${document.querySelector(".deleteProd").parentElement.parentElement.querySelector("h4").innerText}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        location.replace("/");
        return;
    } else{
        alert("Sorry, occured an error while deleting");
        return;
    }
});


// showing form to add a new review
function showReview(){
    if(document.querySelector(".user-actions").innerHTML.includes("h3")){
        document.getElementById("addReviewForm").style.display = "flex";
        document.getElementById("showReviewForm").style.display = "none";
        return;
    }
    signIn();
    alert("To add a review you have to log into an account!");
}
// closing review form
function closeReviewForm(){
    document.getElementById("addReviewForm").style.display = "none";
    document.getElementById("showReviewForm").style.display = "block";
}

// function capable of "stars" in adding a review
function handleStarButtonClick(clickedButton) {
    const starButtons = Array.from(document.querySelectorAll('.star'));
    for (let i = 0; i < starButtons.length; i++) {
        if(i === starButtons.indexOf(clickedButton)){
            starButtons[i].innerHTML = "★";
            for (let j = 0; j <i; j++) {
                starButtons[j].innerHTML = "★"
            }
            for (let k = i+1; k<5; k++) {
                starButtons[k].innerHTML = "☆"
            }
        }
    }
}

// sending a request to add a new review
async function addReview(elem){
    const reviewText = elem.parentElement.querySelector("#usersReview").value;
    const prodName = elem.parentElement.parentElement.parentElement.querySelector("h4").innerText;
    const user = document.querySelector(".user-actions").querySelector("h3").innerText;
    const stars = document.querySelectorAll(".stars")[document.querySelectorAll(".stars").length - 1].innerText;
    console.log(stars)
    document.getElementById("addReviewForm").style.display = "none";
    const response = await fetch('/product/addReview', {
        method: 'POST',
        body: JSON.stringify({review: reviewText, name: prodName, user: user, stars: stars}),
        headers: {'Content-Type': 'application/json'}
    });
    if(response.ok){
        location.reload();
    }
}

// opening the form to edit product & filling in textarea with existing description
let editArr = document.querySelector(".editProd").addEventListener("click", function () {
    document.querySelectorAll(".container")[2].style.display="flex";
    document.getElementById("description").innerText = document.querySelector(".text").querySelector("p").innerText;
});

// function to handle files loaded in editing product form
function handleFile(elem) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('productImagePreview').src = e.target.result;
    }
    reader.readAsDataURL(elem.files[0]);
}