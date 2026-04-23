const fs = require('fs');

const map = {
  'rgba(155,139,254': 'rgba(58,117,155',
  'rgba(129,101,255': 'rgba(58,117,155',
  'rgba(244,63,94': 'rgba(248,124,113'
};

['src/App.tsx', 'src/components/Chat.tsx', 'src/components/Sidebar.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [k, v] of Object.entries(map)) {
    content = content.split(k).join(v);
  }
  fs.writeFileSync(file, content, 'utf8');
});
