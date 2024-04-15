// ---------------------------------------------- functions from main page ----------------------------------------------


// opening the form with filters
function showFilters() {
    document.querySelector(".filters").style.display = "block";
}

// closing fiters form
function closeFilters() {
    document.querySelector(".filters").style.display = "none";
    document.getElementById("minPrice").value = '';
    document.getElementById("maxPrice").value = '';
    document.getElementById("category").value = '';
    document.getElementById("sortBy").value = '';
    return;
}

// sending a request to filter products
async function filterProducts() {
    let minPrice = document.getElementById("minPrice").value;
    let maxPrice = document.getElementById("maxPrice").value;
    let category = document.getElementById("category").value;
    let sorting = document.getElementById("sortBy").value;

    let selectQuery = `/filter?`;
    if (minPrice) {
        selectQuery += `minPrice=${minPrice}&&`;
    } else {
        selectQuery += `minPrice=0&&`;
    }
    if (maxPrice) {
        selectQuery += `maxPrice=${maxPrice}&&`;
    } else {
        selectQuery += `maxPrice=999999&&`;
    }
    selectQuery += `category=${category}&&sorting=${sorting}`;

    const response = await fetch(`/main${selectQuery}`);
    if (response.ok) {
        closeFilters();
        location.reload();
    }
}

// sending request to clear the results of filtration
async function clearFilters() {
    const response = await fetch(`/main/clearFilters`);
    if (response.ok) {
        closeFilters();
        location.reload();
    }
}

// sending request to search product by subname after clicking "Enter"
document.getElementById("searchProduct").addEventListener('keypress', async function (e) {
    if (e.keyCode == 13) {
        const response = await fetch(`/main/search?subname=${this.value}`)
        if (response.ok) {
            location.reload();
            document.getElementById("searchProduct").value = "";
        }
    }
});

// creating an array of all buttons to add/remove product to featured
let heartArr = document.querySelectorAll(".addToFeatured");
// adding event listeners to each button and sending requests to add to/remove from featured
heartArr.forEach(button => {
    button.addEventListener("click", async function () {
        if (!button.classList.contains("clicked") && document.querySelector(".user-actions").innerHTML.includes("h3")) {
            const response = await fetch('/user-actions/addToFeatured', {
                method: 'POST',
                body: JSON.stringify({ name: button.parentElement.parentElement.querySelector("h4").innerText }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                button.classList.add("clicked");
                button.innerText = "♥";
                return;
            } else if (response.status === 400) {
                button.classList.remove("clicked");
                alert("This item is already in your 'featured' list!");
                return;
            }
        } else if (button.classList.contains("clicked")) {
            const response = await fetch('/user-actions/removeFromFeatured', {
                method: 'POST',
                body: JSON.stringify({ name: button.parentElement.parentElement.querySelector("h4").innerText }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                button.classList.remove("clicked");
                button.innerText = "♡";
            } else {
                alert("Sorry, occured an error while removing :(");
            }
        } else {
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
    button.addEventListener("click", async function () {
        if (!button.classList.contains("clicked") && document.querySelector(".user-actions").innerHTML.includes("h3")) {
            const response = await fetch('/user-actions/addToCart', {
                method: 'POST',
                body: JSON.stringify({ name: button.parentElement.parentElement.querySelector("h4").innerText }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                button.classList.add("clicked");
                button.innerText = "In cart!";
                return;
            } else if (response.status === 400) {
                button.classList.remove("clicked");
                alert("This item is already in your cart!");
                return;
            }
        } else if (button.classList.contains("clicked")) {
            const response = await fetch('/user-actions/removeFromCart', {
                method: 'POST',
                body: JSON.stringify({ name: button.parentElement.parentElement.querySelector("h4").innerText }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                button.classList.remove("clicked");
                button.innerHTML = "Add to cart";
            } else {
                alert("Sorry, occured an error while removing :(");
            }
        } else {
            signIn();
            alert("To add something to cart you have to log into an account!");
            return;
        }
    });
});

// creating an array of all buttons to delete a product
let deleteArr = document.querySelectorAll(".deleteProd");
// adding event listeners to each button and sending requests to delete product
deleteArr.forEach(button => {
    button.addEventListener("click", async function () {
        const response = await fetch(`/product/delete?name=${button.parentElement.parentElement.querySelector("h4").innerText}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            location.reload();
            return;
        } else{
            alert("Sorry, occured an error while deleting");
            return;
        }
    });
});
