document.addEventListener("DOMContentLoaded", function () {
    loadStoredEvents();
    restoreCollapsibleState();
    attachCollapsibleListeners();
});

/**
 * Loads stored events from localStorage and displays them on the page.
 * Prevents duplicate entries by clearing only dynamically added events before reloading.
 */
function loadStoredEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];

    document.querySelectorAll(".event-entry").forEach(e => e.remove());

    events.forEach((event, index) => {
        let eventDiv = document.createElement("div");
        eventDiv.classList.add("event-entry");
        eventDiv.innerHTML = `
            <h3>${event.title}</h3>
            <p><img src="icons/what.png" alt="What Icon" class="event-icon"> ${event.what}</p>
            <p><img src="icons/where-icon.png" alt="Where Icon" class="event-icon"> ${event.where}</p>
            <p><img src="icons/when-icon.png" alt="When Icon" class="event-icon"> ${event.when}</p>
            <div class="event-description">
                <strong></strong>
                <p class="description">${event.description}</p>
             </div>
            <button class="register-btn" onclick="window.location.href='${event.link}'">Register Here</button>
           
            
            <div class="button-container">
                <button class="edit-btn" onclick="editEvent('${event.id}')">
                    <img src="icons/editing_icon.png" alt="Edit" class="icon">  
                </button>
                <button class="delete-btn" onclick="deleteEvent('${event.id}')">
                   <img src="icons/delete_icon.png" alt="Delete" class="icon"> 
                </button>
            </div>
            <hr>
        `;

        document.getElementById(event.sectionId).appendChild(eventDiv);
    });
}

/**
 * Redirects the user to the Post Page to edit an event.
 * @param {string} eventId - The unique ID of the event to be edited.
 */
function editEvent(eventId) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let eventToEdit = events.find(event => event.id === eventId);

    if (eventToEdit) {
        localStorage.setItem("editingEvent", JSON.stringify(eventToEdit));
        window.location.href = "PostPage.html"; // Redirect to the Post Page
    }
}

/**
 * Deletes a specific event from localStorage and updates the display.
 * @param {string} eventId - The unique ID of the event to be deleted.
 */
function deleteEvent(eventId) {
    let events = JSON.parse(localStorage.getItem("events")) || [];

    console.log("Deleting event with ID:", eventId); // Debugging log

    // Check if the event exists in localStorage
    let eventExists = events.some(event => event.id === eventId);
    if (!eventExists) {
        console.log("Event ID not found:", eventId);
        return;
    }

    // Remove the event with the matching ID
    let updatedEvents = events.filter(event => event.id !== eventId);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    console.log("Event deleted. Updated events:", updatedEvents); // Debugging log

    // Preserve UI state and refresh the event list
    saveCollapsibleState();
    loadStoredEvents();  
    restoreCollapsibleState();
}

/**
 * Attaches event listeners to all collapsible <details> elements.
 * Listens for the toggle event and saves the state when a section is opened or closed.
 */
function attachCollapsibleListeners() {
    document.querySelectorAll("details").forEach((detail) => {
        detail.addEventListener("toggle", saveCollapsibleState);
    });
}

/**
 * Saves the open/closed state of collapsible sections in localStorage.
 */
function saveCollapsibleState() {
    let state = {};
    document.querySelectorAll("details").forEach((detail) => {
        if (detail.id) {
            state[detail.id] = detail.open;
        }
    });
    localStorage.setItem("collapsibleState", JSON.stringify(state));
}

/**
 * Restores the open/closed state of collapsible sections when the page reloads.
 */
function restoreCollapsibleState() {
    let state = JSON.parse(localStorage.getItem("collapsibleState")) || {};
    document.querySelectorAll("details").forEach((detail) => {
        if (state[detail.id]) {
            detail.open = true;
        }
    });
}
