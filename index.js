const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = 'Bel_admin31';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let routes = [];
const adminTokens = new Set();

function token() {
  return crypto.randomBytes(32).toString('hex');
}

app.post('/api/admin/login', (req,res)=>{
  if(req.body.password!==ADMIN_PASSWORD)
    return res.status(401).json({error:'bad'});
  const t=token();
  adminTokens.add(t);
  res.json({token:t});
});

function admin(req,res,next){
  if(!adminTokens.has(req.headers['x-admin-token']))
    return res.status(403).end();
  next();
}

app.get('/api/routes',(req,res)=>res.json(routes));

app.post('/api/routes',admin,(req,res)=>{
  const r={id:crypto.randomUUID(),path:req.body.path};
  routes.push(r);
  res.json(r);
});

app.put('/api/routes/:id',admin,(req,res)=>{
  routes=routes.map(r=>r.id===req.params.id?{...r,path:req.body.path}:r);
  res.json({ok:true});
});

app.delete('/api/routes/:id',admin,(req,res)=>{
  routes=routes.filter(r=>r.id!==req.params.id);
  res.json({ok:true});
});

app.listen(PORT,()=>console.log('OK',PORT));
