const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
let headerToken2 = localStorage.getItem("accessToken");
let username2 = localStorage.getItem("username");

const API_BASE_URL2 = "https://api.noroff.dev";
const creditsUrl = `/api/v1/auction/profiles/${username2}`;
const fullURL = `${API_BASE_URL2}${creditsUrl}`;

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

if (headerToken2 != null) {
  document.getElementById("navbar-default").innerHTML = `
                <ul class=" items-center lg:flex lg:space-x-28 mr-42 text-2xl font-header-font ">
                    <li><a href="./index.html" class="hover:underline">Home</a></li>
                    <li><a href="./profile.html?id=${username2}" class="hover:underline">Profile</a></li>
                    <li><a href="./index.html" id="logoutBtn" class="hover:underline">Log Out</a></li>
                </ul>
    `;
}

const logoutBtn = document.getElementById("logoutBtn");

function logoutFunction() {
  localStorage.clear();
}

logoutBtn.addEventListener("click", logoutFunction);

async function getWhitToken2(url) {
  try {
    const token = localStorage.getItem("accessToken");
    const fetchData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, fetchData);
    const json = await response.json();
    filterList = json;
    if (headerToken2 != null) {
      document.getElementById(
        "hamburgerMenu"
      ).innerHTML = `<p class="hidden mr-4 w-full lg:block lg:w-auto" >Credits: <b>${json.credits}</b></p>`;
    }

    //listPosts(json);
  } catch (error) {
    console.log(error);
  }
}

getWhitToken2(fullURL);
