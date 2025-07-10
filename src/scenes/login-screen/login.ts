import { API_BASE_URL } from "../utils/constants";

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

      const errorMsg = document.createElement("div");
      errorMsg.style.display = "none";
      errorMsg.style.marginTop = "-20px";
      errorMsg.style.marginBottom = "20px";
      errorMsg.style.alignItems = "center";
      errorMsg.style.color = "#FFC107";
      errorMsg.style.fontSize = "14px";
      errorMsg.style.fontWeight = "500";
      errorMsg.style.textAlign = "left";
      errorMsg.style.width = "63%";
      errorMsg.innerHTML = `
        <span style="font-size: 18px; margin-right: 8px;">⚠️</span>
        Phone number not registered. Please try again.
      `;

      phoneInput.parentElement?.insertBefore(errorMsg, loginBtn);

      phoneInput?.focus();

      phoneInput?.addEventListener("input", () => {
        const hasValue = phoneInput.value.trim().length > 0;
        loginBtn.disabled = !hasValue;
        loginBtn.classList.toggle("enabled", hasValue);
        loginBtn.classList.toggle("disabled", !hasValue);

        errorMsg.style.display = "none";
      });

      loginBtn?.addEventListener("click", async () => {
        if (loginBtn.disabled || !phoneInput.value) return;

        const rawPhone = phoneInput.value.trim();
        const phone = rawPhone.startsWith("0")
          ? "855" + rawPhone.slice(1)
          : rawPhone;

        loginBtn.textContent = "Checking...";
        loginBtn.disabled = true;

        try {
          const res = await fetch(`${API_BASE_URL}/user-info?phone=${phone}`);
          const data = await res.json();

          if (res.ok && data.success && data.data) {
            console.log("✅ Valid phone:", data);

            localStorage.setItem("user", JSON.stringify(data.data));

            loginScreen?.remove();
            onLoginSuccess();
          } else {
            errorMsg.style.display = "flex";
          }
        } catch (err) {
          console.error("Network error:", err);
          errorMsg.innerHTML = `
            <span style="font-size: 18px; margin-right: 8px;">⚠️</span>
            Network error. Please try again.
          `;
          errorMsg.style.display = "flex";
        } finally {
          loginBtn.textContent = "Login";
          loginBtn.disabled = false;
        }
      });
    });
}
