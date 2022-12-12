const API_BASE_URL = "https://api.noroff.dev";
const AllListings =
  "/api/v1/auction/listings?_seller=true&_bids=true&_active=true&sort=endsAt&sortOrder=asc";
const deleteUrl = `/api/v1/auction/listings/`;

const outPost = document.getElementById("outputPosts");

async function getWhitToken(url) {
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
    /* For removing the auctions that have expired */

    for (let i = 0; i < json.length; i++) {
      if (new Date().toJSON() > json[i].endsAt) {
        json.splice(i, 1);
        i--;
      }
    }
    listPosts(json);
  } catch (error) {
    console.log(error);
  }
}

let headerToken = localStorage.getItem("accessToken");
let UrlImg = localStorage.getItem("urlImg");
let userName = localStorage.getItem("username");

/* Changing Top of site to show avatar for user and name */

if (headerToken != null) {
  document.getElementById("frontsite-profile").innerHTML = `
            <div id="frontsite-img" class=" lg:w-1/2 ">
                <img src="${UrlImg}" alt="Avatar for user" class="rounded-full h-48 w-48 mx-auto object-cover">
            </div>
            <div id="frontsite-username" class="text-center mt-2 grid-cols-1 content-between">
                <h1>Hello,<br> <b class="text-xl">${userName}<b></h1>
            </div>
        `;
  document.getElementById("postBtn").innerHTML = `
            <button id="login-btn" class="mt-16 bg-header-col py-1 px-4 rounded-lg"><a href="./post.html">Post Auction</a></button>

        `;
}
const postsUrl = `${API_BASE_URL}${AllListings}`;
getWhitToken(postsUrl);

const listPosts = (posts) => {
  outPost.innerHTML = "";
  for (let inn of posts) {
    /* To show the exact time thats left of the auctions */
    const date = new Date(inn.endsAt).getTime();
    const now = new Date().getTime();
    const distance = date - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    let timeLeft = "";

    if (distance > 0) {
      timeLeft = `${days}d ${hours}h ${min}m`;
    } else {
      timeLeft = "EXPIRED";
    }

    //Delete button works only if its yours and if someone have not yet bid
    const deleteBtn = `<button id="deleteBtn" class=" bg-wrong-col text-center h-6 w-20 cursor-pointer rounded-md hover:underline"><a href="auction.html?id=${inn.id}">Delete</a></button>`;

    let newDiv = `    
        <div class=" grid grid-cols-2 shadow-inner rounded-lg m-2 bg-card-col">
            <div class="object-fill">       
                <img class = "shadow-inner rounded lg object-cover w-100 h-72 " src="${
                  inn.media
                }">
            </div>
            <div class="p-2 grid gid-cols-2 ml-4">
                <h2 class="text-base font-bold"><a href="./auction.html?id=${
                  inn.id
                }">${inn.title}</a></h2>
                <p class="text-sm">${inn.description}</p>
                <a href="./profile.html?id=${
                  inn.seller.name
                }" class="font-italic text-xs"><em>${
      inn.seller.name
    }</em></a><br>
                <a class=" bg-header-col text-center h-6 w-20 cursor-pointer rounded-md hover:underline" href="auction.html?id=${
                  inn.id
                }">Bid</a>
                ${
                  localStorage.getItem("username") === inn.seller.name &&
                  inn.bids.length === 0
                    ? deleteBtn
                    : ""
                }
                <p>Bids: ${inn.bids.length}</p>
                <p>${timeLeft}</p>
            </div>
        </div>
        `;
    outPost.innerHTML += newDiv;
  }
  const buttonDelete = document.querySelectorAll("button#deleteBtn");
};

const search = document.getElementById("searchFilter");
search.addEventListener("keyup", filterFunction);

function filterFunction() {
  const filterQuery = search.value.toLowerCase();

  const filtering = filterList.filter((json) => {
    const user = json.seller.name;
    const title = json.title;
    let body = json.description;
    if (body === null) {
      body = "";
    }

    if (user.indexOf(filterQuery) > -1) return true;
    if (title.indexOf(filterQuery) > -1) return true;
    if (body.indexOf(filterQuery) > -1) return true;
    return false;
  });
  listPosts(filtering);
}
