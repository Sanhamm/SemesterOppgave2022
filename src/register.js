const API_BASE_URL = "https://api.noroff.dev/api/v1";
const registerUrl = "/auction/auth/register";

const usernameRegister = document.getElementById("e-mail-register");
const nameRegister = document.getElementById("username-register");
const passwordRegister = document.getElementById("password-register");
const loginBtnRegister = document.getElementById("registerBtn");

const registerURL = `${API_BASE_URL}${registerUrl}`;

async function registerNewUser(url, data) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    const answer = await response.json();
    console.log(answer);
    if (response.ok == true) {
      window.location = "./login.html";
    }
    if (answer.statusCode == 400) {
      usernameMsg.innerHTML = "Something went wrong, try again";
    }
  } catch (error) {
    console.warn(error);
  }
}

const usernameMsg = document.getElementById("usernameMsg");
const mailMsg = document.getElementById("mailMsg");
const passwordMsg = document.getElementById("passwordMsg");

function validateForm(val) {
  val.preventDefault();

  const usernameR = usernameRegister.value.trim();
  const passwordR = passwordRegister.value.trim();
  const nameR = nameRegister.value.trim();

  let userVal = false;
  let mailVal = false;
  let passwordVal = false;

  const registerUser = {
    name: nameR,
    email: usernameR,
    password: passwordR,
  };

  if (nameR.length > 2) {
    usernameMsg.innerHTML = "";
    userVal = true;
  } else {
    usernameMsg.innerHTML = "Your name must be atleast 2 characters long";
  }

  if (
    usernameR.includes("@stud.noroff.no") ||
    usernameR.includes("@noroff.no")
  ) {
    mailMsg.innerHTML = "";
    mailVal = true;
  } else {
    mailMsg.innerHTML = "Email is not valid";
  }

  if (passwordR.length < 8) {
    passwordMsg.innerHTML = "You need atleast 8 characters";
  } else {
    passwordMsg.innerHTML = "";
    passwordVal = true;
  }

  if (userVal === true && mailVal === true && passwordVal === true) {
    registerNewUser(registerURL, registerUser);
  }
}

loginBtnRegister.addEventListener("click", validateForm);
