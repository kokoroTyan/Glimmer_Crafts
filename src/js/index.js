// ---------------------------------------------- functions from header, available on any page ----------------------------------------------


// opening forms to sign in/up
function signIn() {
    document.querySelector(".container").style.display = "block";
}
function signUp() {
    document.querySelectorAll(".container")[1].style.display = "block";
}

// switching from sign in(up) to sign up(in) form by link
document.querySelector(".switchToSignUp").onclick = () => {
    document.querySelector(".container").style.display = "none";
    document.querySelectorAll(".container")[1].style.display = "block";
};
document.querySelector(".switchToSignIn").onclick = () => {
    document.querySelector(".container").style.display = "block";
    document.querySelectorAll(".container")[1].style.display = "none";
};

// opening users profile
async function openProfile(div) {
    window.location.href = `/user?username=${div.innerText}`;
};

// sending request to log out of the account
async function logOut() {
    const response = await fetch('/api/user/logout', { method: 'GET' });
    if (response.ok) {
        window.location.href = '/';
    } else {
        console.log('Logout request failed.');
    }
}

// function to close forms
function closeRegForm() {
    document.querySelectorAll(".container").forEach(el => el.style.display = "none");
    document.querySelector(".becomeSeller").style.display = "none";
}

// opening product page
async function openProduct(elem) {
    let name = "";
    if (elem.parentElement.innerText === "") {
        name = elem.parentElement.parentElement.querySelector("h4").innerText;
    } else {
        name = elem.innerHTML;
    }
    window.location.href = `/product?name=${name}`;
}


