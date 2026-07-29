import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('fetch(') || content.includes('fetch (')) {
      // Very naive replacement, but might work if we are careful
      content = content.replace(/fetch\(([`'])\/api\//g, "apiFetch($1/api/");
      // Add import if replaced
      if (content.includes('apiFetch(') && !content.includes('import { apiFetch }')) {
        const importPath = path.relative(path.dirname(filePath), './src/lib/api').replace(/\\/g, '/');
        const finalImportPath = importPath.startsWith('.') ? importPath : `./${importPath}`;
        content = `import { apiFetch } from '${finalImportPath}';\n` + content;
      }
      fs.writeFileSync(filePath, content);
      console.log('Updated', filePath);
    }
  }
});
