const queryString = document.location.search;
const id = new URLSearchParams(queryString);
const userName = id.get("id");

const API_BASE_URL = "https://api.noroff.dev";
const myProfile = localStorage.getItem("username");
const myProfileUrl = `/api/v1/auction/profiles/${myProfile}`;
const otherProfileUrl = `/api/v1/auction/profiles/${userName}`;
const myProfileSiteUrl = `${API_BASE_URL}${myProfileUrl}`;
const otherProfileSiteUrl = `${API_BASE_URL}${otherProfileUrl}`;
const profileAuctions = `${API_BASE_URL}/api/v1/auction/profiles/${userName}/listings?_seller=true&_bids=true&sort=created&sortOrder=desc`;
console.log(myProfileSiteUrl);

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
    console.log(json);
    /* For removing the auctions that have expired */

    for (let i = 0; i < json.length; i++) {
      if (new Date().toJSON() > json[i].endsAt) {
        json.splice(i, 1);
        i--;
      }
    }
    getProfile(json);
  } catch (error) {
    console.log(error);
  }
}

const user = document.getElementById("profile-top");

const getProfile = (info) => {
  user.innerHTML = "";

  let profileDiv = `
    <div id="profile-img" class="w-1/2 mx-auto">
        <img src="${info.avatar}" alt="Avatar for user" class="mx-auto text-center">
    </div>
    <div id="profile-name" class="w-1/2 mx-auto">
        <h1 class="text-lg">${info.name}</h1>
    </div>
    `;
  user.innerHTML = profileDiv;
};

getWhitToken(otherProfileSiteUrl);

async function auctionProfile(url) {
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
    console.log(json);
    /* For removing the auctions that have expired */

    for (let i = 0; i < json.length; i++) {
      if (new Date().toJSON() > json[i].endsAt) {
        json.splice(i, 1);
        i--;
      }
    }
    getAuction(json);
  } catch (error) {
    console.log(error);
  }
}

auctionProfile(profileAuctions);

const auctionPro = document.getElementById("your-auctions");

const getAuction = (posts) => {
  auctionPro.innerHTML = "";
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
    let newDiv = `    
          <div class=" grid grid-cols-2 shadow-inner rounded-lg m-2 bg-card-col">
              <div class="object-fill">       
                  <img class = "shadow-inner rounded lg object-cover w-100 h-72 " src="${inn.media}">
              </div>
              <div class="p-2 grid gid-cols-2 ml-4">
                  <h2 class="text-base font-bold"><a href="./auction.html?id=${inn.id}">${inn.title}</a></h2>
                  <p class="text-sm">${inn.description}</p>
                  <button class="mt-16 bg-header-col w-24 h-8 rounded-lg shadow-xl">Bid</button>
                  <p>Bids: ${inn.bids.length}</p>
                  <p>${timeLeft}</p>
              </div>
          </div>
          `;
    auctionPro.innerHTML += newDiv;
  }
};
