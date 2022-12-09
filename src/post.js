const API_BASE_URL = "https://api.noroff.dev";
const listingPost = "/api/v1/auction/listings";
const postsUrl = `${API_BASE_URL}${listingPost}`;

const btnPost = document.getElementById("post-btn");

async function submittPost(url, userToPost) {
  try {
    const token = localStorage.getItem("accessToken");
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userToPost),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    if (response.status === 201) window.location = "../index.html";
  } catch (error) {
    console.log(error);
  }
}

function postFunction(event) {
  event.preventDefault();
  const titlePost = document.getElementById("title-post").value.trim();
  const bodyPost = document.getElementById("info-post").value.trim();
  const imgPost = document.getElementById("img-post").value.trim();
  const datePost = document.getElementById("date-post").value;
  const dateEnd = `${datePost}:00.000Z`;
  console.log(datePost);
  console.log(imgPost);

  const userToPost = {
    title: titlePost,
    description: bodyPost,
    media: [`${imgPost}`],
    endsAt: dateEnd,
  };
  submittPost(postsUrl, userToPost);
}

btnPost.addEventListener("click", postFunction);
