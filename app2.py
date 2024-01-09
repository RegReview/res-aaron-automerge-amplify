from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Assuming we store the document state as a JSON object
# In a real application, this would be more sophisticated, possibly involving a database
document_states = {}

@app.route('/')
def index():
    return render_template('index2.html')

@app.route('/get-document', methods=['GET'])
def get_document():
    # For simplicity, using a static document ID
    doc_id = 'doc1'
    document = document_states.get(doc_id, None)
    return jsonify(document)

@app.route('/update-document', methods=['POST'])
def update_document():
    doc_id = 'doc1'
    new_state = request.json
    # Update the document state with the new state from the client
    document_states[doc_id] = new_state
    return jsonify({"success": True, "message": "Document updated"})

if __name__ == '__main__':
    app.run(debug=True)