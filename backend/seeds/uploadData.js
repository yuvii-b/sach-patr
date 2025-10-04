const data=[
  {
    certificateId: "CERT-001",
    issuedBy: "Madras Institute of Technology",
    issuedDate: new Date("2025-01-10"),
    uploadDate: new Date("2025-01-12"),
    realPercent: 0.95,
    textConsistency: "pass",
    metadataValidation: "pass",
    logoMismatch: "pass",
    digitalSignature: "pass",
    flag: "pass"
  },
  {
    certificateId: "CERT-002",
    issuedBy: "IIT Bombay",
    issuedDate: new Date("2025-02-01"),
    uploadDate: new Date("2025-02-03"),
    realPercent: 0.72,
    textConsistency: "suspicious",
    metadataValidation: "pass",
    logoMismatch: "pass",
    digitalSignature: "fail",
    flag: "suspicious"
  },
  {
    certificateId: "CERT-003",
    issuedBy: "Anna University",
    issuedDate: new Date("2025-02-15"),
    uploadDate: new Date("2025-02-18"),
    realPercent: 0.34,
    textConsistency: "fail",
    metadataValidation: "suspicious",
    logoMismatch: "fail",
    digitalSignature: "suspicious",
    flag: "fail"
  },
  {
    certificateId: "CERT-004",
    issuedBy: "NIT Trichy",
    issuedDate: new Date("2025-03-01"),
    uploadDate: new Date("2025-03-02"),
    realPercent: 0.89,
    textConsistency: "pass",
    metadataValidation: "pass",
    logoMismatch: "suspicious",
    digitalSignature: "pass",
    flag: "suspicious"
  },
  {
    certificateId: "CERT-005",
    issuedBy: "VIT Vellore",
    issuedDate: new Date("2025-03-10"),
    uploadDate: new Date("2025-03-11"),
    realPercent: 0.41,
    textConsistency: "suspicious",
    metadataValidation: "fail",
    logoMismatch: "suspicious",
    digitalSignature: "fail",
    flag: "fail"
  },
  {
    certificateId: "CERT-006",
    issuedBy: "SRM Institute of Science and Technology",
    issuedDate: new Date("2025-04-05"),
    uploadDate: new Date("2025-04-06"),
    realPercent: 0.67,
    textConsistency: "pass",
    metadataValidation: "suspicious",
    logoMismatch: "pass",
    digitalSignature: "pass",
    flag: "suspicious"
  },
  {
    certificateId: "CERT-007",
    issuedBy: "Amrita Vishwa Vidyapeetham",
    issuedDate: new Date("2025-05-01"),
    uploadDate: new Date("2025-05-03"),
    realPercent: 0.12,
    textConsistency: "fail",
    metadataValidation: "fail",
    logoMismatch: "fail",
    digitalSignature: "fail",
    flag: "fail"
  },
  {
    certificateId: "CERT-008",
    issuedBy: "PSG College of Technology",
    issuedDate: new Date("2025-06-01"),
    uploadDate: new Date("2025-06-04"),
    realPercent: 0.83,
    textConsistency: "pass",
    metadataValidation: "pass",
    logoMismatch: "pass",
    digitalSignature: "suspicious",
    flag: "suspicious"
  }
];

module.exports=data;
