// multer.ts
// files.ts

import multer from "multer"

// can disk or memory
// we choees memory
const storage = multer.memoryStorage()

export const upload = multer({ storage }) // storage: storage
