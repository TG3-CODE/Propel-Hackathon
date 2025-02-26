// Initialize posts as an object and load from localStorage
let posts = JSON.parse(localStorage.getItem('posts')) || {};
let userCollege = localStorage.getItem('userCollege') || 'cdm';
let currentUser = localStorage.getItem('currentUser') || 'anonymous'; // Default user

// Prompt the user for their name if not already set
if (!localStorage.getItem('currentUser')) {
  const userName = prompt("Please enter your name:");
  if (userName) {
    localStorage.setItem('currentUser', userName);
    currentUser = userName;
  }
}

// Save selected college
document.getElementById('college-select').addEventListener('change', function() {
  userCollege = this.value;
  localStorage.setItem('userCollege', userCollege);
  refreshPosts(); // Refresh posts when college is changed
});

// Function to refresh posts based on the selected college
function refreshPosts() {
  const categories = [
    'exam-study-groups', 'projects', 'programming', 'career-guidance', 'workshops'
  ];
  categories.forEach((category) => {
    displayPosts(category);
  });
}

// Show Create Post Modal
document.getElementById('create-post-button').addEventListener('click', function() {
  document.getElementById('create-post-modal').style.display = 'block';
});

// Close the Create Post Modal when the X button is clicked
document.getElementById('close-modal-button').addEventListener('click', function() {
  document.getElementById('create-post-modal').style.display = 'none';
});

// Save posts to localStorage
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
  console.log("Posts saved to localStorage:", posts); // Debug log
}

