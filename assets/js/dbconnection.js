document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const response = await fetch("login.php", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            alert(result.message);
            if (result.status === "success") {
                window.location.href = "index.php";
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const response = await fetch("register.php", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            alert(result.message);
            if (result.status === "success") {
                window.location.href = "login.php";
            }
        });
    }
});
