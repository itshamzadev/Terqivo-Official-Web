const fs = require('fs');
let code = fs.readFileSync('server/routes/products.ts', 'utf8');

const importMongoose = "import mongoose from 'mongoose';\n";

if (!code.includes("import mongoose")) {
  code = importMongoose + code;
}

code = code.replace(
  "router.get('/', async (req, res) => {",
  "router.get('/', async (req, res) => {\n  if (mongoose.connection.readyState !== 1) return res.json({ success: true, data: [] });"
);

code = code.replace(
  "router.get('/:idOrSlug', async (req, res) => {",
  "router.get('/:idOrSlug', async (req, res) => {\n  if (mongoose.connection.readyState !== 1) return res.status(404).json({ success: false, message: 'DB Disconnected' });"
);

fs.writeFileSync('server/routes/products.ts', code);
