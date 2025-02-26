document.addEventListener("DOMContentLoaded", function () {
    let editingEvent = JSON.parse(localStorage.getItem("editingEvent"));
    
    if (editingEvent) {
        document.getElementById("event-title").value = editingEvent.title;
        document.getElementById("event-what").value = editingEvent.what;
        document.getElementById("event-where").value = editingEvent.where;
        document.getElementById("event-when").value = editingEvent.when;
        document.getElementById("event-description").value = editingEvent.description;
        document.getElementById("event-link").value = editingEvent.link;
        document.getElementById("event-category").value = editingEvent.sectionId;
        
        document.getElementById("post-button").innerText = "Save Changes";
    }

    document.getElementById("post-button").addEventListener("click", postEvent);
    document.getElementById("cancel-button").addEventListener("click", cancelPost);
});

function postEvent() {
    let title = document.getElementById("event-title").value.trim();
    let what = document.getElementById("event-what").value.trim();
    let where = document.getElementById("event-where").value.trim();
    let when = document.getElementById("event-when").value.trim();
    let description = document.getElementById("event-description").value.trim();
    let link = document.getElementById("event-link").value.trim();
    let sectionId = document.getElementById("event-category").value;

    if (!title || !what || !where || !when || !description || !link) {
        alert("Please fill in all fields before posting.");
        return;
    }

    let events = JSON.parse(localStorage.getItem("events")) || [];
    let editingEvent = JSON.parse(localStorage.getItem("editingEvent"));

    if (editingEvent) {
        // Update the existing event
        let eventIndex = events.findIndex(event => event.id === editingEvent.id);
        if (eventIndex !== -1) {
            events[eventIndex] = { ...editingEvent, title, what, where, when, description, link, sectionId };
        }
        localStorage.removeItem("editingEvent");  // Clear editing mode
    } else {
        // Create a new event
        let id = "event-" + Date.now();  // Generate a unique ID
        events.push({ id, title, what, where, when, description, link, sectionId });
    }

    localStorage.setItem("events", JSON.stringify(events));
    window.location.href = "NetworkingPage.html";  // Redirect to events page
}

function cancelPost() {
    // Redirect back to the main page without saving
    window.location.href = "NetworkingPage.html";
}

// Function to display events with icons
function displayEvent(event) {
    // Find the correct category container for the event
    const categoryContainer = document.getElementById(event.sectionId);

    // Create the event entry element
    const eventEntry = document.createElement('div');
    eventEntry.classList.add('event-entry');

    // Add the event content (with icons) to the entry
    const eventDetails = `
        <div class="event-details">
            <img src="icons/what.png" alt="What Icon" class="event-icon">
            <p> ${event.what}</p>
        </div>
        <div class="event-details">
            <img src="icons/where-icon.png" alt="Where Icon" class="event-icon">
            <p> ${event.where}</p>
        </div>
        <div class="event-details">
            <img src="icons/when-icon.png" alt="When Icon" class="event-icon">
            <p>< ${event.when}</p>
        </div>
        <div class="event-description">
            <strong>Description:</strong>
            <p class="description">${event.description}</p>
        </div>
        <a href="${event.link}">Register Here</a>
    `;

    eventEntry.innerHTML = eventDetails;

    // Append the event entry to the category container
    categoryContainer.appendChild(eventEntry);
}

// Loop through events stored in localStorage and display them
const events = JSON.parse(localStorage.getItem("events")) || [];
events.forEach(displayEvent);
