# api for the ml model (untested)
from flask import Flask, request, jsonify, send_file
import os, uuid 
from verify import *

app = Flask(__name__)

UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True) # directory to store the certs uploaded

@app.route("/verify", methods=["POST"])
def verify_certificate():
    if "file" not in request.files:
        return jsonify({"Error": "No file uploaded"}), 400
    
    file = request.files["file"]
    cert_id = request.form.get("cert_id", f"CERT-{uuid.uuid4().hex[:6]}") # optional certificate id
    filepath = os.path.join(UPLOADS_DIR, file.filename)
    file.save(filepath)

    extracted_text = extract_text(filepath)
    regex_fields = extract_fields_regex(extracted_text)
    ner_fields = extract_fields_ner(extracted_text)
    db_fields_text = combine_db_fields(regex_fields, ner_fields)
    non_db_text = extract_non_db_text(extracted_text, db_fields_text)

    results = embed_certificate(filepath, non_db_text, db_fields_text, cert_id)
    heatmap_path = None
    stored_img = f"{cert_id}_image.png"
    if os.path.exists(stored_img) and filepath != stored_img:
        heatmap_path = f"{cert_id}_heatmap.png"
        deltaE_heatmap(stored_img, filepath, output_path=heatmap_path)
    
    response = {
        "cert_id": cert_id,
        "regex_fields": regex_fields,
        "ner_fields": ner_fields,
        "db_fields_text": db_fields_text,
        "metrics": results if results else "Stored new certificate."
    }

    if heatmap_path and os.path.exists(heatmap_path):
        return send_file(heatmap_path, mimetype="image/png")  # OR return JSON + link
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)