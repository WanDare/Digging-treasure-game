export function loadLoginScreen(onLoginSuccess: () => void) {
  fetch("/login/login.html")
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = "/login/login.css";
      document.head.appendChild(style);

      const phoneInput = document.getElementById(
        "phone-input"
      ) as HTMLInputElement;
      const loginBtn = document.getElementById(
        "login-btn"
      ) as HTMLButtonElement;
      const loginScreen = document.getElementById("login-screen");

      phoneInput?.addEventListener("input", () => {
        const hasValue = phoneInput.value.trim().length > 0;
        loginBtn.disabled = !hasValue;
        loginBtn.classList.toggle("enabled", hasValue);
        loginBtn.classList.toggle("disabled", !hasValue);
      });

      loginBtn?.addEventListener("click", () => {
        if (!loginBtn.disabled && loginScreen) {
          loginScreen.remove();
          onLoginSuccess();
        }
      });
    });
}
