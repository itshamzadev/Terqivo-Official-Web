const fs = require('fs');

function rewriteAdminFile(file, modelName, fields, endpoint) {
  const path = `src/pages/admin/${file}`;
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  // Replace data access
  content = content.replace(/setProducts\(data\)/g, `set${modelName}s(data.data || [])`);
  content = content.replace(/setServices\(data\)/g, `set${modelName}s(data.data || [])`);
  content = content.replace(/setCourses\(data\)/g, `set${modelName}s(data.data || [])`);
  content = content.replace(/setJobs\(data\)/g, `set${modelName}s(data.data || [])`);
  content = content.replace(/setPosts\(data\)/g, `set${modelName}s(data.data || [])`);
  content = content.replace(/setMessages\(data\)/g, `set${modelName}s(data.data || [])`);

  // We should just write a generic React component for each, it's safer.
}
