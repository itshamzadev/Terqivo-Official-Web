const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('AuthProvider')) {
  content = content.replace(
    "import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';",
    "import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport { AuthProvider } from './components/auth/AuthContext';"
  );
  
  content = content.replace(
    "<Router>",
    "<AuthProvider>\n      <Router>"
  );
  
  content = content.replace(
    "</Router>",
    "</Router>\n      </AuthProvider>"
  );
  
  fs.writeFileSync(path, content, 'utf8');
  console.log("App.tsx updated");
}
