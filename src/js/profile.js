// ---------------------------------------------- functions from profile page ----------------------------------------------


// удаление из списка понравившихся конкретного товара
async function deleteFromFeaturedList(button) {
    const response = await fetch('/user-actions/removeFromFeatured', {
        method: 'POST',
        body: JSON.stringify({ name: button.parentElement.querySelector("h4").innerText }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.status === 200) {
        button.parentElement.style.display = "none";
    }
}

// удаление из корзины конкретного товара
async function deleteFromCartList(button) {
    const response = await fetch('/user-actions/removeFromCart', {
        method: 'POST',
        body: JSON.stringify({ name: button.parentElement.querySelector("h4").innerText }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        button.parentElement.style.display = "none";
    }
}

// "открытие" формы для регистрации данных аккаунта
function editProfile() {
    document.querySelectorAll(".container")[0].style.display = "block";
}

// обработка файлов, загруженных в качестве нового аватара пользователя
function handleFiles(elem) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('profileImagePreview').src = e.target.result;
    }
    reader.readAsDataURL(elem.files[0]);
}

// отображение всех понравившихся пользователю товаров
function viewFeatured(elem) {
    if (!elem.classList.contains("opened")) {
        document.querySelector(".featured").style.display = "flex";
        elem.classList.add("opened");
    } else {
        document.querySelector(".featured").style.display = "none";
        elem.classList.remove("opened");
    }
}
// отображение всех товаров в корзине пользователя
function viewCart(elem) {
    if (!elem.classList.contains("opened")) {
        document.querySelector(".userCart").style.display = "flex";
        elem.classList.add("opened");
    } else {
        document.querySelector(".userCart").style.display = "none";
        elem.classList.remove("opened");
    }
}

// отображение формы для того, чтобы получить возможность добавлять товары
function becomeSellerOpenForm() {
    document.querySelector(".becomeSeller").style.display = "block";
}

// генерация капчи в форме отображенной выше
function genCaptcha() {
    const captcha = ["dcvk.jfif", "dqan2.jfif", "ds55.jfif", "hahsk.jfif", "hyd8.jfif", "qnks.jfif", "qz87.jfif", "skpsm.jfif", "sm7z5.jfif", "ssxk.jfif", "syhz.jfif", "v7cnd.jfif", "v24h.jfif", "vxdq.jfif", "z5qx.jfif"]
    let path = `/images/captcha/${captcha[Math.round(Math.random() * 14)]}`;
    document.getElementById("captchaImg").src = path;
    return;
}

// передает запрос на сервер чтобы сделать пользователя "продавцом", если капча введена правильно
async function becomeSeller() {
    const captchaFile = (document.getElementById("captchaImg").src.split("/"))[5];
    if ((captchaFile.split("."))[0] === document.getElementById("captchaCheck").value) {
        const response = await fetch("/api/user/becomeSeller");
        if (response.ok) {
            location.reload();
        }
    } else {
        alert("Sorry, please, try again!");
        document.getElementById("captchaCheck").value = "";
        genCaptcha();
    }
}

// открытие формы для добавления товара
function openAddForm() {
    document.querySelectorAll(".container")[1].style.display = "block";
};

// обработчик добавления изображения товару
function handleFile(elem) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('productImagePreview').src = e.target.result;
    }
    reader.readAsDataURL(elem.files[0]);
}

// просмотр уже добавленных товаров
function viewProds(elem) {
    if (!elem.classList.contains("opened")) {
        document.querySelector(".addedProducts").style.display = "block";
        elem.classList.add("opened");
    } else {
        document.querySelector(".addedProducts").style.display = "none";
        elem.classList.remove("opened");
    }
}

// создание массива из всех кнопок для удаления товара, добавленного пользователем 
let deleteArr = document.querySelectorAll(".deleteProd");
// добавление для каждой кнопки обработчиков нажатия(удаление) и отправка соответствующего запросов на сервер
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
