(() => {
  'use strict';

  const SAVE_KEY = 'orbitDartsSave_v1';
  const TAU = Math.PI * 2;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (n) => Math.floor(n).toLocaleString();
  const dayKey = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const rand = (a, b) => a + Math.random() * (b - a);
  const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const RARITIES = {
    Common:    { weight: 42, color: '#b8c4d8', glow: 'rgba(184,196,216,.25)', shards: 2 },
    Uncommon:  { weight: 25, color: '#67efad', glow: 'rgba(103,239,173,.28)', shards: 4 },
    Rare:      { weight: 14, color: '#5bc6ff', glow: 'rgba(91,198,255,.30)', shards: 7 },
    Epic:      { weight: 8,  color: '#b378ff', glow: 'rgba(179,120,255,.32)', shards: 12 },
    Legendary: { weight: 5, color: '#ffd56a', glow: 'rgba(255,213,106,.34)', shards: 20 },
    Mythical:  { weight: 3, color: '#ff6fa1', glow: 'rgba(255,111,161,.36)', shards: 35 },
    Divine:    { weight: 1, color: '#fff5bd', glow: 'rgba(255,245,189,.48)', shards: 60 }
  };
  const RARITY_ORDER = Object.keys(RARITIES);

  const EFFECTS = [
    {id:'starter',name:'Starter Trail',rarity:'Common',color:'#dce7ff',accent:'#7d91b7',desc:'A clean steel dart with a faint vapor trail.',boost:'No bonus',stat:{}},
    {id:'icewire',name:'Icewire',rarity:'Common',color:'#81e8ff',accent:'#b8f5ff',desc:'Cold cyan tracer lines follow each dart.',boost:'+6% shot Coins',stat:{coins:.06}},
    {id:'emberline',name:'Emberline',rarity:'Common',color:'#ff9a68',accent:'#ffd0a6',desc:'A warm streak and sharp impact sparks.',boost:'+4% combo gain',stat:{combo:.04}},
    {id:'mossbolt',name:'Mossbolt',rarity:'Uncommon',color:'#71efa4',accent:'#c5ffd6',desc:'Leaf-green dart fins and soft motes.',boost:'+10% shot Coins',stat:{coins:.10}},
    {id:'voltglass',name:'Voltglass',rarity:'Uncommon',color:'#79a7ff',accent:'#d6e1ff',desc:'Electric glass body with branching arcs.',boost:'+6% slow effect',stat:{slow:.06}},
    {id:'rosepulse',name:'Rose Pulse',rarity:'Uncommon',color:'#ff83c7',accent:'#ffd1eb',desc:'A bright pulse blooms on successful hits.',boost:'+8% mission rewards',stat:{mission:.08}},
    {id:'tidal',name:'Tidal Vector',rarity:'Rare',color:'#3fdcff',accent:'#5d7cff',desc:'Two-tone wake with circular impact ripples.',boost:'+16% shot Coins',stat:{coins:.16}},
    {id:'neonspine',name:'Neon Spine',rarity:'Rare',color:'#b0ff67',accent:'#4beaff',desc:'High-contrast dart edge and long luminous spine.',boost:'+9% combo gain',stat:{combo:.09}},
    {id:'blackstar',name:'Blackstar',rarity:'Rare',color:'#9d91ff',accent:'#e7e2ff',desc:'Dark core surrounded by a violet halo.',boost:'+0.8% Prism chance',stat:{prism:.008}},
    {id:'prismflare',name:'Prism Flare',rarity:'Epic',color:'#f68cff',accent:'#6ef4ff',desc:'Color-shifting shard burst at impact.',boost:'+25% shot Coins',stat:{coins:.25}},
    {id:'afterimage',name:'Afterimage',rarity:'Epic',color:'#65ffdd',accent:'#896eff',desc:'A delayed ghost dart follows every shot.',boost:'+13% slow effect',stat:{slow:.13}},
    {id:'arcforge',name:'Arcforge',rarity:'Epic',color:'#ffb65d',accent:'#79a1ff',desc:'Forged orange tip with electric blue exhaust.',boost:'12% collision shield',stat:{shield:.12}},
    {id:'sunbreaker',name:'Sunbreaker',rarity:'Legendary',color:'#ffd568',accent:'#fff5c7',desc:'Solar particles fan outward in a radiant crown.',boost:'+40% boss rewards',stat:{boss:.40}},
    {id:'voidroyal',name:'Void Royal',rarity:'Legendary',color:'#c889ff',accent:'#5ee8ff',desc:'Royal-violet trail with orbiting micro-shards.',boost:'+35% shot Coins',stat:{coins:.35}},
    {id:'timeglass',name:'Timeglass',rarity:'Legendary',color:'#7fffea',accent:'#fbffbe',desc:'Clocklike rings briefly appear around the target.',boost:'+19% slow effect',stat:{slow:.19}},
    {id:'novaheart',name:'Nova Heart',rarity:'Mythical',color:'#ff6d9f',accent:'#ffd27d',desc:'A dense star core erupts into layered shock rings.',boost:'+52% shot Coins',stat:{coins:.52}},
    {id:'riftneedle',name:'Rift Needle',rarity:'Mythical',color:'#8f7bff',accent:'#ff75db',desc:'A split trail tears two glowing seams through space.',boost:'+2.2% Prism chance',stat:{prism:.022}},
    {id:'crownvector',name:'Crown Vector',rarity:'Mythical',color:'#ffe374',accent:'#8effdf',desc:'Gold dart with a rotating crown at the impact point.',boost:'+24% combo and +18% missions',stat:{combo:.24,mission:.18}},
    {id:'astraljudgment',name:'Astral Judgment',rarity:'Divine',color:'#fff6c9',accent:'#85eeff',desc:'White-gold dart, layered aurora trail, and a starburst impact seal.',boost:'+75% Coins, +3% Prisms',stat:{coins:.75,prism:.03}},
    {id:'seraphcore',name:'Seraph Core',rarity:'Divine',color:'#fffbdc',accent:'#ff9af0',desc:'A luminous core surrounded by six rotating energy fins.',boost:'25% shield, +30% boss',stat:{shield:.25,boss:.30}}
  ];

  const UPGRADES = [
    {id:'coinForge',name:'Coin Forge',max:20,base:180,scale:1.55,desc:'Increases Coins from every successful shot.',effect:(l)=>`+${l*8}% shot Coins`},
    {id:'steadyCore',name:'Steady Core',max:15,base:260,scale:1.62,desc:'Reduces target rotation speed without removing challenge.',effect:(l)=>`${l*2}% target slowdown`},
    {id:'lifeRack',name:'Life Rack',max:5,base:620,scale:2.05,desc:'Adds another mistake you can survive before a stage reset.',effect:(l)=>`+${l} max lives`},
    {id:'comboAmp',name:'Combo Amplifier',max:15,base:310,scale:1.68,desc:'Makes clean-hit streaks grow more valuable.',effect:(l)=>`+${l*5}% combo growth`},
    {id:'prismScanner',name:'Prism Scanner',max:12,base:480,scale:1.72,desc:'Adds a chance for successful shots to discover a Prism.',effect:(l)=>`+${(l*.18).toFixed(2)}% Prism chance`},
    {id:'shieldMatrix',name:'Shield Matrix',max:10,base:720,scale:1.74,desc:'Occasionally cancels a dart collision entirely.',effect:(l)=>`${l*2.5}% collision shield`},
    {id:'missionDrive',name:'Mission Drive',max:12,base:410,scale:1.69,desc:'Boosts the Coin payout from stage missions.',effect:(l)=>`+${l*10}% mission payout`},
    {id:'bossLedger',name:'Boss Ledger',max:10,base:900,scale:1.78,desc:'Boss stages pay substantially more Coins.',effect:(l)=>`+${l*12}% boss Coins`},
    {id:'recoveryBank',name:'Recovery Bank',max:8,base:820,scale:1.82,desc:'Keep part of your combo after a collision.',effect:(l)=>`${l*8}% combo preserved`}
  ];

  const PASSES = [
    {id:'tripleRoll',name:'Triple Roll License',cost:1500,desc:'Unlocks the permanent three-at-once effect roll button. Cost is still 750 Coins per roll set.',perk:'Roll three effects at once'},
    {id:'prismVault',name:'Prism Vault',cost:2200,desc:'Every Prism reward from gameplay and daily arcade is increased by 25%.',perk:'+25% Prism rewards'},
    {id:'bossContract',name:'Boss Contract',cost:3000,desc:'Boss completion Coin rewards are doubled after all other bonuses.',perk:'2x boss completion Coins'},
    {id:'arcadeExpress',name:'Arcade Express',cost:3600,desc:'Quick Claim and daily refresh Prism costs are cut in half forever.',perk:'50% cheaper daily shortcuts'},
    {id:'luckyCore',name:'Lucky Core',cost:5000,desc:'Effect rolls shift part of Common and Uncommon odds toward Epic and above.',perk:'Permanent effect-roll luck'},
    {id:'secondWind',name:'Second Wind',cost:6500,desc:'Once per stage, the first collision at one life remaining is automatically blocked.',perk:'One emergency save each stage'}
  ];

  const DEFAULT_SAVE = {
    coins: 900,
    prisms: 45,
    accountLevel: 1,
    xp: 0,
    bestStage: 1,
    bestCombo: 1,
    totalShots: 0,
    totalHits: 0,
    shards: 0,
    pityEpic: 0,
    pityLegendary: 0,
    ownedEffects: ['starter'],
    equippedEffect: 'starter',
    upgrades: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),
    passes: [],
    daily: {wheel:'',scratch:'',memory:'',wheelBonus:0,scratchBonus:0,memoryBonus:0},
    settings: {volume:100,shake:true,particles:true,reducedMotion:false}
  };

  let save = loadSave();
  let currentView = 'play';
  let paused = false;
  let audioCtx = null, masterGain = null, compressor = null;

  function deepMerge(base, patch) {
    const out = structuredClone(base);
    for (const [k,v] of Object.entries(patch || {})) {
      if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) Object.assign(out[k], v);
      else out[k] = v;
    }
    return out;
  }
  function loadSave() {
    try { return deepMerge(DEFAULT_SAVE, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); }
    catch { return structuredClone(DEFAULT_SAVE); }
  }
  function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    refreshTopbar();
  }
  function hasPass(id) { return save.passes.includes(id); }
  function getEffect(id=save.equippedEffect) { return EFFECTS.find(e => e.id === id) || EFFECTS[0]; }
  function owned(id) { return save.ownedEffects.includes(id); }
  function upgradeLevel(id) { return save.upgrades[id] || 0; }
  function passAdjustedCost(cost) { return Math.ceil(cost * (hasPass('arcadeExpress') ? .5 : 1)); }
  function addPrisms(amount) {
    if (amount <= 0) return;
    save.prisms += Math.max(1, Math.round(amount * (hasPass('prismVault') ? 1.25 : 1)));
  }

  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 22;
    compressor.ratio.value = 16;
    compressor.attack.value = .003;
    compressor.release.value = .2;
    masterGain.connect(compressor).connect(audioCtx.destination);
    updateAudioVolume();
  }
  function updateAudioVolume() {
    if (!masterGain) return;
    const pct = save.settings.volume;
    const gain = pct <= 100 ? pct / 100 : 1 + Math.log10(pct / 100) * 0.65;
    masterGain.gain.setTargetAtTime(clamp(gain, 0, 2.5), audioCtx.currentTime, .03);
  }
  function tone(freq=440, duration=.07, type='sine', volume=.12, slide=0) {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide), audioCtx.currentTime+duration);
    g.gain.value = 0; g.gain.linearRampToValueAtTime(volume, audioCtx.currentTime+.008); g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
    o.connect(g).connect(masterGain); o.start(); o.stop(audioCtx.currentTime+duration+.02);
  }
  function sfx(kind) {
    if (kind==='shoot') tone(260,.06,'triangle',.07,170);
    if (kind==='hit') {tone(580,.08,'sine',.08,130);setTimeout(()=>tone(820,.05,'triangle',.04),35)}
    if (kind==='bad') {tone(125,.14,'sawtooth',.08,-40)}
    if (kind==='reward') {tone(440,.10,'sine',.06,220);setTimeout(()=>tone(760,.13,'triangle',.06,300),80)}
    if (kind==='rare') {tone(520,.12,'triangle',.06,300);setTimeout(()=>tone(920,.17,'sine',.07,400),90)}
  }

  function toast(title, text='') {
    const el = document.createElement('div'); el.className='toast';
    el.innerHTML = `<b>${title}</b><span>${text}</span>`;
    $('#toastStack').appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }
  function modal(html) { $('#modalContent').innerHTML=html; $('#modal').classList.remove('hidden'); }
  function closeModal(){ $('#modal').classList.add('hidden'); }

  function refreshTopbar() {
    $('#coinsText').textContent = fmt(save.coins);
    $('#prismsText').textContent = fmt(save.prisms);
    $('#accountLevelText').textContent = save.accountLevel;
  }
  function setView(name) {
    currentView = name;
    $$('.view').forEach(v=>v.classList.toggle('active', v.id===`view-${name}`));
    if (name==='upgrades') renderUpgrades();
    if (name==='effects') renderEffects();
    if (name==='passes') renderPasses();
    if (name==='daily') { renderDailyStatus(); drawWheel(wheelRotation); }
    if (name==='settings') renderSettings();
    window.scrollTo({top:0,behavior:save.settings.reducedMotion?'auto':'smooth'});
  }

  // ---------------- Core game ----------------
  const canvas = $('#gameCanvas');
  const ctx = canvas.getContext('2d');
  const W=840,H=840,CX=420,CY=355,R=142;
  let stage = 1, required = 7, hitsThisStage = 0, lives = 3, combo = 1;
  let rotation = 0, speed = .0065, direction = 1, attached = [], flying = null, particles = [];
  let stageStart = performance.now(), lastTime = performance.now(), secondWindUsed = false, transitionLock=false;
  let mission = null, stageMisses = 0, stageHits = 0;
  const patterns = [
    {name:'Classic Orbit',desc:'Stable speed and direction.'},
    {name:'Reverse Pulse',desc:'Direction flips during the stage.'},
    {name:'Surge Ring',desc:'Speed rises and falls in waves.'},
    {name:'Stutter Core',desc:'Short acceleration bursts break the rhythm.'},
    {name:'Heavy Orbit',desc:'Slower, tighter spacing and larger dart heads.'}
  ];
  const bosses = ['Split Core','Velocity Crown','Mirror Reactor','Pulse Tyrant','Prism Engine'];

  function resetStage(full=false) {
    required = 6 + Math.min(11, Math.floor(stage * .8));
    if (stage % 5 === 0) required += 3;
    hitsThisStage = 0; stageMisses=0; stageHits=0; attached=[]; flying=null; particles=[];
    lives = 3 + upgradeLevel('lifeRack'); combo = full ? 1 : Math.max(1,combo*.5);
    rotation=rand(0,TAU); direction=Math.random()<.5?-1:1; secondWindUsed=false; transitionLock=false;
    speed = .0058 + Math.min(.009, stage*.00018);
    stageStart = performance.now();
    mission = createMission();
    updateHUD();
  }
  function createMission() {
    const options = [
      {type:'hits',target:Math.min(required, 6+Math.floor(stage/3)),text:n=>`Land ${n} clean darts`},
      {type:'combo',target:1.8+Math.min(2.2,stage*.05),text:n=>`Reach x${n.toFixed(1)} combo`},
      {type:'nomiss',target:required,text:()=>`Clear with 1 miss or less`},
      {type:'speed',target:Math.max(12,26-stage*.25),text:n=>`Clear under ${Math.round(n)} seconds`}
    ];
    return choose(options);
  }
  function effectiveSlow() {
    return clamp(upgradeLevel('steadyCore')*.02 + (getEffect().stat.slow||0),0,.60);
  }
  function effectiveShield() {
    return clamp(upgradeLevel('shieldMatrix')*.025 + (getEffect().stat.shield||0),0,.65);
  }
  function effectiveCoinBonus() { return upgradeLevel('coinForge')*.08 + (getEffect().stat.coins||0); }
  function bossBonus() { return upgradeLevel('bossLedger')*.12 + (getEffect().stat.boss||0); }
  function missionBonus() { return upgradeLevel('missionDrive')*.10 + (getEffect().stat.mission||0); }
  function prismChance() { return upgradeLevel('prismScanner')*.0018 + (getEffect().stat.prism||0); }
  function comboGrowth() { return 1 + upgradeLevel('comboAmp')*.05 + (getEffect().stat.combo||0); }

  function currentPatternIndex() { return (stage-1)%patterns.length; }
  function isBoss() { return stage % 5 === 0; }
  function angularDistance(a,b){ let d=Math.abs((a-b)%TAU); return Math.min(d,TAU-d); }

  function shoot() {
    if (paused || transitionLock || currentView!=='play' || flying) return;
    initAudio(); sfx('shoot'); save.totalShots++;
    flying = {x:CX,y:H-83,vy:-22,trail:[]};
    saveGame();
  }

  function handleImpact() {
    const hitWorldAngle = Math.PI/2;
    const localAngle = hitWorldAngle - rotation;
    const collisionDistance = currentPatternIndex()===4 ? .22 : .18;
    const collided = attached.some(d => angularDistance(d.angle,localAngle) < collisionDistance);
    if (collided) return failShot();
    attached.push({angle:localAngle, effect:getEffect().id, len:82+rand(-5,8)});
    hitsThisStage++; stageHits++; save.totalHits++;
    combo = Math.min(9.99, combo + .095*comboGrowth()); save.bestCombo=Math.max(save.bestCombo,combo);
    const base = 18 + stage*2.4;
    const earned = Math.round(base * combo * (1+effectiveCoinBonus()));
    save.coins += earned;
    if (Math.random()<prismChance()) { addPrisms(1); toast('Prism Found','A successful shot uncovered 1 Prism.'); }
    addXP(8+stage);
    spawnImpact(CX,CY+R,getEffect().color,18);
    sfx('hit');
    flying=null;
    if (hitsThisStage>=required) completeStage();
    updateHUD(); saveGame();
  }

  function failShot() {
    flying=null; stageMisses++;
    const preserve = upgradeLevel('recoveryBank')*.08;
    const savedByShield = Math.random()<effectiveShield();
    const emergency = hasPass('secondWind') && lives<=1 && !secondWindUsed;
    if (savedByShield || emergency) {
      if (emergency) secondWindUsed=true;
      toast(emergency?'Second Wind':'Shield Matrix','The collision was blocked.');
      spawnImpact(CX,CY+R,'#78ffe0',24); sfx('reward');
      return;
    }
    lives--; combo = Math.max(1, 1 + (combo-1)*preserve);
    spawnImpact(CX,CY+R,'#ff6f8f',28); sfx('bad'); screenShake();
    if (lives<=0) {
      transitionLock=true;
      showRunBanner('STAGE FAILED');
      setTimeout(()=>{ hideRunBanner(); resetStage(true); },1100);
    }
    updateHUD(); saveGame();
  }

  function missionCompleted() {
    if (!mission) return false;
    if (mission.type==='hits') return stageHits>=mission.target;
    if (mission.type==='combo') return combo>=mission.target;
    if (mission.type==='nomiss') return stageMisses<=1 && hitsThisStage>=required;
    if (mission.type==='speed') return hitsThisStage>=required && (performance.now()-stageStart)/1000 <= mission.target;
    return false;
  }

  function completeStage() {
    transitionLock=true;
    const boss = isBoss();
    let clearCoins = Math.round((120+stage*28) * (boss ? (2.2*(1+bossBonus())) : 1));
    if (boss && hasPass('bossContract')) clearCoins*=2;
    save.coins += clearCoins;
    let missionCoins=0;
    if (missionCompleted()) { missionCoins=Math.round((100+stage*15)*(1+missionBonus())); save.coins+=missionCoins; }
    if (boss) { addPrisms(5+Math.floor(stage/10)); sfx('rare'); } else sfx('reward');
    addXP(50+stage*8+(boss?80:0));
    save.bestStage=Math.max(save.bestStage,stage+1);
    const oldStage=stage; stage++;
    showRunBanner(boss ? `BOSS ${oldStage} CLEARED` : `STAGE ${oldStage} CLEARED`);
    toast(`+${fmt(clearCoins)} Coins`, missionCoins?`Mission complete: +${fmt(missionCoins)} Coins`:'Stage reward collected.');
    setTimeout(()=>{ hideRunBanner(); resetStage(false); },1000);
    saveGame();
  }

  function addXP(amount) {
    save.xp += amount;
    let need = 180 + save.accountLevel*55;
    while(save.xp>=need){ save.xp-=need; save.accountLevel++; save.coins += 250+save.accountLevel*40; if(save.accountLevel%5===0)addPrisms(8); toast(`Account Level ${save.accountLevel}`,'Level reward added to your wallet.'); need=180+save.accountLevel*55; }
  }
  function showRunBanner(t){ $('#runBanner').textContent=t; $('#runBanner').classList.remove('hidden'); }
  function hideRunBanner(){ $('#runBanner').classList.add('hidden'); }
  function screenShake() {
    if (!save.settings.shake) return;
    canvas.animate([{transform:'translate(0)'},{transform:'translate(-7px,4px)'},{transform:'translate(5px,-3px)'},{transform:'translate(0)'}],{duration:170});
  }
  function spawnImpact(x,y,color,count=16){
    if(!save.settings.particles)return;
    for(let i=0;i<count;i++) particles.push({x,y,vx:rand(-4.5,4.5),vy:rand(-4.5,3),life:rand(20,42),max:42,color,size:rand(2,5)});
  }

  function updateHUD(){
    $('#stageText').textContent=stage; $('#stageProgress').style.width=`${(hitsThisStage/required)*100}%`;
    $('#comboText').textContent=`x${combo.toFixed(2)}`; $('#bestComboText').textContent=`x${save.bestCombo.toFixed(2)}`;
    $('#shotsText').textContent=fmt(save.totalShots); $('#livesText').textContent=lives;
    const e=getEffect(); $('#equippedName').textContent=e.name; $('#equippedBoost').textContent=e.boost; $('#equippedSwatch').style.background=`linear-gradient(180deg,${e.accent},${e.color})`;
    $('#patternName').textContent=isBoss()?`${bosses[(stage/5-1)%bosses.length]} Boss`:patterns[currentPatternIndex()].name;
    $('#missionText').textContent=mission?mission.text(mission.target):'Preparing mission';
    const nextBoss=stage%5===0?stage:stage+(5-stage%5); $('#bossStageText').textContent=`Stage ${nextBoss}`; $('#bossDescription').textContent=`${bosses[(nextBoss/5-1)%bosses.length]} changes the rhythm and pays a Prism bonus.`;
  }

  function gameLoop(t) {
    const dt=clamp((t-lastTime)/16.67,.25,2.2); lastTime=t;
    if(!paused && !transitionLock){
      let modifier=1;
      const p=currentPatternIndex();
      if(p===1 && Math.floor((t-stageStart)/2400)%2===1) modifier=-1;
      if(p===2) modifier=.65 + .65*(.5+.5*Math.sin(t/620));
      if(p===3) modifier=(Math.floor(t/850)%4===0)?2.1:.82;
      if(isBoss()) modifier*=1.12 + .32*Math.sin(t/470);
      rotation += speed*(1-effectiveSlow())*direction*modifier*dt;
      if(flying){
        flying.trail.push({x:flying.x,y:flying.y,life:18}); if(flying.trail.length>20)flying.trail.shift();
        flying.y += flying.vy*dt;
        if(flying.y <= CY+R+18) handleImpact();
      }
      particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.98;p.vy*=.98;p.life-=dt}); particles=particles.filter(p=>p.life>0);
    }
    drawGame(t);
    requestAnimationFrame(gameLoop);
  }

  function roundRect(c,x,y,w,h,r,fill,stroke){ c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.stroke()} }
  function drawGame(t){
    ctx.clearRect(0,0,W,H);
    const bg=ctx.createRadialGradient(CX,CY,40,CX,CY,410);bg.addColorStop(0,'rgba(49,74,135,.16)');bg.addColorStop(.5,'rgba(31,48,91,.06)');bg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    ctx.save();ctx.translate(CX,CY);
    for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,0,R+40+i*26,0,TAU);ctx.strokeStyle=`rgba(118,151,218,${.055-i*.008})`;ctx.lineWidth=1;ctx.stroke()}
    if(isBoss()){ctx.rotate(-rotation*.32);ctx.setLineDash([8,14]);ctx.beginPath();ctx.arc(0,0,R+72,0,TAU);ctx.strokeStyle='rgba(255,111,143,.35)';ctx.lineWidth=3;ctx.stroke();ctx.setLineDash([])}
    ctx.restore();
    drawTarget(t);
    attached.forEach(d=>drawAttachedDart(d));
    drawShooter();
    if(flying) drawFlyingDart(flying);
    particles.forEach(p=>{ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,TAU);ctx.fill()});ctx.globalAlpha=1;
    ctx.fillStyle='rgba(191,205,236,.55)';ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillText(`${hitsThisStage} / ${required} DARTS LOCKED`,CX,36);
  }
  function drawTarget(t){
    ctx.save();ctx.translate(CX,CY);ctx.rotate(rotation);
    const boss=isBoss();
    let g=ctx.createRadialGradient(-38,-50,15,0,0,R+18);g.addColorStop(0,boss?'#ffb0cc':'#a7f1ff');g.addColorStop(.2,boss?'#7c3b6a':'#3a5c93');g.addColorStop(.65,boss?'#301b47':'#182846');g.addColorStop(1,'#0a1020');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();
    ctx.strokeStyle=boss?'rgba(255,129,178,.75)':'rgba(123,221,255,.45)';ctx.lineWidth=4;ctx.stroke();
    for(let i=0;i<12;i++){const a=i*TAU/12;ctx.beginPath();ctx.moveTo(Math.cos(a)*(R-22),Math.sin(a)*(R-22));ctx.lineTo(Math.cos(a)*(R-5),Math.sin(a)*(R-5));ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=3;ctx.stroke()}
    ctx.beginPath();ctx.arc(0,0,70,0,TAU);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=2;ctx.stroke();
    ctx.rotate(-rotation);ctx.textAlign='center';ctx.fillStyle='rgba(235,243,255,.9)';ctx.font='900 20px system-ui';ctx.fillText(isBoss()?'BOSS':'OD',0,7);ctx.restore();
  }
  function drawAttachedDart(d){
    const a=d.angle+rotation, px=CX+Math.cos(a)*(R+38), py=CY+Math.sin(a)*(R+38);
    ctx.save();ctx.translate(px,py);ctx.rotate(a+Math.PI/2);drawDartShape(ctx,getEffect(d.effect),d.len);ctx.restore();
  }
  function drawDartShape(c,e,len=80){
    const ri=RARITY_ORDER.indexOf(e.rarity), bodyW=8+Math.min(5,ri), bodyLen=len*(.70+ri*.015);
    c.shadowBlur=14+ri*3;c.shadowColor=e.color;
    if(e.id==='riftneedle'){
      roundRect(c,-8,-len/2,6,bodyLen,4,e.color);roundRect(c,2,-len/2,6,bodyLen,4,e.accent);
    }else{
      roundRect(c,-bodyW/2,-len/2,bodyW,bodyLen,5,e.color);
      if(ri>=3){c.fillStyle='rgba(255,255,255,.62)';roundRect(c,-1.4,-len/2+8,2.8,bodyLen-14,2,'rgba(255,255,255,.62)')}
    }
    c.shadowBlur=0;
    c.fillStyle=e.accent;c.beginPath();c.moveTo(-13-ri,-len/2+5);c.lineTo(0,-len/2-15-ri*2);c.lineTo(13+ri,-len/2+5);c.lineTo(5,-len/2+20);c.lineTo(-5,-len/2+20);c.closePath();c.fill();
    c.fillStyle='#f4f8ff';c.beginPath();c.moveTo(-5-ri*.35,len*.22);c.lineTo(0,len*.42+ri*1.5);c.lineTo(5+ri*.35,len*.22);c.closePath();c.fill();
    if(ri>=3){c.strokeStyle=e.accent;c.lineWidth=2;c.beginPath();c.arc(0,-2,10+ri*2,0,TAU);c.stroke()}
    if(ri>=4){c.fillStyle=e.accent;for(const side of [-1,1]){c.beginPath();c.moveTo(side*bodyW/2,-6);c.lineTo(side*(22+ri*2),8);c.lineTo(side*bodyW/2,18);c.closePath();c.fill()}}
    if(ri>=5){c.fillStyle=e.color;for(let i=0;i<3;i++){const a=i*TAU/3;c.beginPath();c.arc(Math.cos(a)*(18+ri),Math.sin(a)*(18+ri)-1,2.8,0,TAU);c.fill()}}
    if(ri>=6){c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;c.beginPath();c.ellipse(0,-2,28,13,.45,0,TAU);c.stroke()}
  }
  function drawShooter(){
    ctx.save();ctx.translate(CX,H-78);ctx.fillStyle='rgba(255,255,255,.055)';roundRect(ctx,-70,-42,140,84,23,'rgba(255,255,255,.045)','rgba(132,164,225,.16)');ctx.beginPath();ctx.arc(0,0,24,0,TAU);ctx.fillStyle='rgba(88,225,255,.12)';ctx.fill();ctx.restore();
  }
  function drawFlyingDart(d){
    const e=getEffect();
    if(save.settings.particles){for(let i=0;i<d.trail.length;i++){const p=d.trail[i],alpha=i/d.trail.length*.28;ctx.fillStyle=e.color;ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(p.x,p.y,2+i/d.trail.length*3,0,TAU);ctx.fill()}ctx.globalAlpha=1}
    ctx.save();ctx.translate(d.x,d.y);drawDartShape(ctx,e,78);ctx.restore();
  }

  // ---------------- Upgrades ----------------
  function upgradeCost(u,lvl){ return Math.round(u.base * Math.pow(u.scale,lvl)); }
  function renderUpgrades(){
    $('#upgradeGrid').innerHTML=UPGRADES.map(u=>{const lvl=upgradeLevel(u.id),max=lvl>=u.max,cost=max?0:upgradeCost(u,lvl);return `<article class="upgrade-card ${max?'maxed':''}"><span class="eyebrow">LEVEL ${lvl} / ${u.max}</span><h3>${u.name}</h3><p>${u.desc}</p><div class="upgrade-meta"><span>${u.effect(lvl)}</span><b>${max?'MAX':fmt(cost)+' C'}</b></div><button class="${max?'secondary':'primary'}" data-upgrade="${u.id}" ${max?'disabled':''}>${max?'Fully Upgraded':'Upgrade'}</button></article>`}).join('');
    $$('[data-upgrade]').forEach(b=>b.onclick=()=>buyUpgrade(b.dataset.upgrade));
  }
  function buyUpgrade(id){const u=UPGRADES.find(x=>x.id===id),lvl=upgradeLevel(id);if(!u||lvl>=u.max)return;const cost=upgradeCost(u,lvl);if(save.coins<cost){toast('Not enough Coins',`Need ${fmt(cost-save.coins)} more Coins.`);return}sfx('reward');save.coins-=cost;save.upgrades[id]=lvl+1;saveGame();renderUpgrades();resetStage(false)}

  // ---------------- Effects ----------------
  function renderEffects(){
    $('#ownedEffectsText').textContent=`${save.ownedEffects.length}/${EFFECTS.length}`;$('#shardsText').textContent=fmt(save.shards);$('#pityText').textContent=`${save.pityEpic} / 30`;
    $('#tripleRollHint').textContent=hasPass('tripleRoll')?'Triple Roll License owned.':'Requires Triple Roll License.';
    $('#rollThreeBtn').disabled=!hasPass('tripleRoll');
    $('#effectsGrid').innerHTML=EFFECTS.map(e=>{const r=RARITIES[e.rarity],isOwned=owned(e.id),eq=save.equippedEffect===e.id;return `<article class="effect-card ${isOwned?'owned':''} ${eq?'equipped':''}"><div class="effect-preview" style="box-shadow:inset 0 0 45px ${r.glow}"><i class="dart-demo" style="color:${e.color};background:${e.color}"></i></div><span class="rarity" style="color:${r.color}">${e.rarity}</span><h3>${e.name}</h3><p>${e.desc}</p><div class="upgrade-meta"><span>${e.boost}</span><b>${isOwned?'OWNED':'LOCKED'}</b></div><button class="${eq?'secondary':'primary'}" data-effect="${e.id}" ${!isOwned?'disabled':''}>${eq?'Equipped':isOwned?'Equip':'Discover by Rolling'}</button></article>`}).join('');
    $$('[data-effect]').forEach(b=>b.onclick=()=>equipEffect(b.dataset.effect));
  }
  function equipEffect(id){if(!owned(id))return;save.equippedEffect=id;sfx('hit');saveGame();renderEffects();updateHUD();}
  function pickRarity(minRarity=null){
    let entries=RARITY_ORDER.map(n=>({name:n,w:RARITIES[n].weight}));
    if(hasPass('luckyCore')) { entries.find(x=>x.name==='Common').w-=10;entries.find(x=>x.name==='Uncommon').w-=5;entries.find(x=>x.name==='Epic').w+=6;entries.find(x=>x.name==='Legendary').w+=4;entries.find(x=>x.name==='Mythical').w+=3;entries.find(x=>x.name==='Divine').w+=2; }
    if(minRarity){const idx=RARITY_ORDER.indexOf(minRarity);entries=entries.filter(x=>RARITY_ORDER.indexOf(x.name)>=idx)}
    const total=entries.reduce((a,b)=>a+b.w,0);let roll=Math.random()*total;for(const e of entries){roll-=e.w;if(roll<=0)return e.name}return entries.at(-1).name;
  }
  function rollEffect(forcedMin=null){
    let min=forcedMin;
    if(!min && save.pityLegendary>=79)min='Legendary'; else if(!min && save.pityEpic>=29)min='Epic';
    const rarity=pickRarity(min);const pool=EFFECTS.filter(e=>e.rarity===rarity && e.id!=='starter');const effect=choose(pool.length?pool:EFFECTS.filter(e=>e.rarity===rarity));
    save.pityEpic = RARITY_ORDER.indexOf(rarity)>=RARITY_ORDER.indexOf('Epic') ? 0 : save.pityEpic+1;
    save.pityLegendary = RARITY_ORDER.indexOf(rarity)>=RARITY_ORDER.indexOf('Legendary') ? 0 : save.pityLegendary+1;
    let duplicate=owned(effect.id);
    if(duplicate) save.shards+=RARITIES[rarity].shards; else save.ownedEffects.push(effect.id);
    return {effect,duplicate};
  }
  function doRoll(count){
    const cost=250*count;if(save.coins<cost){toast('Not enough Coins',`Need ${fmt(cost-save.coins)} more Coins.`);return}if(count===3&&!hasPass('tripleRoll'))return;
    save.coins-=cost;const results=[];for(let i=0;i<count;i++)results.push(rollEffect());saveGame();renderEffects();
    $('#rollPreview').textContent=results.map(r=>r.effect.rarity.toUpperCase()).join(' / ');sfx(results.some(r=>RARITY_ORDER.indexOf(r.effect.rarity)>=4)?'rare':'reward');
    modal(`<span class="eyebrow">EFFECT ROLL RESULT</span><h2>${count===1?results[0].effect.name:'Triple Roll'}</h2><div class="reward-showcase" style="color:${results[0].effect.color}"><div class="dart-demo"></div></div>${results.map(r=>`<p><b style="color:${RARITIES[r.effect.rarity].color}">${r.effect.rarity}: ${r.effect.name}</b><br>${r.duplicate?`Duplicate converted to ${RARITIES[r.effect.rarity].shards} Shards.`:'New effect added to your collection.'}</p>`).join('')}`);
  }

  // ---------------- Permanent passes ----------------
  function renderPasses(){
    $('#passesGrid').innerHTML=PASSES.map(p=>{const o=hasPass(p.id);return `<article class="pass-card ${o?'owned':'locked'}"><span class="eyebrow">PERMANENT ACCOUNT PERK</span><h3>${p.name}</h3><p>${p.desc}</p><div class="pass-meta"><span>${p.perk}</span><b>${o?'OWNED':fmt(p.cost)+' P'}</b></div><button class="${o?'secondary':'primary'}" data-pass="${p.id}" ${o?'disabled':''}>${o?'Owned Permanently':'Unlock Pass'}</button></article>`}).join('');
    $$('[data-pass]').forEach(b=>b.onclick=()=>buyPass(b.dataset.pass));
  }
  function buyPass(id){const p=PASSES.find(x=>x.id===id);if(!p||hasPass(id))return;if(save.prisms<p.cost){toast('Not enough Prisms',`Need ${fmt(p.cost-save.prisms)} more Prisms.`);return}save.prisms-=p.cost;save.passes.push(id);sfx('rare');saveGame();renderPasses();toast(`${p.name} Unlocked`,p.perk);}

  // ---------------- Daily Arcade ----------------
  const wheelSegments = [
    {label:'500 C',weight:30,color:'#35547a',grant:()=>save.coins+=500},
    {label:'900 C',weight:20,color:'#44608f',grant:()=>save.coins+=900},
    {label:'20 P',weight:16,color:'#4251a1',grant:()=>addPrisms(20)},
    {label:'RARE+',weight:10,color:'#4b3d9c',grant:()=>grantEffect('Rare')},
    {label:'50 P',weight:9,color:'#7d458f',grant:()=>addPrisms(50)},
    {label:'2.5K C',weight:7,color:'#8e5b56',grant:()=>save.coins+=2500},
    {label:'EPIC+',weight:3,color:'#8f6a3e',grant:()=>grantEffect('Epic')},
    {label:'GRAND',weight:5,color:'#c99b4f',grand:true,grant:()=>{save.coins+=5000;addPrisms(100);grantEffect('Legendary')}}
  ];
  const wheelCanvas=$('#wheelCanvas'),wctx=wheelCanvas.getContext('2d');let wheelRotation=0,wheelSpinning=false;
  function drawWheel(rot=0){
    const cx=280,cy=280,r=252;wctx.clearRect(0,0,560,560);wctx.save();wctx.translate(cx,cy);wctx.rotate(rot);let a=-Math.PI/2;
    for(const s of wheelSegments){const span=TAU*(s.weight/100);wctx.beginPath();wctx.moveTo(0,0);wctx.arc(0,0,r,a,a+span);wctx.closePath();wctx.fillStyle=s.color;wctx.fill();wctx.strokeStyle='rgba(255,255,255,.16)';wctx.lineWidth=2;wctx.stroke();wctx.save();wctx.rotate(a+span/2);wctx.translate(r*.63,0);wctx.rotate(Math.PI/2);wctx.fillStyle=s.grand?'#fff7c7':'#edf3ff';wctx.font=s.grand?'900 15px system-ui':'800 13px system-ui';wctx.textAlign='center';wctx.fillText(s.label,0,0);wctx.restore();a+=span}
    wctx.beginPath();wctx.arc(0,0,72,0,TAU);wctx.fillStyle='#0c1428';wctx.fill();wctx.strokeStyle='rgba(255,255,255,.25)';wctx.lineWidth=4;wctx.stroke();wctx.fillStyle='#f4f7ff';wctx.font='900 24px system-ui';wctx.textAlign='center';wctx.fillText('OD',0,8);wctx.restore();
  }
  function weightedPick(items){const total=items.reduce((a,b)=>a+b.weight,0);let n=Math.random()*total;for(const x of items){n-=x.weight;if(n<=0)return x}return items.at(-1)}
  function dailyAvailable(type){return save.daily[type]!==dayKey()}
  function markDaily(type){save.daily[type]=dayKey();saveGame();renderDailyStatus()}
  function grantEffect(min){const r=rollEffect(min);toast(`${r.effect.rarity} Effect`,r.duplicate?`${r.effect.name} duplicate became Shards.`:`${r.effect.name} added to collection.`);}
  function spinWheel(quick=false){
    if(wheelSpinning)return;if(!dailyAvailable('wheel')){toast('Wheel already used today','Refresh it with Prisms to spin again.');return}
    const result=weightedPick(wheelSegments);markDaily('wheel');
    if(quick){result.grant();saveGame();renderDailyStatus();sfx(result.grand?'rare':'reward');toast(result.grand?'Grand Prize':result.label,result.grand?'5,000 Coins, 100 Prisms, and a Legendary+ Effect.':'Daily wheel reward claimed.');return}
    wheelSpinning=true;let targetAngle=0,cum=0;for(const s of wheelSegments){const span=TAU*s.weight/100;if(s===result){targetAngle=-(cum+span/2)-Math.PI/2;break}cum+=span}
    const start=wheelRotation;const final=targetAngle+TAU*(6+Math.floor(Math.random()*3));const dur=save.settings.reducedMotion?550:2600;const st=performance.now();
    const anim=(now)=>{let p=clamp((now-st)/dur,0,1),e=1-Math.pow(1-p,4);wheelRotation=start+(final-start)*e;drawWheel(wheelRotation);if(p<1)requestAnimationFrame(anim);else{wheelSpinning=false;result.grant();saveGame();renderDailyStatus();sfx(result.grand?'rare':'reward');toast(result.grand?'Grand Prize':result.label,result.grand?'5,000 Coins, 100 Prisms, and a Legendary+ Effect.':'Daily wheel reward collected.')}};requestAnimationFrame(anim);
  }

  let scratchActive=false,scratchRevealed=0,scratchReward=null,scratchCells=[];
  const scratchRewards=[
    {label:'350 Coins',weight:26,grant:()=>save.coins+=350},
    {label:'700 Coins',weight:22,grant:()=>save.coins+=700},
    {label:'12 Prisms',weight:16,grant:()=>addPrisms(12)},
    {label:'Rare Effect',weight:13,grant:()=>grantEffect('Rare')},
    {label:'1,500 Coins',weight:10,grant:()=>save.coins+=1500},
    {label:'Epic Effect',weight:7.5,grant:()=>grantEffect('Epic')},
    {label:'GRAND: Legendary Effect',weight:2.5,grand:true,grant:()=>grantEffect('Legendary')},
    {label:'GRAND: 150 Prisms',weight:1.5,grand:true,grant:()=>addPrisms(150)},
    {label:'GRAND: Divine Effect',weight:.5,grand:true,grant:()=>grantEffect('Divine')}
  ];
  function buildScratch(){
    scratchActive=false;scratchRevealed=0;scratchReward=null;scratchCells=Array.from({length:9},(_,i)=>({id:i,label:choose(['COINS','PRISMS','EFFECT','BOOST','VAULT','LUCK']),revealed:false}));renderScratch();
  }
  function startScratch(quick=false){if(!dailyAvailable('scratch')){toast('Scratch already used today','Refresh it with Prisms for another ticket.');return}scratchReward=weightedPick(scratchRewards);markDaily('scratch');if(quick){scratchReward.grant();saveGame();sfx(scratchReward.grand?'rare':'reward');toast(scratchReward.grand?'Scratch Grand Prize':scratchReward.label,'Quick Claim resolved the ticket instantly.');buildScratch();return}scratchActive=true;scratchRevealed=0;scratchCells.forEach(c=>c.revealed=false);renderScratch();}
  function renderScratch(){
    $('#scratchGrid').innerHTML=scratchCells.map(c=>`<button class="scratch-cell ${c.revealed?'revealed':''}" data-scratch="${c.id}">${c.revealed?`<b>${c.label}</b>`:''}</button>`).join('');
    $$('[data-scratch]').forEach(b=>b.onclick=()=>scratchCell(+b.dataset.scratch));
  }
  function scratchCell(id){if(!scratchActive)return;const c=scratchCells[id];if(c.revealed)return;c.revealed=true;scratchRevealed++;tone(300+scratchRevealed*40,.04,'triangle',.035);renderScratch();if(scratchRevealed>=6){scratchActive=false;scratchReward.grant();saveGame();sfx(scratchReward.grand?'rare':'reward');modal(`<span class="eyebrow">SCRATCH RESULT</span><h2>${scratchReward.label}</h2><p>${scratchReward.grand?'You uncovered one of the three grand-prize outcomes.':'Ticket complete. Your reward has been added.'}</p>`);}}

  let memoryActive=false,memoryDeck=[],memoryOpen=[],memoryMatched=0,memoryMoves=0,memoryLock=false;
  function buildMemory(){const symbols=['A','B','C','D','E','F','G','H'];memoryDeck=[...symbols,...symbols].sort(()=>Math.random()-.5).map((v,i)=>({id:i,v,open:false,matched:false}));memoryOpen=[];memoryMatched=0;memoryMoves=0;memoryActive=false;renderMemory();}
  function startMemory(quick=false){if(!dailyAvailable('memory')){toast('Memory game already used today','Refresh it with Prisms to play again.');return}markDaily('memory');if(quick){grantMemoryReward(12,true);buildMemory();return}memoryActive=true;memoryMoves=0;memoryMatched=0;memoryOpen=[];memoryDeck.forEach(c=>{c.open=false;c.matched=false});renderMemory();renderDailyStatus();}
  function renderMemory(){
    $('#memoryGrid').innerHTML=memoryDeck.map(c=>`<button class="memory-card ${c.open?'flipped':''} ${c.matched?'matched':''}" data-memory="${c.id}"><b>${c.v}</b></button>`).join('');$$('[data-memory]').forEach(b=>b.onclick=()=>flipMemory(+b.dataset.memory));
  }
  function flipMemory(id){if(!memoryActive||memoryLock)return;const c=memoryDeck[id];if(c.open||c.matched)return;c.open=true;memoryOpen.push(c);tone(440,.04,'sine',.025);renderMemory();if(memoryOpen.length===2){memoryMoves++;const[a,b]=memoryOpen;if(a.v===b.v){a.matched=b.matched=true;memoryMatched+=2;memoryOpen=[];sfx('hit');renderMemory();if(memoryMatched===16){memoryActive=false;grantMemoryReward(memoryMoves,false)}}else{memoryLock=true;setTimeout(()=>{a.open=b.open=false;memoryOpen=[];memoryLock=false;renderMemory()},600)}}renderDailyStatus();}
  function grantMemoryReward(moves,quick){let coins=moves<=10?1300:moves<=14?900:moves<=20?650:450;if(quick)coins=650;save.coins+=coins;if(moves<=12)addPrisms(8);if(Math.random()<.12)grantEffect('Uncommon');saveGame();sfx('reward');toast(`Memory Reward: ${fmt(coins)} Coins`,quick?'Quick Claim used a standard reward tier.':`${moves} moves completed.`);renderDailyStatus();}

  function refreshDaily(type,baseCost){const cost=passAdjustedCost(baseCost);if(save.prisms<cost){toast('Not enough Prisms',`Need ${cost-save.prisms} more Prisms.`);return}save.prisms-=cost;save.daily[type]='';saveGame();renderDailyStatus();toast(`${type[0].toUpperCase()+type.slice(1)} refreshed`,`${cost} Prisms spent.`);}
  function quickDaily(type,baseCost){const cost=passAdjustedCost(baseCost);if(!dailyAvailable(type)){toast('Daily use already spent','Refresh it first if you want another reward.');return}if(save.prisms<cost){toast('Not enough Prisms',`Need ${cost-save.prisms} more Prisms.`);return}save.prisms-=cost;if(type==='wheel')spinWheel(true);if(type==='scratch')startScratch(true);if(type==='memory')startMemory(true);saveGame();}
  function renderDailyStatus(){
    const w=dailyAvailable('wheel'),s=dailyAvailable('scratch'),m=dailyAvailable('memory');
    $('#wheelStatus').innerHTML=`Free use: <b>${w?'Ready':'Used today'}</b><br>Quick Claim cost: ${passAdjustedCost(8)} Prisms`;
    $('#scratchStatus').innerHTML=`Free ticket: <b>${s?'Ready':'Used today'}</b><br>${scratchActive?`Panels revealed: ${scratchRevealed}/6`:`Quick Claim cost: ${passAdjustedCost(10)} Prisms`}`;
    $('#memoryStatus').innerHTML=`Free game: <b>${m?'Ready':'Used today'}</b><br>${memoryActive?`Moves: ${memoryMoves} | Pairs: ${memoryMatched/2}/8`:`Quick Claim cost: ${passAdjustedCost(18)} Prisms`}`;
    $('#spinWheelBtn').textContent=w?'Spin Free':'Used Today';$('#spinWheelBtn').disabled=!w;
    $('#newScratchBtn').textContent=s?'Start Free Ticket':'Used Today';$('#newScratchBtn').disabled=!s;
    $('#startMemoryBtn').textContent=m?'Start Free Game':'Used Today';$('#startMemoryBtn').disabled=!m;
    $('#refreshWheelBtn').textContent=`Refresh for ${passAdjustedCost(20)} Prisms`;$('#refreshScratchBtn').textContent=`Refresh for ${passAdjustedCost(15)} Prisms`;$('#refreshMemoryBtn').textContent=`Refresh for ${passAdjustedCost(12)} Prisms`;
    ensureQuickButtons();
  }
  function ensureQuickButtons(){
    const defs=[['#spinWheelBtn','wheel',8],['#newScratchBtn','scratch',10],['#startMemoryBtn','memory',18]];
    for(const [sel,type,cost] of defs){const base=$(sel);if(!base)return;let q=base.parentElement.querySelector(`[data-quick="${type}"]`);if(!q){q=document.createElement('button');q.className='secondary';q.dataset.quick=type;base.parentElement.insertBefore(q,base.nextSibling);q.onclick=()=>quickDaily(type,cost)}q.textContent=`Quick Claim for ${passAdjustedCost(cost)} Prisms`;q.disabled=!dailyAvailable(type)}
  }

  // ---------------- Settings ----------------
  function renderSettings(){
    $('#volumeRange').value=save.settings.volume;$('#volumeText').textContent=`${fmt(save.settings.volume)}%`;
    setToggle($('#shakeToggle'),save.settings.shake);setToggle($('#particlesToggle'),save.settings.particles);setToggle($('#motionToggle'),save.settings.reducedMotion,true);
  }
  function setToggle(el,on,inverseLabel=false){el.classList.toggle('on',on);el.textContent=on?'On':'Off';}

  // ---------------- Wiring ----------------
  $$('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  $('#shootBtn').onclick=shoot;canvas.onclick=shoot;
  window.addEventListener('keydown',e=>{if(e.code==='Space'&&currentView==='play'){e.preventDefault();shoot()}});
  $('#pauseBtn').onclick=()=>{paused=!paused;$('#pauseBtn').textContent=paused?'Resume Run':'Pause Run';showRunBanner(paused?'PAUSED':'');if(!paused)hideRunBanner()};
  $('#modalClose').onclick=closeModal;$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
  $('#rollOneBtn').onclick=()=>doRoll(1);$('#rollThreeBtn').onclick=()=>doRoll(3);
  $$('.daily-tabs button').forEach(b=>b.onclick=()=>{$$('.daily-tabs button').forEach(x=>x.classList.toggle('active',x===b));$$('.daily-pane').forEach(p=>p.classList.toggle('active',p.id===`daily${b.dataset.daily[0].toUpperCase()+b.dataset.daily.slice(1)}`));if(b.dataset.daily==='wheel')drawWheel(wheelRotation)});
  $('#spinWheelBtn').onclick=()=>spinWheel(false);$('#refreshWheelBtn').onclick=()=>refreshDaily('wheel',20);
  $('#newScratchBtn').onclick=()=>startScratch(false);$('#refreshScratchBtn').onclick=()=>refreshDaily('scratch',15);
  $('#startMemoryBtn').onclick=()=>startMemory(false);$('#refreshMemoryBtn').onclick=()=>refreshDaily('memory',12);
  $('#volumeRange').oninput=e=>{save.settings.volume=+e.target.value;$('#volumeText').textContent=`${fmt(save.settings.volume)}%`;saveGame();updateAudioVolume()};
  $('#shakeToggle').onclick=()=>{save.settings.shake=!save.settings.shake;saveGame();renderSettings()};
  $('#particlesToggle').onclick=()=>{save.settings.particles=!save.settings.particles;saveGame();renderSettings()};
  $('#motionToggle').onclick=()=>{save.settings.reducedMotion=!save.settings.reducedMotion;saveGame();renderSettings()};
  $('#resetDataBtn').onclick=()=>modal(`<span class="eyebrow">RESET SAVE</span><h2>Delete all progression?</h2><p>This removes currency, upgrades, effects, passes, records and daily state from this browser.</p><button class="primary" id="confirmReset">Confirm Full Reset</button>`);
  document.addEventListener('click',e=>{if(e.target?.id==='confirmReset'){localStorage.removeItem(SAVE_KEY);save=structuredClone(DEFAULT_SAVE);closeModal();resetStage(true);refreshTopbar();toast('Save reset','Orbit Darts returned to a fresh account.')}});

  // Screenshot/demo states, harmless for normal play.
  function applyDemoState(){
    const params=new URLSearchParams(location.search);const show=params.get('show');
    if(params.get('demo')==='1'){
      save.coins=Math.max(save.coins,12840);save.prisms=Math.max(save.prisms,730);save.accountLevel=Math.max(save.accountLevel,18);save.bestCombo=Math.max(save.bestCombo,4.82);save.ownedEffects=[...new Set([...save.ownedEffects,'tidal','prismflare','sunbreaker','novaheart'])];save.equippedEffect='prismflare';save.upgrades.coinForge=7;save.upgrades.comboAmp=5;save.upgrades.steadyCore=4;saveGame();stage=12;resetStage(true);
    }
    if(show && ['play','upgrades','effects','daily','passes','settings'].includes(show))setView(show);
    const daily=params.get('daily');if(show==='daily'&&daily){const btn=$(`[data-daily="${daily}"]`);if(btn)btn.click()}
  }

  buildScratch();buildMemory();refreshTopbar();renderUpgrades();renderEffects();renderPasses();renderSettings();drawWheel();resetStage(true);applyDemoState();requestAnimationFrame(gameLoop);
})();
