<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification Game</title>
<script src="https://apis.google.com/js/platform.js" async defer></script>
<style>
body {
    font-family: 'Comic Sans MS', cursive, sans-serif;
    background: linear-gradient(45deg, #ff6f61, #ff9c42);
    color: white;
    text-align: center;
    padding: 20px;
}
h1, h2, .output, .footer {
    margin-bottom: 20px;
}
.button {
    background-color: #ff6347;
    color: white;
    padding: 12px 30px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    margin: 10px;
    border-radius: 8px;
    transition: background-color 0.3s;
}
.button:hover {
    background-color: #ff4500;
}
.hidden { display: none; }
</style>
</head>
<body>

<h1>Email Verification Game</h1>
<div id="greeting" class="hidden"></div>

<!-- Sections -->
<div id="chooseAccessSection">
    <h2>Select Access Method</h2>
    <button class="button" onclick="toggleSection('adminPasswordSection')">Admin Password</button>
    <button class="button" onclick="toggleSection('emailSection')">Email Verification</button>
    <button class="button" onclick="toggleSection('signUpSection')">Sign Up</button>
    <div id="googleSignInButton"></div> <!-- Google Sign-In button -->
</div>

<div id="adminPasswordSection" class="hidden">
    <h2>Enter Admin Password</h2>
    <input type="password" id="adminPassword" placeholder="Enter Admin Password">
    <button class="button" onclick="checkAdminPassword()">Submit</button>
    <p id="adminMessage" style="color: red;"></p>
</div>

<div id="emailSection" class="hidden">
    <p>Please enter your email:</p>
    <input type="email" id="userEmail" placeholder="Enter your email">
    <button class="button" onclick="sendConfirmationEmail()">Send Link</button>
</div>

<div id="signUpSection" class="hidden">
    <h2>Sign Up</h2>
    <input type="email" id="signUpEmail" placeholder="Email">
    <input type="password" id="signUpPassword" placeholder="Password">
    <input type="text" id="userName" placeholder="Name">
    <button class="button" onclick="signUpUser()">Sign Up</button>
</div>

<div id="confirmationSection" class="hidden">
    <p>Confirmation link sent to <span id="emailDisplay"></span>.</p>
    <button class="button" onclick="verifyEmail()">Confirm Email</button>
</div>

<div id="gameSection" class="hidden">
    <div class="output" id="appleCount">Apples: 20</div>
    <h2>Choose a category:</h2>
    <div>
        <button class="button" onclick="showRandom('affirmations')">💪 Affirmation</button>
        <button class="button" onclick="showRandom('tips')">💡 Tip</button>
        <button class="button" onclick="showRandom('confidence')">🚀 Confidence</button>
        <button class="button" onclick="showRandom('activities')">🎨 Activity</button>
    </div>
    <div class="output" id="output"></div>
</div>

<div class="footer">
    <p>Need support? Visit:</p>
    <a href="https://www.mentalhealth.gov" target="_blank">Mental Health</a> |
    <a href="https://www.headspace.com" target="_blank">Meditation</a> |
    <a href="https://www.psychologytoday.com" target="_blank">Find a Therapist</a>
</div>

<script>
let userEmail = "", userName = "Guest";
const adminPassword = "1995";

// Initialize categories and store their available items
const items = {
    affirmations: [
        "You are amazing!", 
        "You are capable!", 
        "Your potential is limitless!",
        "You are strong!",
        "You matter!"
    ],
    tips: [
        "Take breaks to clear your mind.", 
        "Stay hydrated.", 
        "Prioritize tasks.", 
        "Don't forget to stretch!", 
        "Set small, achievable goals."
    ],
    confidence: [
        "You got this!", 
        "Believe in yourself!", 
        "Confidence comes from within.", 
        "You are unstoppable!",
        "Embrace your uniqueness!"
    ],
    activities: [
        "Draw something happy!", 
        "Go for a walk.", 
        "Dance to your favorite song!", 
        "Write down your thoughts.",
        "Take a deep breath and relax."
    ]
};

// Track used items to avoid repetition
const usedItems = {
    affirmations: [],
    tips: [],
    confidence: [],
    activities: []
};

function toggleSection(sectionId) {
    document.querySelectorAll('div[id$="Section"]').forEach(div => div.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function checkAdminPassword() {
    const enteredPassword = document.getElementById('adminPassword').value;
    if (enteredPassword === adminPassword) {
        alert("Access granted");
        toggleSection('gameSection');
    } else {
        document.getElementById('adminMessage').innerText = "Incorrect password.";
    }
}

function sendConfirmationEmail() {
    userEmail = document.getElementById('userEmail').value;
    if (userEmail) {
        alert("Confirmation sent!");
        document.getElementById('emailDisplay').innerText = userEmail;
        toggleSection('confirmationSection');
    } else {
        alert("Enter a valid email.");
    }
}

function verifyEmail() {
    alert("Email confirmed! Welcome!");
    toggleSection('gameSection');
}

function signUpUser() {
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    userName = document.getElementById('userName').value;
    if (email && password && userName) {
        alert("Sign-up successful!");
        document.getElementById('greeting').innerText = `Hello, ${userName}!`;
        document.getElementById('greeting').classList.remove('hidden');
        toggleSection('gameSection');
    } else {
        alert("Complete all fields.");
    }
}

function showRandom(type) {
    const availableItems = items[type].filter(item => !usedItems[type].includes(item));
    
    if (availableItems.length === 0) {
        // Reset the used items if all have been shown
        usedItems[type] = [];
    }

    const randomPrompt = availableItems[Math.floor(Math.random() * availableItems.length)];
    
    // Mark the prompt as used
    usedItems[type].push(randomPrompt);

    // Display the prompt
    document.getElementById('output').innerHTML = `<p>${randomPrompt}</p>`;
}

// Google Sign-In Configuration
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    userName = profile.getName(); // Store the user's name
    document.getElementById('greeting').innerText = `Hello, ${userName}!`;
    document.getElementById('greeting').classList.remove('hidden');
    toggleSection('gameSection'); // Redirect to the game section after sign-in
}

// Render Google Sign-In button
function renderGoogleButton() {
    gapi.signin2.render('googleSignInButton', {
        'scope': 'profile',
        'width': 250,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignIn
    });
}

// Call this function when the Google API is loaded
function initGoogleSignIn() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '273265614939-ol8nn28997v7bglp9pjsnpaq5l9s4fr8.apps.googleusercontent.com' // Replace with your Google client ID
        }).then(renderGoogleButton);
    });
}

window.onload = initGoogleSignIn;
</script>
</body>
</html>
