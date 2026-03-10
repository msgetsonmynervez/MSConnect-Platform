import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TOTAL = 9

type Answers = {
  q1: string
  q2: string[] | 'skipped'
  q3: string[] | 'skipped'
  q4: string[]
  q5: string[] | 'skipped'
  q6: string
  q7: string
  q8: string
  q9: string | 'skipped'
}

const initialAnswers: Answers = {
  q1: '', q2: [], q3: [], q4: [], q5: [], q6: '', q7: '', q8: '', q9: '',
}

const surveyStyles = `
  .sv-wrap { max-width:660px; margin:0 auto; padding:48px 24px 100px; position:relative; z-index:1; font-family:inherit; }
  .sv-glow { position:fixed; top:-200px; left:50%; transform:translateX(-50%); width:800px; height:500px; background:radial-gradient(ellipse,rgba(92,122,107,0.1) 0%,transparent 70%); pointer-events:none; z-index:0; }
  .sv-eyebrow { display:inline-flex; align-items:center; gap:8px; background:var(--sage-pale); border:1px solid rgba(92,122,107,0.3); border-radius:100px; padding:6px 14px; margin-bottom:24px; }
  .sv-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:var(--sage); animation:sv-pulse 2s ease infinite; }
  .sv-eyebrow span { font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--sage); }
  @keyframes sv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .sv-h1 { font-family:Georgia,serif; font-size:clamp(28px,5.5vw,42px); font-weight:300; line-height:1.15; color:var(--navy); margin-bottom:18px; }
  .sv-h1 em { font-style:italic; color:var(--sage); }
  .sv-intro { font-size:15px; color:var(--text-soft); line-height:1.75; max-width:500px; margin-bottom:24px; }
  .sv-meta { display:flex; gap:24px; margin-bottom:40px; flex-wrap:wrap; }
  .sv-meta-pill { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-soft); }
  .sv-prog-wrap { margin-bottom:32px; }
  .sv-prog-meta { display:flex; justify-content:space-between; margin-bottom:10px; }
  .sv-prog-label { font-size:12px; color:var(--text-soft); letter-spacing:0.06em; }
  .sv-prog-frac { font-size:13px; color:var(--sage); font-weight:600; }
  .sv-prog-track { height:3px; background:#E0E0E0; border-radius:2px; overflow:hidden; }
  .sv-prog-fill { height:100%; background:linear-gradient(90deg,var(--sage),var(--sage-light)); border-radius:2px; transition:width 0.5s cubic-bezier(0.4,0,0.2,1); }
  .sv-card { background:var(--cream); border:1px solid #E0E0E0; border-radius:20px; padding:36px; margin-bottom:16px; position:relative; overflow:hidden; animation:sv-fadeUp 0.4s ease both; }
  .sv-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(92,122,107,0.2),transparent); }
  @keyframes sv-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .sv-q-num { font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--sage); margin-bottom:10px; opacity:0.8; }
  .sv-q-text { font-family:Georgia,serif; font-size:clamp(16px,3vw,20px); font-weight:300; line-height:1.45; color:var(--navy); margin-bottom:8px; }
  .sv-q-sub { font-size:13px; color:var(--text-soft); margin-bottom:24px; line-height:1.5; }
  .sv-options { display:flex; flex-direction:column; gap:9px; }
  .sv-option { display:flex; align-items:center; gap:14px; padding:13px 16px; border:1px solid #E0E0E0; border-radius:12px; cursor:pointer; transition:all 0.18s ease; background:white; font-size:14px; color:var(--text-soft); width:100%; text-align:left; }
  .sv-option:hover,.sv-option.sel { border-color:var(--sage); background:var(--sage-pale); color:var(--navy); }
  .sv-option.sel { font-weight:500; }
  .sv-opt-dot { width:16px; height:16px; border-radius:50%; border:1.5px solid #C0C0C0; flex-shrink:0; transition:all 0.18s; display:flex; align-items:center; justify-content:center; }
  .sv-option.sel .sv-opt-dot { border-color:var(--sage); background:var(--sage); }
  .sv-option.sel .sv-opt-dot::after { content:''; width:5px; height:5px; border-radius:50%; background:white; }
  .sv-multi-grid { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
  .sv-multi-opt { padding:13px 14px; border:1px solid #E0E0E0; border-radius:12px; cursor:pointer; background:white; font-size:13px; color:var(--text-soft); text-align:center; line-height:1.4; transition:all 0.18s ease; }
  .sv-multi-opt:hover,.sv-multi-opt.sel { border-color:var(--sage); background:var(--sage-pale); color:var(--sage); }
  .sv-multi-opt.sel { font-weight:500; }
  .sv-rank-item { display:flex; align-items:center; gap:14px; padding:13px 16px; border:1px solid #E0E0E0; border-radius:12px; background:white; cursor:pointer; transition:all 0.18s ease; font-size:14px; color:var(--text-soft); width:100%; text-align:left; }
  .sv-rank-item:hover,.sv-rank-item.sel { border-color:var(--terracotta); background:#FDF5F0; color:var(--terracotta); }
  .sv-rank-item.sel { font-weight:500; }
  .sv-rank-badge { width:24px; height:24px; border-radius:50%; border:1.5px solid #C0C0C0; font-size:11px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--text-soft); transition:all 0.18s; }
  .sv-rank-item.sel .sv-rank-badge { border-color:var(--terracotta); background:var(--terracotta); color:white; }
  .sv-scale-btns { display:flex; gap:8px; }
  .sv-scale-btn { flex:1; padding:14px 4px; border:1px solid #E0E0E0; border-radius:10px; background:white; color:var(--text-soft); font-size:14px; font-weight:500; cursor:pointer; transition:all 0.18s ease; }
  .sv-scale-btn:hover,.sv-scale-btn.sel { border-color:var(--sage); background:var(--sage); color:white; }
  .sv-scale-labels { display:flex; justify-content:space-between; margin-top:10px; font-size:11px; color:var(--text-soft); }
  .sv-textarea { width:100%; padding:16px; border:1px solid #E0E0E0; border-radius:12px; background:white; color:var(--navy); font-family:inherit; font-size:14px; line-height:1.65; resize:vertical; min-height:130px; transition:border-color 0.2s; outline:none; box-sizing:border-box; }
  .sv-textarea:focus { border-color:var(--sage); }
  .sv-hint { font-size:11px; color:var(--text-soft); margin-top:12px; text-align:center; letter-spacing:0.04em; }
  .sv-nav { display:flex; gap:10px; align-items:center; margin-top:28px; }
  .sv-btn-back { padding:12px 20px; border:1px solid #E0E0E0; border-radius:10px; background:transparent; color:var(--text-soft); font-family:inherit; font-size:14px; cursor:pointer; transition:all 0.18s; flex-shrink:0; }
  .sv-btn-back:hover { border-color:var(--sage); color:var(--navy); }
  .sv-btn-back:disabled { opacity:0.25; cursor:not-allowed; }
  .sv-btn-next { flex:1; padding:14px 28px; border:none; border-radius:10px; background:var(--sage); color:white; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; transition:all 0.18s; }
  .sv-btn-next:hover { background:var(--navy); }
  .sv-btn-next:disabled { opacity:0.3; cursor:not-allowed; }
  .sv-skip-wrap { text-align:center; margin-top:12px; }
  .sv-skip-btn { background:none; border:none; color:var(--text-soft); font-family:inherit; font-size:12px; cursor:pointer; text-decoration:underline; text-underline-offset:3px; }
  .sv-skip-btn:hover { color:var(--navy); }
  .sv-error { background:#​​​​​​​​​​​​​​​​
