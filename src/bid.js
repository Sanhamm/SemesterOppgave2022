const queryString = document.location.search;

const params = new URLSearchParams(queryString);
const id = params.get("id");

//the url that i use
const API_BASE_URL = "https://api.noroff.dev";
const deleteUrl = `/api/v1/auction/listings/`;
const listBidUrl = `/api/v1/auction/listings/${id}?_seller=true&_bids=true`;
const listingBiddingUrl = `${API_BASE_URL}${listBidUrl}`;
const bidUrl = `${API_BASE_URL}/api/v1/auction/listings/${id}/bids`;

//getting som divs/btns
const bidBtn = document.getElementById("bidder");
const logInToBid = document.getElementById("urAuction");

//getting from locale storage
const bidToken = localStorage.getItem("accessToken");
const locUsername = localStorage.getItem("username");

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
    filterList = json;
    ListPosts(json);
  } catch (error) {
    console.log(error);
  }
}

getWhitToken(listingBiddingUrl);

const outEdit = document.getElementById("auction-id");
const outBids = document.getElementById("bids");

const ListPosts = (post) => {
  //outEdit.innerHTML = "";

  const date = new Date(post.endsAt).getTime();
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
      <div class="shadow-inner rounded-lg lg:m-10 m-10 bg-card-col lg:flex grid max-w-screen-xl mx-auto mt-10 mb-5"> 
        <div class="lg:w-1/2 md:w-screen rounded-lg">
            <img src="${post.media}" alt="img for product " class="rounded-lg mx-auto ">
        </div>
        <div class="lg:w-1/2">
            <h1 class="text-center text-xl text-bold mt-10">${post.title}</h1>
            <p class="lg:pl-20 pl-10 pr-20 mt-20 ">${post.description}</p>
            <p class="lg:pl-20 pl-10 pr-20 mt-20">${timeLeft}</p>
        </div>
        `;
  outEdit.innerHTML += newDiv;

  if (post.seller.name === locUsername && post.bids.length === 0) {
    logInToBid.innerHTML = `
            <button id="deleteBtn" class=" bg-wrong-col text-center h-6 w-20 cursor-pointer rounded-md hover:underline" data-delete="${post.name}">Delete</button>
            `;
  }
  if (post.bids.length != 0 && post.seller.name === locUsername) {
    logInToBid.innerHTML = "You cant bid on your own auction";
  }

  //always have the last bidder on top

  let lastElement = post.bids.slice(-1);

  for (let count of lastElement) {
    let newBids = `
      <div class=" lg:grid p-5 bg-auction-col rounded-lg mr-10">   
        <div>
          <h2 class="text-lg">Highest bid:</h2>
        </div>
        <div class="flex mt-3">
            <p class="mr-10">${count.bidderName}:</p>
            <p class="text-bold">${count.amount}</p>
        </div>
      </div>
    `;
    outBids.innerHTML += newBids;
    if (count.bidderName === locUsername) {
      logInToBid.innerHTML = "You have the highest bid";
    }
  }

  const buttonDelete = document.querySelectorAll("button#deleteBtn");

  for (let btnDelete of buttonDelete) {
    btnDelete.addEventListener("click", () => {
      if (confirm("you want to delete this post?")) {
        deletePosts(post.id);
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

    if (response.status === 200) {
      window.location.reload();
    }
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

async function deletePosts(id2) {
  const url = `${API_BASE_URL}${deleteUrl}${id2}`;
  console.log(id2);
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
    if (response.status === 204) window.location = "../index.html";
  } catch (error) {
    console.log(error);
  }
}
