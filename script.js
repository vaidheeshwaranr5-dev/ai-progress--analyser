const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passError = document.getElementById("passwordError");
const formError = document.getElementById("formError");

// name@domain.tld  (TLD of 2+ letters, no spaces, no consecutive dots)
const EMAIL_RE = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

function setError(input, el, msg) {
  el.textContent = msg;
  input.classList.toggle("invalid", Boolean(msg));
}

function clearErrors() {
  setError(emailInput, emailError, "");
  setError(passInput, passError, "");
  formError.hidden = true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const email = emailInput.value.trim();
  const password = passInput.value;
  let ok = true;

  if (!email) {
    setError(emailInput, emailError, "Enter your email address.");
    ok = false;
  } else if (!EMAIL_RE.test(email)) {
    setError(emailInput, emailError, "Enter a valid email, like name@example.com.");
    formError.textContent = "Invalid email ID. Check it and try again.";
    formError.hidden = false;
    ok = false;
  }

  if (!password) {
    setError(passInput, passError, "Enter your password.");
    ok = false;
  }

  if (!ok) return;

  try {
    sessionStorage.setItem("userEmail", email);
    if (document.getElementById("remember").checked) localStorage.setItem("userEmail", email);
  } catch (_) { /* storage unavailable: continue anyway */ }

  window.location.href = "dashboard.html";
});

[emailInput, passInput].forEach((i) => i.addEventListener("input", clearErrors));