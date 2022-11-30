const API_BASE_URL = "https://api.noroff.dev";
const AllListings =
  "/api/v1/auction/listings?_seller=true&_bids=true&sort=endsAt&sortOrder=desc";
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
    for (let i = 0; i < json.length; i++) {
      console.log(json[i]);

      if (new Date().toJSON() > json[i].endsAt) {
        console.log(json[i] + "fdijfdjifdji");
        json.splice(i, 1);
        i--;
      }
    }
    console.log(json);
    listPosts(json);
  } catch (error) {
    console.log(error);
  }
}

let headerToken = localStorage.getItem("accessToken");
let UrlImg = localStorage.getItem("accessUrlImg");
let userName = localStorage.getItem("username");

if (headerToken != null) {
  document.getElementById("frontsite-profile").innerHTML = `
            <div id="frontsite-img" class="w-1/2 ">
                <img src="${UrlImg}" alt="Avatar for user" class="mx-auto">
            </div>
            <div id="frontsite-username" class="w-1/2 grid-cols-1 content-between">
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
    //console.log(inn);
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
    let newDiv = `    
        <div class=" grid grid-cols-2 shadow-inner rounded-lg m-2 ">
            <div class="object-fill">       
                <img class = "shadow-inner rounded lg object-cover w-100 h-72 " src="${inn.media}">
            </div>
            <div class="p-2 grid gid-cols-2 ml-4">
                <h2 class="text-base font-bold"><a href="./auction.html?id=${inn.id}">${inn.title}</a></h2>
                <p class="text-sm">${inn.description}</p>
                <a href="./profile.html?id=${inn.seller.name}" class="font-italic text-xs"><em>${inn.seller.name}</em></a><br>
                <button class="mt-16 bg-header-col w-24 h-8 rounded-lg shadow-xl">Bid</button>
                <p>Bids: ${inn.bids.length}</p>
                <p>${timeLeft}</p>
            </div>
        </div>
        `;
    outPost.innerHTML += newDiv;
  }
};