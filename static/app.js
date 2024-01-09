document.addEventListener('DOMContentLoaded', function() {
    var quill = new Quill('#editor', { theme: 'snow' });
    var annotations = [];

    function highlightText(range, annotationText) {
        const id = Math.random().toString(36).substring(2, 9);
        quill.formatText(range.index, range.length, { 'background': '#FFFF00', 'annotation-id': id });
        addAnnotation(id, annotationText, range);
    }

    function addAnnotation(id, text, range) {
        const annotation = { id, text, range };
        annotations.push(annotation); // Store annotation
        saveAnnotationToServer(annotation);
        displayAnnotation(annotation);
    }

    function displayAnnotation(annotation) {
        const annotationsContainer = document.getElementById('annotations-container');
        const annotationEl = document.createElement('div');
        annotationEl.classList.add('annotation');
        annotationEl.id = `annotation-${annotation.id}`;
        annotationEl.innerHTML = `
            <span>${annotation.text}</span>
            <button onclick="deleteAnnotation('${annotation.id}')">Delete</button>
        `;
        annotationsContainer.appendChild(annotationEl);
    }

    window.deleteAnnotation = function(id) {
        const annotation = annotations.find(a => a.id === id);
        if (annotation) {
            // Remove the background color
            quill.formatText(annotation.range.index, annotation.range.length, { background: false });
            annotations = annotations.filter(a => a.id !== id);
            removeAnnotationFromServer(id);
            document.getElementById(`annotation-${id}`).remove();
        }
    };

    function removeAnnotationFromServer(id) {
        fetch('/delete_annotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Annotation deleted:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    quill.on('selection-change', function(range) {
        if (range && range.length > 0) {
            var annotationText = prompt("Add annotation for the selected text:");
            if (annotationText) {
                highlightText(range, annotationText);
            }
        }
    });

    function saveAnnotationToServer(annotation) {
        // Implement AJAX request to save the annotation
    }
});