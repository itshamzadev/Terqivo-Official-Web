const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// We should serve public/uploads at /uploads
const staticCode = `
  // Serve uploads directory
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadsPath));
`;

if (!code.includes("app.use('/uploads'")) {
  code = code.replace("app.use(\"/api\", apiRoutes);", staticCode + "\n  app.use(\"/api\", apiRoutes);");
  fs.writeFileSync('server.ts', code);
}
