from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Using a simple list to simulate a database for demonstration purposes
annotations_db = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_annotation', methods=['POST'])
def save_annotation():
    annotation = request.json
    annotations_db.append(annotation)
    return jsonify(success=True)

@app.route('/delete_annotation', methods=['POST'])
def delete_annotation():
    annotation_id = request.json.get('id')
    global annotations_db
    annotations_db = [ann for ann in annotations_db if ann['id'] != annotation_id]
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
