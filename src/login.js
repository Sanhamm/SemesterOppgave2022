const API_BASE_URL = "https://api.noroff.dev/api/v1";
const loginURL = "/auction/auth/login";

const usernameInput = document.getElementById("e-mail-login");
const passwordInput = document.getElementById("password-login");
const wrongMsg = document.getElementById("bannerWrong");
const loginBtn = document.getElementById("knappen");

async function loginUser(url, userData) {
  try {
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    if (response.status == 200) {
      const accessToken = json.accessToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("credits", json.credits);
      localStorage.setItem("username", json.name);
      localStorage.setItem("urlImg", json.avatar);
      window.history.back();
    } else {
      wrongMsg.innerHTML = "Email and password dont checkout";
    }
  } catch (error) {
    console.log(error);
  }
}

const loginUrl = `${API_BASE_URL}${loginURL}`;

function validateLogin(val) {
  val.preventDefault();
  wrongMsg.innerHTML = "";

  const usernameLogin = usernameInput.value.trim();
  const passwordLogin = passwordInput.value.trim();

  let userVali = false;
  let passwordVali = false;

  const userToLogin = {
    email: usernameLogin,
    password: passwordLogin,
  };

  if (
    usernameLogin.includes("@stud.noroff.no") ||
    usernameLogin.includes("@noroff.no")
  ) {
    userVali = true;
  } else {
    wrongMsg.innerHTML = "Invalid email or password";
  }

  if (passwordLogin.length < 8) {
    wrongMsg.innerHTML = "Invalid email or password";
  } else {
    passwordVali = true;
  }

  if (userVali === true && passwordVali === true) {
    loginUser(loginUrl, userToLogin);
  }
}

loginBtn.addEventListener("click", validateLogin);
