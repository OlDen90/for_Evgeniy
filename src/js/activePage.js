document.addEventListener("DOMContentLoaded", function () {
    // window.addEventListener("load", function () {
    // Получение текущего URL страницы
    var currentUrl = window.location.href;

    // Получение всех ссылок в меню
    var menuLinks = document.querySelectorAll(".menu__link");

    // Проход по ссылкам и проверка совпадает ли URL
    menuLinks.forEach(function (link) {
        if (link.href === currentUrl) {
            link.classList.add("active");
        }
    });
});