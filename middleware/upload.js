const multer = require('multer');
const path = require('path');

const tempDir = path.join(__dirname, '../', 'temp')

const multerConfig = multer.diskStorage({
    distination: tempDir,
})

const upload = multer({
    storage: multerConfig
})

module.exports = upload