// Function to display posts for a specific category
function displayPosts(category) {
  const postsDiv = document.getElementById(`${category}-posts`);
  if (!postsDiv) {
    console.error(`No element found with ID: ${category}-posts`);
    return;
  }
  postsDiv.innerHTML = '';

  if (posts[category] && posts[category].length > 0) {
    // Filter posts by the selected college
    const filteredPosts = posts[category].filter(post => post.college === userCollege);

    if (filteredPosts.length > 0) {
      filteredPosts.forEach((post, filteredIndex) => {
        // Find the original index of the post in the posts array
        const originalIndex = posts[category].findIndex(p => p === post);

        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
          <div class="post-header">
            <h3>${post.title}</h3>
            ${post.user === currentUser ? `
              <div class="post-menu">
                <button class="menu-button" onclick="toggleMenu(this)">&#8942;</button>
                <div class="menu-options">
                  <button onclick="enableEdit('${category}', ${originalIndex}, this)">
                    <span class="icon-wrapper"><img src="editing.png" alt="Edit" class="edit-icon" width="16" height="16"></span>
                    <span>Edit</span>
                  </button>
                  <button onclick="deletePost('${category}', ${originalIndex})">
                    <span class="icon-wrapper">🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
          <p>${post.text}</p>
          <div class="post-meta">
            <small>Posted by ${post.user} on ${new Date(post.createdAt).toLocaleString()}</small>
            ${post.updatedAt ? `<small> | Last edited on ${new Date(post.updatedAt).toLocaleString()}</small>` : ''}
          </div>
          ${post.attachments ? `
            <div class="attachments">
              ${post.attachments.map(att => `
                <div class="attachment">
                  ${att.type.startsWith('image/') 
                    ? `<img src="${att.url}" alt="Attachment" class="attached-image">`
                    : `<a href="${att.url}" download="${att.name}">${att.name}</a>`
                  }
                </div>
              `).join('')}
            </div>
          ` : ''}
          <div class="post-actions">
            <button onclick="upvote('${category}', ${originalIndex})" class="vote-button">
              ❤️ ${post.upvotes || 0}
            </button>
            <button onclick="toggleComments(this)" class="comments-button">
              💬 ${(post.replies || []).length}
            </button>
          </div>
          <div class="comments-section" style="display: none;">
            <form class="reply-form">
              <textarea placeholder="Type your reply here..." required></textarea>
              <button type="submit">💬</button>
            </form>
            <div class="replies">
              ${(post.replies || []).map((reply, replyIndex) => `
                <div class="reply">
                  <div class="reply-header">
                    <p><strong>${reply.user}:</strong> ${reply.text}</p>
                    <small>Replied on ${new Date(reply.createdAt).toLocaleString()}</small>
                    ${reply.user === currentUser ? `
                      <div class="reply-menu">
                        <button class="menu-button" onclick="toggleMenu(this)">&#8942;</button>
                        <div class="menu-options">
                          <button onclick="enableEditReply('${category}', ${originalIndex}, ${replyIndex}, this)">
                            <span class="icon-wrapper"><img src="editing.png" alt="Edit" class="edit-icon" width="16" height="16"></span>
                            <span>Edit</span>
                          </button>
                          <button onclick="deleteReply('${category}', ${originalIndex}, ${replyIndex})">
                            <span class="icon-wrapper">🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        // Add event listener for reply form
        const replyForm = postElement.querySelector('.reply-form');
        replyForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const replyText = replyForm.querySelector('textarea').value.trim();
          if (replyText) {
            posts[category][originalIndex].replies = posts[category][originalIndex].replies || [];
            posts[category][originalIndex].replies.push({
              text: replyText,
              user: currentUser,
              createdAt: new Date().toISOString() // Add timestamp for reply
            });
            savePosts();
            displayPosts(category);
          }
        });

        postsDiv.appendChild(postElement);
      });
    } else {
      postsDiv.innerHTML = '<p>No posts available for this category in your college.</p>';
    }
  } else {
    postsDiv.innerHTML = '<p>No posts available for this category.</p>';
  }
}

// Function to toggle comments section
function toggleComments(button) {
  const commentsSection = button.closest('.post').querySelector('.comments-section');
  commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

// Function to toggle the three dots menu
function toggleMenu(button) {
  const menuOptions = button.nextElementSibling;
  menuOptions.style.display = menuOptions.style.display === 'block' ? 'none' : 'block';
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.matches('.menu-button')) {
    document.querySelectorAll('.menu-options').forEach((menu) => {
      menu.style.display = 'none';
    });
  }
});

// Handle post submission
document.getElementById('create-post-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const postText = document.getElementById('create-post-input').value.trim();
  const postTitle = document.getElementById('post-title').value.trim();
  const fileInput = document.getElementById('file-upload');

  if (postText && postTitle) {
    const selectedCategory = document.getElementById('category-select').value;
    posts[selectedCategory] = posts[selectedCategory] || [];

    // Create the post object
    const newPost = {
      title: postTitle,
      text: postText,
      upvotes: 0,
      college: userCollege,
      user: currentUser,
      replies: [],
      attachments: [],
      createdAt: new Date().toISOString(), // Add timestamp for post creation
      updatedAt: null // Initialize updatedAt as null
    };

    // Handle file upload
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fakeUrl = URL.createObjectURL(file); // Simulate file upload
      newPost.attachments.push({
        name: file.name,
        type: file.type,
        url: fakeUrl
      });
    }

    // Add the post to the category
    posts[selectedCategory].push(newPost);
    savePosts();

    // Clear the form and hide the modal
    document.getElementById('create-post-input').value = '';
    document.getElementById('post-title').value = '';
    fileInput.value = ''; 
    document.getElementById('create-post-modal').style.display = 'none';

    // Refresh the posts
    displayPosts(selectedCategory);
  }
});

// Function to upvote a post
function upvote(category, postIndex) {
  if (!posts[category] || !posts[category][postIndex]) {
    console.error("Invalid category or post index");
    return;
  }
  posts[category][postIndex].upvotes = (posts[category][postIndex].upvotes || 0) + 1;
  savePosts();
  displayPosts(category);
}

// Function to enable editing for a post
function enableEdit(category, postIndex, editButton) {
  const postElement = editButton.closest('.post');
  const postTitle = postElement.querySelector('h3');
  const postContent = postElement.querySelector('p');

  // Replace title and content with editable fields
  postTitle.innerHTML = `
    <input type="text" class="edit-title" value="${postTitle.innerText}">
  `;
  postContent.innerHTML = `
    <textarea class="edit-content">${postContent.innerText}</textarea>
  `;

  // Replace the Edit button with a Save button
  const postActions = postElement.querySelector('.post-actions');
  postActions.innerHTML = `
    <button onclick="saveEdit('${category}', ${postIndex}, this)">💾 Save</button>
  `;
}

// Function to save edits for a post
function saveEdit(category, postIndex, saveButton) {
  const postElement = saveButton.closest('.post');
  const editedTitle = postElement.querySelector('.edit-title').value.trim();
  const editedContent = postElement.querySelector('.edit-content').value.trim();

  if (editedTitle && editedContent) {
    posts[category][postIndex].title = editedTitle;
    posts[category][postIndex].text = editedContent;
    posts[category][postIndex].updatedAt = new Date().toISOString(); // Update timestamp
    savePosts();
    displayPosts(category);
  }
}

// Function to delete a post
function deletePost(category, postIndex) {
  if (confirm("Are you sure you want to delete this post?")) {
    posts[category].splice(postIndex, 1);
    savePosts();
    displayPosts(category);
  }
}

// Function to enable editing for a reply
function enableEditReply(category, postIndex, replyIndex, editButton) {
  const replyElement = editButton.closest('.reply');
  const replyContent = replyElement.querySelector('p');
  const originalText = replyContent.innerText.replace(`${posts[category][postIndex].replies[replyIndex].user}: `, '');

  // Replace content with editable field
  replyContent.innerHTML = `
    <strong>${posts[category][postIndex].replies[replyIndex].user}:</strong> 
    <textarea class="edit-reply-content">${originalText}</textarea>
  `;

  // Add a save button
  replyElement.innerHTML += `
    <div class="reply-actions">
      <button onclick="saveEditReply('${category}', ${postIndex}, ${replyIndex}, this)">💾 Save</button>
    </div>
  `;
}

// Function to save edits for a reply
function saveEditReply(category, postIndex, replyIndex, saveButton) {
  const replyElement = saveButton.closest('.reply');
  const editedContent = replyElement.querySelector('.edit-reply-content').value.trim();

  if (editedContent) {
    posts[category][postIndex].replies[replyIndex].text = editedContent;
    posts[category][postIndex].replies[replyIndex].updatedAt = new Date().toISOString(); // Update timestamp
    savePosts();
    displayPosts(category);
  }
}

// Function to delete a reply
function deleteReply(category, postIndex, replyIndex) {
  if (confirm("Are you sure you want to delete this reply?")) {
    posts[category][postIndex].replies.splice(replyIndex, 1);
    savePosts();
    displayPosts(category);
  }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('create-post-modal');
  const createPostButton = document.getElementById('create-post-button');
  if (modal.style.display === 'block' && !modal.contains(e.target) && e.target !== createPostButton) {
    modal.style.display = 'none';
  }
});

// Hamburger Menu Toggle
document.getElementById('hamburger-menu').addEventListener('click', function() {
  const navMenu = document.getElementById('nav-menu');
  this.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close the menu when clicking outside
document.addEventListener('click', function(event) {
  const navMenu = document.getElementById('nav-menu');
  const hamburgerMenu = document.getElementById('hamburger-menu');

  if (!navMenu.contains(event.target) && !hamburgerMenu.contains(event.target)) {
    navMenu.classList.remove('active');
    hamburgerMenu.classList.remove('active');
  }
});

// Add event listeners to all extender buttons
document.querySelectorAll('.extender-button').forEach((button) => {
  button.addEventListener('click', function () {
    const section = this.closest('section');
    
    // Toggle between collapsed and expanded states
    if (section.classList.contains('collapsed')) {
      // Expand: Show the posts
      section.classList.remove('collapsed');
      section.classList.add('expanded');
      this.textContent = '▲'; // Change to an upward triangle
    } else {
      // Collapse: Hide all posts
      section.classList.remove('expanded');
      section.classList.add('collapsed');
      this.textContent = '▼'; // Change to a downward triangle
    }
  });
});

// Initialize posts for each category
refreshPosts();