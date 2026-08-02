const fs = require('fs');
const file = 'server/routes/products.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace("router.get('/', async (req, res) => {", `router.get('/', async (req, res) => {
  if (require('mongoose').connection.readyState !== 1) {
    return res.json({ success: true, data: [] });
  }`);

fs.writeFileSync(file, code);
