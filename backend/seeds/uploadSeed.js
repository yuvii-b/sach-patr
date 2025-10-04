const mongoose = require("mongoose");
const Upload = require("../models/uploads");

async function seedUploads() {
 mongoose.connect('mongodb://localhost:27017/CrediBull', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
 .then(() => {
   console.log("MongoDB connection successful!");
 })
 .catch((err) => {
   console.error(" MongoDB connection error:", err);
 });

  const userId = "68dbb6d79db7d3fc6ce99a5f"; // foreign key reference

  const sampleData = [
    { certificateId: "CERT001", issuedToName: "Arjun Kumar" },
    { certificateId: "CERT002", issuedToName: "Priya Sharma" },
    { certificateId: "CERT003", issuedToName: "Ravi Patel" },
    { certificateId: "CERT004", issuedToName: "Sneha Nair" },
    { certificateId: "CERT005", issuedToName: "Vikram Reddy" },
    { certificateId: "CERT006", issuedToName: "Meera Iyer" },
    { certificateId: "CERT007", issuedToName: "Karan Singh" },
    { certificateId: "CERT008", issuedToName: "Ananya Das" },
    { certificateId: "CERT009", issuedToName: "Suresh Babu" },
    { certificateId: "CERT010", issuedToName: "Divya Menon" },
    { certificateId: "CERT011", issuedToName: "Rahul Verma" },
    { certificateId: "CERT012", issuedToName: "Pooja Mishra" },
    { certificateId: "CERT013", issuedToName: "Amit Joshi" },
    { certificateId: "CERT014", issuedToName: "Neha Kapoor" },
    { certificateId: "CERT015", issuedToName: "Manoj Gupta" },
  ];

  // helper to pick random enum
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const enums = ["pass", "suspicious", "fail"];

  const docs = sampleData.map((item, i) => ({
    certificateId: item.certificateId,
    issuedBy: "Smart India Institute of Technology",
    issuedTo: userId,
    issuedDate: new Date(2023, 5, i + 1), // June 2023
    uploadDate: new Date(2023, 6, i + 1), // July 2023
    realPercent: Math.random().toFixed(2), // 0.00 – 1.00
    textConsistency: pick(enums),
    metadataValidation: pick(enums),
    logoMismatch: pick(enums),
    digitalSignature: pick(enums),
    flag: pick(enums),
  }));

  await Upload.insertMany(docs);
  console.log("Upload seed data inserted");
  mongoose.connection.close();
}

seedUploads();
