const fs = require('fs');
let code = fs.readFileSync('server/routes/upload.ts', 'utf8');

const newPost = `
router.post('/', authenticate, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ success: false, message: 'Upload failed: ' + err.message });
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = \`/uploads/\${req.file.filename}\`;
    res.json({ success: true, data: { url: fileUrl } });
  } catch (error: any) {
    console.error("Upload route error:", error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});
`;

code = code.replace(/router\.post\('\/', authenticate, upload\.single\('file'\)[\s\S]*\}\);/, newPost.trim());
fs.writeFileSync('server/routes/upload.ts', code);
