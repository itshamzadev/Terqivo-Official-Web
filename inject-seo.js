import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/pages/public');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx') && !f.includes('ContactPage') && !f.includes('HomePage'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already imported
  if (content.includes('import SEO')) continue;

  // 1. Add import after the last import statement
  const importLines = content.split('\n');
  let lastImportIndex = -1;
  for (let i = 0; i < importLines.length; i++) {
    if (importLines[i].startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex !== -1) {
    importLines.splice(lastImportIndex + 1, 0, "import SEO from '../../components/SEO';");
  } else {
    importLines.unshift("import SEO from '../../components/SEO';");
  }

  content = importLines.join('\n');

  // 2. Add <SEO /> after <main className="..."> or <div className="min-h-screen"> etc.
  // We need to find the main return statement.
  const pageName = file.replace('.tsx', '');
  
  // A heuristic to replace `<main className="pt-24 pb-16">` with `<main className="pt-24 pb-16">\n      <SEO title="${pageName} | TERQIVO" />`
  // Actually, we can just look for the first <main> or <div className="..."> right after `return (`
  
  const returnMatch = content.match(/return \(\s*(<[a-zA-Z]+[^>]*>)/);
  if (returnMatch) {
    const originalTag = returnMatch[1];
    let seoTitle = pageName.replace('Page', '');
    if (pageName === 'CeoFounderPage') seoTitle = 'CEO & Founder';
    if (pageName === 'PrivacyPolicyPage') seoTitle = 'Privacy Policy';
    if (pageName === 'TermsPage') seoTitle = 'Terms & Conditions';
    if (pageName.includes('Details')) seoTitle = 'Details';
    
    const replacement = `${originalTag}\n      <SEO title="${seoTitle} | TERQIVO" />`;
    content = content.replace(originalTag, replacement);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
