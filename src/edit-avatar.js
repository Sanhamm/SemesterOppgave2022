const API_BASE_URL = "https://api.noroff.dev";
const queryString = document.location.search;

const params = new URLSearchParams(queryString);
const id = params.get("id");
const editAvatarUrl = `/api/v1/auction/profiles/${id}/media`;
const getAvatarUrl = `/api/v1/auction/profiles/${id}`;
const fullUrl = `${API_BASE_URL}${getAvatarUrl}`;
const editFullUrl = `${API_BASE_URL}${editAvatarUrl}`;

console.log(editAvatarUrl);

const outEdit = document.getElementById("avatar-edit");

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
    ListPosts(json);
  } catch (error) {
    console.log(error);
  }
}

const ListPosts = (post) => {
  outEdit.innerHTML = "";
  console.log(post.avatar);
  let newDiv = ` 
        <img src="${post.avatar}" alt="Logo for website" class=" rounded-full h-48 w-48 mx-auto object-cover">
        <input type="url" value="${post.avatar}" id="avatar-edit" class="border rounded-lg py-1 px-7 border-slate-800 mr-2 mt-10">
        `;
  outEdit.innerHTML += newDiv;
};
getWhitToken(fullUrl);

async function editInput(url) {
  const aviEdit = document.getElementById("avatar-edit").value;
  const userToEdit = {
    avatar: aviEdit,
  };
  try {
    const token = localStorage.getItem("accessToken");
    const editData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userToEdit),
    };
    const response = await fetch(url, editData);
    const json = await response.json();
    console.log(json);
    //window.location = "profile.html"
  } catch (error) {
    console.log(error);
  }
}

const btnEdit = document.getElementById("avatarBtn");

btnEdit.addEventListener("click", postFunction);

function postFunction(event) {
  event.preventDefault();
  editInput(editFullUrl);
}
