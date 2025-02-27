document.addEventListener("DOMContentLoaded", function () {
    const postForm = document.getElementById("postForm");
    const postsContainer = document.getElementById("postsContainer");
    const imageUpload = document.getElementById("imageUpload");
    const addLinkButton = document.getElementById("addLinkButton");
    const menuIcon = document.getElementById("menuIcon");
    const navMenu = document.getElementById("navMenu");
    const currentUser = localStorage.getItem("currentUser") || "anonymous"; // Get username from localStorage

    let link = ""; // Store the link entered by the user

    // Toggle navigation menu
    menuIcon.addEventListener("click", function() {
        navMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function(event) {
        if (!event.target.closest(".menu-icon") && !event.target.closest(".nav-menu")) {
            navMenu.classList.remove("active");
        }
    });

    loadPosts();

    // Image Upload Button
    imageUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            alert(`Image "${file.name}" selected for upload.`);
        }
    });

    // Link Button
    addLinkButton.addEventListener("click", function () {
        link = prompt("Enter a link:");
        if (link) {
            // Add http:// if not present
            if (!/^https?:\/\//i.test(link)) {
                link = "http://" + link;
            }
            alert(`Link "${link}" added.`);
        }
    });

    // Post Form Submission
    postForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const description = document.getElementById("activityDescription").value;
        const hashtags = document.getElementById("activityHashtags").value;
        const timestamp = new Date().toLocaleString();

        if (description.trim() === "") return;

        // Convert image to Base64
        const file = imageUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageBase64 = e.target.result;
                savePostAndAddToPage(description, hashtags, timestamp, imageBase64, link);
            };
            reader.readAsDataURL(file);
        } else {
            savePostAndAddToPage(description, hashtags, timestamp, null, link);
        }
    });

    function savePostAndAddToPage(description, hashtags, timestamp, imageBase64, link) {
        const post = {
            id: Date.now(),
            description: highlightHashtags(description), // Highlight hashtags
            hashtags: highlightHashtags(hashtags),
            timestamp,
            likes: 0,
            likedBy: [], // Array to track users who liked this post
            comments: [],
            userId: currentUser,
            image: imageBase64, // Store image as Base64
            link: link || null // Store the link
        };

        savePost(post);
        addPostToPage(post);

        // Clear the form
        document.getElementById("activityDescription").value = "";
        document.getElementById("activityHashtags").value = "";
        imageUpload.value = ""; // Clear the file input
        link = ""; // Reset the link
    }

    function highlightHashtags(text) {
        const highlightedText = text.replace(/#(\w+)/g, (match, tag) => {
            return `<a href="https://www.google.com/search?q=${tag}" target="_blank" class="hashtag">${match}</a>`;
        });
        return highlightedText;
    }

    function addPostToPage(post) {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.dataset.id = post.id;
        
        // Check if the current user has liked this post
        const hasLiked = post.likedBy && post.likedBy.includes(currentUser);
        
        postElement.innerHTML = `
            <p>${post.description}</p>
            ${post.image ? `<img src="${post.image}" class="post-image" alt="Post Image">` : ''}
            ${post.link ? `<p><a href="${post.link}" target="_blank" class="post-link">${post.link}</a></p>` : ''}
            <p><small>${post.hashtags}</small></p>
            <p><small>${post.timestamp}</small></p>
            <p><small>Posted by ${post.userId}</small></p>
            <div class="post-actions"></div>
            <div class="like-comment">
                <button class="like-button ${hasLiked ? 'liked' : ''}">
                    <img src="fun_icon/heart.png" alt="Like"> <span>${post.likes}</span>
                </button>
                <button class="comment-button"><img src="fun_icon/chat.png" alt="Comment"> <span>${post.comments.length}</span></button>
            </div>
            <div class="comment-section"></div>
            <div class="comment-display"></div>
        `;

        // Add Edit & Delete buttons for the post owner
        const postActions = postElement.querySelector(".post-actions");
        if (post.userId === currentUser) {
            const editButton = document.createElement("button");
            editButton.innerHTML = `<img src="fun_icon/edit.png" alt="Edit">`; // Edit image
            editButton.classList.add("edit-button");

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = `<img src="fun_icon/delete.png" alt="Delete">`; // Delete image
            deleteButton.classList.add("delete-button");

            editButton.addEventListener("click", () => editPost(post, postElement));
            deleteButton.addEventListener("click", () => deletePost(post.id, postElement));

            postActions.appendChild(editButton);
            postActions.appendChild(deleteButton);
        }

        // Like button functionality with toggle
        const likeButton = postElement.querySelector(".like-button");
        likeButton.addEventListener("click", function () {
            // Get fresh copy of posts
            const posts = JSON.parse(localStorage.getItem("posts")) || [];
            const postIndex = posts.findIndex(p => p.id == post.id);
            
            if (postIndex !== -1) {
                // Initialize likedBy array if it doesn't exist
                if (!posts[postIndex].likedBy) {
                    posts[postIndex].likedBy = [];
                }
                
                const userLikeIndex = posts[postIndex].likedBy.indexOf(currentUser);
                
                if (userLikeIndex === -1) {
                    // User has not liked the post, add like
                    posts[postIndex].likedBy.push(currentUser);
                    posts[postIndex].likes = posts[postIndex].likedBy.length;
                    likeButton.classList.add('liked');
                } else {
                    // User already liked the post, remove like
                    posts[postIndex].likedBy.splice(userLikeIndex, 1);
                    posts[postIndex].likes = posts[postIndex].likedBy.length;
                    likeButton.classList.remove('liked');
                }
                
                // Update like count in the UI
                likeButton.querySelector('span').textContent = posts[postIndex].likes;
                
                // Save updated posts
                localStorage.setItem("posts", JSON.stringify(posts));
                
                // Update the post object
                post.likes = posts[postIndex].likes;
                post.likedBy = posts[postIndex].likedBy;
            }
        });

        // Comment section with send icon
        const commentButton = postElement.querySelector(".comment-button");
        const commentSection = postElement.querySelector(".comment-section");
        const commentDisplay = postElement.querySelector(".comment-display");

        commentButton.addEventListener("click", function () {
            const commentInput = document.createElement("input");
            commentInput.type = "text";
            commentInput.placeholder = "Write a comment...";
            
            const sendButton = document.createElement("button");
            sendButton.innerHTML = `<img src="fun_icon/check-mark.png" alt="Send">`; // Send image
            sendButton.classList.add("send-button");

            sendButton.addEventListener("click", function () {
                addComment(post, commentInput, commentDisplay, commentButton);
            });

            commentInput.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    addComment(post, commentInput, commentDisplay, commentButton);
                }
            });

            commentSection.innerHTML = ""; // Prevent multiple inputs
            commentSection.appendChild(commentInput);
            commentSection.appendChild(sendButton);
        });

        // Display existing comments
        post.comments.forEach((comment, index) => {
            const commentDisplayItem = document.createElement("div");
            commentDisplayItem.classList.add("comment-item");
            commentDisplayItem.innerHTML = `
                <p>${comment.text}</p>
                <small>Commented by ${comment.userId}</small>
                <div class="comment-actions">
                    <button class="like-button ${comment.likedBy && comment.likedBy.includes(currentUser) ? 'liked' : ''}">
                        <img src="fun_icon/heart.png" alt="Like"> <span>${comment.likes}</span>
                    </button>
                    ${comment.userId === currentUser ? `
                        <button class="edit-comment-button"><img src="fun_icon/edit.png" alt="Edit"></button>
                        <button class="delete-comment-button"><img src="fun_icon/delete.png" alt="Delete"></button>
                    ` : ''}
                </div>
            `;

            // Add like functionality to comment likes with toggle
            const commentLikeButton = commentDisplayItem.querySelector(".like-button");
            commentLikeButton.addEventListener("click", function () {
                // Initialize likedBy array if it doesn't exist
                if (!comment.likedBy) {
                    comment.likedBy = [];
                }
                
                const userLikeIndex = comment.likedBy.indexOf(currentUser);
                
                if (userLikeIndex === -1) {
                    // User has not liked the comment, add like
                    comment.likedBy.push(currentUser);
                    comment.likes = comment.likedBy.length;
                    commentLikeButton.classList.add('liked');
                } else {
                    // User already liked the comment, remove like
                    comment.likedBy.splice(userLikeIndex, 1);
                    comment.likes = comment.likedBy.length;
                    commentLikeButton.classList.remove('liked');
                }
                
                // Update UI
                commentLikeButton.querySelector('span').textContent = comment.likes;
                
                // Save to localStorage
                updateStorage();
            });

            // Add edit functionality to comments
            const editCommentButton = commentDisplayItem.querySelector(".edit-comment-button");
            if (editCommentButton) {
                editCommentButton.addEventListener("click", function () {
                    // Replace the comment text with an input field for editing
                    const commentText = commentDisplayItem.querySelector("p");
                    const editInput = document.createElement("input");
                    editInput.type = "text";
                    editInput.value = comment.text;
                    commentText.replaceWith(editInput);

                    // Add a send icon for saving the edited comment
                    const sendIcon = document.createElement("button");
                    sendIcon.innerHTML = `<img src="fun_icon/check-mark.png" alt="Send">`; // Send icon
                    sendIcon.classList.add("send-button");

                    // Save the edited comment when the send icon is clicked
                    sendIcon.addEventListener("click", function () {
                        saveEditedComment(comment, editInput, commentDisplayItem, editCommentButton);
                    });

                    // Save the edited comment when Enter is pressed
                    editInput.addEventListener("keypress", function (e) {
                        if (e.key === "Enter") {
                            saveEditedComment(comment, editInput, commentDisplayItem, editCommentButton);
                        }
                    });

                    // Replace the edit button with the send icon
                    editCommentButton.replaceWith(sendIcon);
                });
            }

            // Add delete functionality to comments
            const deleteCommentButton = commentDisplayItem.querySelector(".delete-comment-button");
            if (deleteCommentButton) {
                deleteCommentButton.addEventListener("click", function () {
                    post.comments.splice(index, 1); // Remove the comment
                    commentDisplayItem.remove(); // Remove the comment from the DOM
                    commentButton.innerHTML = `<img src="fun_icon/chat.png" alt="Comment"> <span>${post.comments.length}</span>`; // Update comment count
                    updateStorage();
                });
            }

            commentDisplay.appendChild(commentDisplayItem);
        });

        postsContainer.prepend(postElement);
    }

    function saveEditedComment(comment, editInput, commentDisplayItem, editCommentButton) {
        const newCommentText = editInput.value.trim();
        if (newCommentText) {
            // Update the comment text
            comment.text = newCommentText;

            // Replace the input field with the updated comment text
            const updatedCommentText = document.createElement("p");
            updatedCommentText.textContent = newCommentText;
            editInput.replaceWith(updatedCommentText);

            // Replace the send icon with the edit button
            const sendIcon = commentDisplayItem.querySelector(".send-button");
            if (sendIcon) sendIcon.replaceWith(editCommentButton);

            // Update localStorage
            updateStorage();
        }
    }

    function editPost(post, postElement) {
        // Pre-fill the form with the post data
        document.getElementById("activityDescription").value = post.description.replace(/<a href="https:\/\/www\.google\.com\/search\?q=\w+" target="_blank" class="hashtag">|<\/a>/g, "");
        document.getElementById("activityHashtags").value = post.hashtags.replace(/<a href="https:\/\/www\.google\.com\/search\?q=\w+" target="_blank" class="hashtag">|<\/a>/g, "");
        link = post.link || "";

        // If the post has an image, pre-fill the image upload
        if (post.image) {
            // Convert Base64 image to a file object
            const file = dataURLtoFile(post.image, "image.png");
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageUpload.files = dataTransfer.files;
        } else {
            imageUpload.value = ""; // Clear the image upload
        }

        // Delete the old post
        deletePost(post.id, postElement);

        // Scroll to the form for editing
        document.getElementById("postForm").scrollIntoView({ behavior: "smooth" });
    }

    // Helper function to convert Base64 to a file object
    function dataURLtoFile(dataURL, filename) {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    function deletePost(postId, postElement) {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const updatedPosts = posts.filter(p => p.id != postId);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        postElement.remove();
    }

    function savePost(post) {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.unshift(post);
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.forEach(addPostToPage);
    }

    function updateStorage() {
        const posts = [];
        postsContainer.querySelectorAll(".post").forEach(postElement => {
            const id = postElement.dataset.id;
            const description = postElement.querySelector("p:first-of-type").innerHTML;
            
            // Get hashtags (may be in different positions depending on post content)
            let hashtags = "";
            const smallElements = postElement.querySelectorAll("p small");
            smallElements.forEach(el => {
                if (el.innerHTML.includes('#')) {
                    hashtags = el.innerHTML;
                }
            });
            
            const timestamp = Array.from(smallElements).find(el => 
                !el.innerHTML.includes('#') && !el.innerHTML.includes('Posted by')
            )?.textContent || '';
            
            const likes = parseInt(postElement.querySelector(".like-button span").textContent);
            
            // Get liked users
            const likeButton = postElement.querySelector(".like-button");
            const isLiked = likeButton.classList.contains('liked');
            
            // Get comments
            const comments = [];
            postElement.querySelectorAll(".comment-item").forEach(comment => {
                const text = comment.querySelector("p").textContent;
                const likes = parseInt(comment.querySelector(".like-button span").textContent);
                const commentUserId = comment.querySelector("small").textContent.replace("Commented by ", "");
                const likeButton = comment.querySelector(".like-button");
                const isCommentLiked = likeButton.classList.contains('liked');
                
                // Create likedBy array for comment
                let likedBy = [];
                if (isCommentLiked && !likedBy.includes(currentUser)) {
                    likedBy.push(currentUser);
                }
                
                comments.push({ 
                    text, 
                    likes, 
                    userId: commentUserId,
                    likedBy: likedBy
                });
            });

            const image = postElement.querySelector(".post-image")?.src || null;
            const link = postElement.querySelector(".post-link")?.href || null;
            const postedBy = Array.from(smallElements).find(el => 
                el.innerHTML.includes('Posted by')
            )?.textContent.replace('Posted by ', '') || currentUser;

            // Get likedBy array for post
            let likedBy = [];
            if (isLiked && !likedBy.includes(currentUser)) {
                likedBy.push(currentUser);
            }

            posts.push({
                id,
                description,
                hashtags,
                timestamp,
                likes,
                likedBy,
                comments,
                userId: postedBy,
                image,
                link
            });
        });
        
        localStorage.setItem("posts", JSON.stringify(posts));
    }

    function addComment(post, commentInput, commentDisplay, commentButton) {
        const commentText = commentInput.value.trim();
        if (commentText === "") return;

        const comment = {
            text: commentText,
            likes: 0,
            likedBy: [],
            userId: currentUser
        };

        post.comments.push(comment);
        updateStorage();

        // Clear the input field
        commentInput.value = "";

        // Update the comment display
        const commentDisplayItem = document.createElement("div");
        commentDisplayItem.classList.add("comment-item");
        commentDisplayItem.innerHTML = `
            <p>${comment.text}</p>
            <small>Commented by ${comment.userId}</small>
            <div class="comment-actions">
                <button class="like-button">
                    <img src="fun_icon/heart.png" alt="Like"> <span>${comment.likes}</span>
                </button>
                ${comment.userId === currentUser ? `
                    <button class="edit-comment-button"><img src="fun_icon/edit.png" alt="Edit"></button>
                    <button class="delete-comment-button"><img src="fun_icon/delete.png" alt="Delete"></button>
                ` : ''}
            </div>
        `;

        // Add like functionality to the new comment with toggle
        const commentLikeButton = commentDisplayItem.querySelector(".like-button");
        commentLikeButton.addEventListener("click", function () {
            // Initialize likedBy array if it doesn't exist
            if (!comment.likedBy) {
                comment.likedBy = [];
            }
            
            const userLikeIndex = comment.likedBy.indexOf(currentUser);
            
            if (userLikeIndex === -1) {
                // User has not liked the comment, add like
                comment.likedBy.push(currentUser);
                comment.likes = comment.likedBy.length;
                commentLikeButton.classList.add('liked');
            } else {
                // User already liked the comment, remove like
                comment.likedBy.splice(userLikeIndex, 1);
                comment.likes = comment.likedBy.length;
                commentLikeButton.classList.remove('liked');
            }
            
            // Update UI
            commentLikeButton.querySelector('span').textContent = comment.likes;
            
            // Save to localStorage
            updateStorage();
        });

        // Add edit functionality to the new comment
        const editCommentButton = commentDisplayItem.querySelector(".edit-comment-button");
        if (editCommentButton) {
            editCommentButton.addEventListener("click", function () {
                // Replace the comment text with an input field for editing
                const commentText = commentDisplayItem.querySelector("p");
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = comment.text;
                commentText.replaceWith(editInput);

                // Add a send icon for saving the edited comment
                const sendIcon = document.createElement("button");
                sendIcon.innerHTML = `<img src="fun_icon/check-mark.png" alt="Send">`; // Send icon
                sendIcon.classList.add("send-button");

                // Save the edited comment when the send icon is clicked
                sendIcon.addEventListener("click", function () {
                    saveEditedComment(comment, editInput, commentDisplayItem, editCommentButton);
                });

                // Save the edited comment when Enter is pressed
                editInput.addEventListener("keypress", function (e) {
                    if (e.key === "Enter") {
                        saveEditedComment(comment, editInput, commentDisplayItem, editCommentButton);
                    }
                });

                // Replace the edit button with the send icon
                editCommentButton.replaceWith(sendIcon);
            });
        }

        // Add delete functionality to the new comment
        const deleteCommentButton = commentDisplayItem.querySelector(".delete-comment-button");
        if (deleteCommentButton) {
            deleteCommentButton.addEventListener("click", function () {
                post.comments.splice(post.comments.indexOf(comment), 1); // Remove the comment
                commentDisplayItem.remove(); // Remove the comment from the DOM
                commentButton.innerHTML = `<img src="fun_icon/chat.png" alt="Comment"> <span>${post.comments.length}</span>`; // Update comment count
                updateStorage();
            });
        }

        commentDisplay.appendChild(commentDisplayItem);
        
        // Update comment count
        commentButton.innerHTML = `<img src="fun_icon/chat.png" alt="Comment"> <span>${post.comments.length}</span>`;
    }
});
