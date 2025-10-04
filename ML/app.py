from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import verify  # your full verify.py
import base64

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/api/verify', methods=['POST'])
def api_verify():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    cert_id = request.form.get("certificate_id", "CERT-001")

    # Run your full verify logic
    extracted_text = verify.extract_text(filepath)
    regex_fields = verify.extract_fields_regex(extracted_text)
    ner_fields = verify.extract_fields_ner(extracted_text)
    db_fields_text = verify.combine_db_fields(regex_fields, ner_fields)
    non_db_text = verify.extract_non_db_text(extracted_text, db_fields_text)
    new_color_emb = verify.color_embedding(filepath)

    scores = verify.compare_against_stored(
        certificate_id=cert_id,
        new_non_db_text=non_db_text,
        new_color_emb=new_color_emb,
        new_db_fields_text=db_fields_text,
        new_image_path=filepath
    )

    heatmap_path = None
    noticeable_fraction = None
    if scores and os.path.exists(f"{cert_id}_image.png"):
        heatmap_file = f"{cert_id}_deltaE_heatmap.png"
        noticeable_fraction, heatmap_path = verify.deltaE_heatmap(f"{cert_id}_image.png", filepath, output_path=heatmap_file)

    response = {
        "extracted_text": extracted_text,
        "regex_fields": regex_fields,
        "ner_fields": ner_fields,
        "db_fields_text": db_fields_text,
        "non_db_text": non_db_text,
        "similarities": scores,
        "noticeable_color_fraction": noticeable_fraction,
        "heatmap_path": heatmap_path
    }

    return jsonify(response)


@app.route('/heatmap/<filename>')
def serve_heatmap(filename):
    path = os.path.join('.', filename)
    if os.path.exists(path):
        return send_file(path, mimetype='image/png')
    return "Not found", 404

if __name__ == "__main__":
    app.run(debug=True, port=8000)
