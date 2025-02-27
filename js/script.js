document.addEventListener("DOMContentLoaded", function () {
    // Registration Form Submission
    document.getElementById("create-account-form")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let firstName = document.getElementById("first-name").value.trim();
        let secondName = document.getElementById("second-name").value.trim();
        let email = document.getElementById("email").value.trim();
        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("password").value.trim();
        let repeatPassword = document.getElementById("repeat-password").value.trim();
        let collegeType = document.getElementById("college-type").value;

        // Ensure all fields are filled
        if (!firstName || !secondName || !email || !username || !password || !repeatPassword || collegeType === "*Select your option*") {
            alert("Please fill in all fields before proceeding.");
            return;
        }

        // Validate password
        if (password.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            alert("Password must be at least 6 characters long and contain at least one special character: ! @ # $ % ^ & * ( ) , . ? \" : { } | < > -");
            return;
        }

        // Ensure passwords match
        if (password !== repeatPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Store user credentials in localStorage
        let userData = {
            firstName: firstName,
            lastName: secondName,
            username: username,
            email: email,
            password: password,
            college: collegeType
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        // Redirect to login page without alert
        window.location.href = "index.html";
    });

    // Login Form Submission
    document.getElementById("login-form")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let input = document.getElementById("username").value.trim(); // Can be email or username
        let password = document.getElementById("password").value.trim();

        // Retrieve stored user data
        let storedUser = JSON.parse(localStorage.getItem("userData"));

        if (!storedUser) {
            alert("No account found. Please register first.");
            return;
        }

        // Check if input matches stored username or email, and if password matches
        if ((input === storedUser.username || input === storedUser.email) && password === storedUser.password) {
            // Set the current user in localStorage
            localStorage.setItem("currentUser", storedUser.username);
            
            // Directly redirect to home page without alert
            window.location.href = "home.html";
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });

    // Back to Login button
    document.getElementById("back-to-login")?.addEventListener("click", function () {
        window.location.href = "index.html"; 
    });
});
