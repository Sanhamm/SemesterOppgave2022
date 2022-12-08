const queryString = document.location.search;

const params = new URLSearchParams(queryString);
const id = params.get("id");

const API_BASE_URL = "https://api.noroff.dev";
const deleteUrl = `/api/v1/auction/listings/${id}`;
const listBidUrl = `/api/v1/auction/listings/${id}?_seller=true&_bids=true`;
const listingBiddingUrl = `${API_BASE_URL}${listBidUrl}`;
const bidUrl = `${API_BASE_URL}/api/v1/auction/listings/${id}/bids`;
const bidBtn = document.getElementById("bidder");
const logInToBid = document.getElementById("bidDiv");
const bidToken = localStorage.getItem("accessToken");
const locUsername = localStorage.getItem("username");
console.log(locUsername);
bidBtn.addEventListener("click", bidFunction);

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
    filterList = json;
    ListPosts(json);
    console.log(json._count.bids);
    console.log(json.seller.name);
  } catch (error) {
    console.log(error);
  }
}

getWhitToken(listingBiddingUrl);

const outEdit = document.getElementById("auction-id");

const ListPosts = (post) => {
  outEdit.innerHTML = "";
  let newDiv = ` 
        <div class="lg:w-1/2 md:w-screen mt-5">
            <img src="${post.media}" alt="img for product " class=" w-3/4 h-3/4 mx-auto">
        </div>
        <div class="lg:w-1/2">
            <h1 class="text-center text-xl text-bold">${post.title}</h1>
            <p class="lg:pl-20 pl-10 pr-20 mt-20 ">${post.description}</p>
        </div>
        `;
  outEdit.innerHTML += newDiv;

  if (post.seller.name === locUsername && post.bids.length === 0) {
    logInToBid.innerHTML = `
            <button id="deleteBtn" class=" bg-wrong-col text-center h-6 w-20 cursor-pointer rounded-md hover:underline" data-delete="${post.name}">Delete</button>
            `;
  }
  const buttonDelete = document.querySelectorAll("button#deleteBtn");

  for (let btnDelete of buttonDelete) {
    btnDelete.addEventListener("click", () => {
      if (confirm("you want to delete this post?")) {
        deletePosts(btnDelete.getAttribute("data-delete"));
      }
    });
  }
};

//Bidding on a auction

async function bidWhitToken(url, userToBid) {
  try {
    const token = localStorage.getItem("accessToken");
    const fetchData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userToBid),
    };
    const response = await fetch(url, fetchData);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
}

function bidFunction(event) {
  event.preventDefault();
  const valueBid = document.getElementById("bid-input").value.trim();
  console.log(valueBid);
  const valueSendBid = parseInt(valueBid);

  const biddingOnAuction = {
    amount: valueSendBid,
  };
  bidWhitToken(bidUrl, biddingOnAuction);
  console.log(biddingOnAuction);
}

if (bidToken === null) {
  logInToBid.innerHTML = `
    <div class="mt-10">
        <p class="text-wrong-col">You need to be logged in to bid</p>
        <a class="bg-header-col text-center h-6 w-20 cursor-pointer rounded-md hover:underline px-2 py-1" href="./login.html">Login?</a>
    </div>
    `;
}

console.log(id);

async function deletePosts(id) {
  const url = `${API_BASE_URL}${deleteUrl}`;
  console.log(url);
  try {
    const token = localStorage.getItem("accessToken");
    const deleteData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, deleteData);
    const json = await response.json();
    console.log(json);
    if (response.status === 200) window.location = "../index.html";
  } catch (error) {
    console.log(error);
  }
}
