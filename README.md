# Propel-Hackathon
# **DeConnect**

# **Live Website:** [DeConnect - Propel Hackathon]
(https://propelhackathon2025.vercel.app/)  

## **Overview**
DeConnect is a web-based platform designed to help students at DePaul University expand their social and professional circles. The platform allows users to network, collaborate, and engage in fun activities. The goal is to foster meaningful connections based on shared interests and career goals.

## **Features**

### **User Authentication**
- Users can sign up and log in using their credentials.
- Credentials are stored in **localStorage** for session management.
- Successful login redirects users to the homepage.

### **Homepage Dashboard**
- Serves as the central hub for navigation.
- Provides quick access to **Networking, Fun, and Collaboration** sections.

### **Networking Events**
- Users can **explore, create, and manage** professional networking events.
- Events are stored in **localStorage** for persistence.
- Users can only edit or delete the events they have created.

### **Fun Activities**
- Users can **post and join fun group activities**.
- Supports **hashtags, image uploads, and external links**.
- Dynamic post display with real-time updates.

### **Collaboration Opportunities**
- Users can create posts related to **study groups, workshops, career guidance, and projects**.
- Features an **upvote system, comment section, and file uploads**.
- Posts are categorized for easy navigation.

---

## **Folder & File Structure**

DeConnect/
│── index.html           # Login Page
|── create-account.html  # Account creation page
│── home.html            # Home dashboard after login
│── NetworkingPage.html      # Professional networking events page
│── PostPage.html        # Create & manage networking event posts
│── fun.html             # Fun activities page
│── collab.html          # Collaboration hub
│
├── css/
│   ├── styles.css       # Styling for login page 
│   ├── networking.css   # Styling for networking pages
│   ├── postpage.css     # Styling for event posting
│   ├── fun.css         # Styling for fun activities page
│   ├── collab.css       # Styling for collaboration page
|   ├──banner.css        #Styling for banner and footer
|   ├──home.css          #Styling for home page 
│
├── js/
│   ├── script.js        # General site functionality
│   ├── home.js          #Logic for home page
│   ├── networking.js    # Logic for networking events
│   ├── PostPage.js      # Event posting logic
│   ├── fun.js          # Fun activities logic
│   ├── collab.js        # Collaboration features Logic 
│
├── fun_icon/
│   ├── chat.png              # comment icon image
│   ├── check-mark.png        # post icon image
│   ├── delete.png            # Delete icon image
│   ├── edit.png              # edit icon image
│   ├── heart.png             # heart icon image
│   ├── home-button.png       # home icon image
│   ├── image.png             # upload photo icon image
│   ├── link.png              # upload file icon image
|
├── icons/
│   ├── delete_icon.png      # Delete icon image
│   ├── editing_icon.png     # Edit icon image
│   ├── home.png             # home icon image
│   ├── what.png             # What icon image
│   ├── when-icon.png        # when icon image
│   ├── where-icon.png       # where icon image
│
└── README.md            # Project documentation


## **How It Works**

### **Login Process**
1. User enters credentials.
2. Validates against stored user data in `localStorage`.
3. If credentials match, redirects to `home.html`; else, an error is shown.

### **Account Creation**
1. User fills out the form with required details.
2. Basic validation checks are performed.
3. Data is stored in `localStorage`.
4. On successful registration, the user is redirected to `index.html` for login.

### **Creating a Networking Event**
1. Navigate to the **Post Event Page**.
2. Fill in event details (title, date, time, location, description).
3. Click "Submit" to save the event.
4. The event appears on the **Networking Events Page**.

### **Posting Fun Activities**
1. Fill out the text area with a description.
2. Add hashtags, upload images, or include links.
3. Click "Post" to display the activity on the page.

### **Collaboration Posts**
1. Click "Create Post".
2. Enter a title and content.
3. Choose a category (e.g., Study Groups, Career Guidance).
4. (Optional) Attach a file.
5. Click "Post" to submit.

### **Editing & Deleting Posts**
- Users can only edit or delete **their own** posts.
- Selecting "Edit" allows modification of details.
- Selecting "Delete" removes the post from `localStorage` and the page.

---

## **Technologies Used**
- **HTML5**: Structure and semantic elements.
- **CSS3**: Modern styling, responsive design.
- **JavaScript (ES6+)**: Handles dynamic content and user interactions.
- **Local Storage**: Browser-based data persistence.

---

## **Future Enhancements**
- **User Authentication System**: Implement real authentication with backend support.
- **Database Storage**: Replace `localStorage` with a real-time database.
- **Interactive Social Features**: Like, comment, and share posts.
- **Search & Filtering**: Enable users to search posts by hashtags or keywords.
- **Improved File Sharing**: Allow multiple file uploads with preview options.

---

## **Setup Instructions**
1. Download all files and place them in the same directory.
2. Open `index.html` in a browser.
3. Sign up or log in to access the homepage.
4. Navigate to different sections via the menu.

---

DeConnect is a fully functional mockup designed to improve student engagement at DePaul University. Since it does not include a backend, all data is stored locally and will be lost if `localStorage` is cleared. Future versions may incorporate authentication and real-time data storage for a seamless experience.
