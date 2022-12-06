const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

let headerToken2 = localStorage.getItem("accessToken");
let credits = localStorage.getItem("credits");
let username2 = localStorage.getItem("username");

if (headerToken2 != null) {
  document.getElementById("navbar-default").innerHTML = `
                <ul class=" items-center lg:flex lg:space-x-28 mr-42 text-2xl font-header-font ">
                    <li><a href="./index.html" class="hover:underline">Home</a></li>
                    <li><a href="./profile.html?id=${username2}" class="hover:underline">Profile</a></li>
                    <li><a href="./index.html" id="logoutBtn" class="hover:underline">Log Out</a></li>
                </ul>
    `;
  document.getElementById(
    "hamburgerMenu"
  ).innerHTML = `<p class="hidden mr-4 w-full lg:block lg:w-auto" >Credits: <b>${credits}</b></p>`;
}

const logoutBtn = document.getElementById("logoutBtn");

function logoutFunction() {
  localStorage.clear();
}

logoutBtn.addEventListener("click", logoutFunction);
