document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    let name = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    

    let isValid = true;

    document.querySelectorAll(".error-message").forEach(el => el.innerText = "");

    if (email.value.trim() === "" || !email.value.includes("@")) {
        email.nextElementSibling.innerText = "Enter a valid email.";
        isValid = false;
    }

    if (name.value.trim() === "") {
        name.nextElementSibling.innerText = "Name is required.";
        isValid = false;
    }

    if (password.value.length < 6) {
        password.nextElementSibling.innerText = "Password must be at least 6 characters.";
        isValid = false;
    }
    if (isValid) {
        alert("Form submitted successfully!");
        document.getElementById("contactForm").reset();
        document.getElementById("login-container").innerHTML = '<a href="success.html" target="_blank">enter</a>';

    }
});
