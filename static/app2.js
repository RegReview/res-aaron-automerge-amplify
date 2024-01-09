// Import Automerge (make sure your project setup supports ES6 imports)
import Automerge from 'automerge';

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Quill
    var quill = new Quill('#editor', {
        theme: 'snow'
    });

    // Initialize an Automerge document
    let doc = Automerge.init();

    // Function to apply changes from Quill to Automerge
    function applyQuillChangesToAutomerge(delta) {
        doc = Automerge.change(doc, 'Edit text', d => {
            // Convert Quill delta to Automerge changes (this requires custom implementation)
        });
        sendUpdateToServer();
    }

    // Add event listener for text change in Quill
    quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
            applyQuillChangesToAutomerge(delta);
        }
    });

    // Fetch the current document state from the server
    let response = await fetch('/get-document');
    let data = await response.json();
    if (data) {
        // Load the document state into Automerge
        doc = Automerge.load(data);
    }

    // Send updates to the server
    async function sendUpdateToServer() {
        const updatedDoc = Automerge.save(doc);
        await fetch('/update-document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDoc)
        });
        // Additional error handling can be added here
    }

    // Function to handle incoming updates (requires WebSocket or similar for real-time updates)
    function receiveUpdateFromServer(newData) {
        // Apply updates to Automerge document and reflect in Quill
    }
});
