const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
};

const map = {
  '#1c133a': '#1a273b',
  '#1b103e': '#1a273b',
  '#2d2252': '#111b2b',
  '#645c7e': '#53637a',
  '#8b87a1': '#8999af',
  '#ecebf2': '#e2e8f0',
  '#f0eff5': '#f1f5f9',
  '#faf9fc': '#f8fafc',
  '#f8f9fc': '#f8fafc',
  '#8165ff': '#3A759B',
  '#9b8bfe': '#609BBB',
  '#6b82ff': '#3A759B',
  '#a274ff': '#F87C71',
  '#6bc3ff': '#F87C71',
  '#6b52ff': '#3A759B',
  '#aba2ff': '#F87C71',
  '#f2f0ff': '#f0f7fb',
  '#a99df9': '#F87C71',
  'rose-': 'orange-',
  '#e0dcf8': '#e2e8f0',
  '#e3dfff': '#e2e8f0',
  '#dce2ff': '#e2e8f0',
  '#f1ebff': '#fff0f0',
  '#dbe2ff': '#e2e8f0',
  '#dfddf0': '#e0ebf3'
};

const files = walkSync(path.join(__dirname, 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, val] of Object.entries(map)) {
    content = content.split(key).join(val);
  }
  // Change orange-500 back to exact coral for avatar etc
  content = content.replace(/bg-orange-500/g, 'bg-[#F87C71]');
  content = content.replace(/text-orange-500/g, 'text-[#F87C71]');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done!');
