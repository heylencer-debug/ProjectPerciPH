const https = require('https');
const fs = require('fs');
const PAT = 'REDACTED_PAT';
const REPO = 'heylencer-debug/ProjectPerciPH';
const BRANCH = 'main';

async function getSHA(filePath) {
  return new Promise(resolve => {
    const req = https.request({
      hostname: 'api.github.com', path: `/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`, method: 'GET',
      headers: { 'Authorization': `Bearer ${PAT}`, 'User-Agent': 'Brigid/1.0', 'Accept': 'application/vnd.github+json' }
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ try{resolve(JSON.parse(d).sha);}catch{resolve(null);} }); });
    req.on('error', ()=>resolve(null)); req.end();
  });
}

async function pushFile(filePath, localPath, msg) {
  const content = fs.readFileSync(localPath).toString('base64');
  const sha = await getSHA(filePath);
  const body = JSON.stringify({ message: msg, content, branch: BRANCH, ...(sha ? { sha } : {}) });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com', path: `/repos/${REPO}/contents/${filePath}`, method: 'PUT',
      headers: { 'Authorization': `Bearer ${PAT}`, 'User-Agent': 'Brigid/1.0', 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ const r=JSON.parse(d); if(r.commit){console.log(`✅ ${filePath} → ${r.commit.sha.slice(0,7)}`); resolve(r);}else{console.error(`❌ ${filePath}:`,d.slice(0,150)); reject(new Error(d));} }); });
    req.on('error', reject); req.write(body); req.end();
  });
}

module.exports = { pushFile };
if (require.main === module) {
  const [,,fp,lp,msg] = process.argv;
  pushFile(fp, lp, msg||'chore: update').catch(console.error);
}
