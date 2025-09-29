from sentence_transformers import SentenceTransformer, util
import easyocr, re, spacy

model = SentenceTransformer('all-MiniLM-L6-v2')
reader = easyocr.Reader(['en'])
nlp = spacy.load("en_core_web_sm")

def extract_text(image_path):
    result = reader.readtext(image_path, detail=0)
    return " ".join(result)

def extract_fields_regex(text):
    fields = {}
    fields['name'] = re.search(r'presented to\s*([A-Z][a-zA-Z\s]*?)(?=\s+For\b)', text)
    fields['name'] = fields['name'].group(1).strip() if fields['name'] else None
    fields['event'] = re.search(r'participating in the (.*?) held by', text)
    fields['event'] = fields['event'].group(1).strip() if fields['event'] else None
    fields['issuer'] = re.search(r'held by (.*?) on', text)
    fields['issuer'] = fields['issuer'].group(1).strip() if fields['issuer'] else None
    fields['date'] = re.search(r'on ([0-9]{1,2} [A-Za-z]+ [0-9]{4})', text)
    fields['date'] = fields['date'].group(1).strip() if fields['date'] else None
    return fields

def extract_fields_ner(text):
    fields = {}
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            fields['name_ner'] = ent.text
        elif ent.label_ == "ORG":
            fields['issuer_ner'] = ent.text
        elif ent.label_ == "DATE":
            fields['date_ner'] = ent.text
    return fields

def combine_db_fields(regex_fields, ner_fields):
    return " ".join([
        regex_fields.get('name') or ner_fields.get('name_ner') or '',
        regex_fields.get('event') or '',
        regex_fields.get('issuer') or ner_fields.get('issuer_ner') or '',
        regex_fields.get('date') or ner_fields.get('date_ner') or ''
    ])

def extract_non_db_text(full_text, db_fields_text):
    db_words = set(db_fields_text.split())
    non_db_words = [w for w in full_text.split() if w not in db_words]
    return " ".join(non_db_words)

def text_similarity(text1, text2):
    emb1 = model.encode(text1, convert_to_tensor=True)
    emb2 = model.encode(text2, convert_to_tensor=True)
    return float(util.cos_sim(emb1, emb2))

extracted_text = extract_text("trial.png")
regex_fields = extract_fields_regex(extracted_text)
ner_fields = extract_fields_ner(extracted_text)
db_fields_text = combine_db_fields(regex_fields, ner_fields)
db_score = text_similarity(db_fields_text, db_fields_text)
non_db_text = extract_non_db_text(extracted_text, db_fields_text)
template_non_db_text = "CERTIFICATE OF PARTICIPATION This certificate is proudly presented to For participating in the held by on 2025. l RANDOM SIGNATURE Just for testing purposes. Not valid for official purposes."
non_db_score = text_similarity(non_db_text, template_non_db_text)

print("DB Fields Text:", db_fields_text)
print("DB Fields Similarity:", round(db_score, 2))
print("Non-DB Text:", non_db_text)
print("Non-DB Text Similarity:", round(non_db_score, 2))
print("Fields via Regex:", regex_fields)
print("Fields via NER:", ner_fields)
