// Future Letter Vault with AR Unlock
// Store capsules, unlock by date/location, AR demo, emotion trend analysis

let capsules = JSON.parse(localStorage.getItem('futureVaultCapsules')||'[]');

function analyzeEmotion(text) {
    const hopeful = ['hope','future','dream','goal','wish','aspire','believe','optimistic','excited','confident'];
    const stressed = ['stress','worried','anxious','pressure','tired','overwhelmed','panic','fear','doubt'];
    const focused = ['focus','determined','plan','work','dedicate','commit','discipline','organize','resolve'];
    let score = {hopeful:0,stressed:0,focused:0};
    const words = text.toLowerCase().split(/\W+/);
    words.forEach(w=>{
        if(hopeful.includes(w)) score.hopeful++;
        if(stressed.includes(w)) score.stressed++;
        if(focused.includes(w)) score.focused++;
    });
    return score;
}

function renderVault() {
    const vaultList = document.getElementById('vaultList');
    vaultList.innerHTML = '';
    capsules.slice().reverse().forEach((c,i)=>{
        const now = new Date();
        const unlockDate = new Date(c.date);
        let unlocked = now >= unlockDate;
        if(c.location) {
            // Demo: always unlocked if date passed
            unlocked = unlocked && true;
        }
        const li = document.createElement('li');
        li.innerHTML = `<span class="tag">${c.type}</span> ${c.content.substring(0,60)}${c.content.length>60?'...':''}<br><span class="tag">Unlock: ${c.date}${c.location?(' @ '+c.location):''}</span> <span class="tag">${unlocked?'Unlocked':'Locked'}</span> <span class="emotion">${emotionLabel(c.emotion)}</span>`;
        vaultList.appendChild(li);
    });
}

function emotionLabel(score) {
    if(score.hopeful>score.stressed&&score.hopeful>score.focused) return 'Hopeful';
    if(score.stressed>score.hopeful&&score.stressed>score.focused) return 'Stressed';
    if(score.focused>score.hopeful&&score.focused>score.stressed) return 'Focused';
    return 'Mixed';
}

function renderTrends() {
    const chart = document.getElementById('trendChart');
    const ctx = chart.getContext('2d');
    ctx.clearRect(0,0,chart.width,chart.height);
    let data = capsules.map(c=>c.emotion.hopeful-c.emotion.stressed);
    ctx.beginPath();
    ctx.moveTo(0,chart.height/2);
    data.forEach((v,i)=>{
        ctx.lineTo(i*(chart.width/data.length),chart.height/2-v*10);
    });
    ctx.strokeStyle = '#7e57c2';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#5bc0be';
    data.forEach((v,i)=>{
        ctx.beginPath();
        ctx.arc(i*(chart.width/data.length),chart.height/2-v*10,4,0,2*Math.PI);
        ctx.fill();
    });
    document.getElementById('trendInfo').innerHTML = `Capsule emotions: ${data.map(v=>v>0?'Hopeful':v<0?'Stressed':'Neutral').join(', ')}`;
}

function renderARDemo() {
    const arDemo = document.getElementById('arDemo');
    arDemo.innerHTML = '';
    capsules.forEach((c,i)=>{
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.style.margin = '20px';
        div.style.padding = '16px';
        div.style.background = '#ede7f6';
        div.style.borderRadius = '12px';
        div.style.boxShadow = '0 2px 8px rgba(126,87,194,0.08)';
        div.innerHTML = `<b>${c.type}</b><br>${c.content.substring(0,40)}${c.content.length>40?'...':''}<br><span class="tag">Unlock: ${c.date}${c.location?(' @ '+c.location):''}</span>`;
        arDemo.appendChild(div);
    });
}

function setupNav() {
    const navVault = document.getElementById('navVault');
    const navAR = document.getElementById('navAR');
    const navTrends = document.getElementById('navTrends');
    const vaultSection = document.getElementById('vaultSection');
    const arSection = document.getElementById('arSection');
    const trendsSection = document.getElementById('trendsSection');
    function showSection(section) {
        [vaultSection,arSection,trendsSection].forEach(s=>s.classList.remove('active'));
        section.classList.add('active');
        [navVault,navAR,navTrends].forEach(b=>b.classList.remove('active'));
        if(section===vaultSection) navVault.classList.add('active');
        if(section===arSection) navAR.classList.add('active');
        if(section===trendsSection) navTrends.classList.add('active');
    }
    navVault.onclick = ()=>showSection(vaultSection);
    navAR.onclick = ()=>showSection(arSection);
    navTrends.onclick = ()=>showSection(trendsSection);
}

function setupForm() {
    const vaultForm = document.getElementById('vaultForm');
    const vaultType = document.getElementById('vaultType');
    const vaultContent = document.getElementById('vaultContent');
    const vaultDate = document.getElementById('vaultDate');
    const vaultLocation = document.getElementById('vaultLocation');
    const vaultStatus = document.getElementById('vaultStatus');
    vaultForm.onsubmit = e=>{
        e.preventDefault();
        const type = vaultType.value;
        const content = vaultContent.value.trim();
        const date = vaultDate.value;
        const location = vaultLocation.value.trim();
        if(!type||!content||!date) { vaultStatus.innerHTML = '<div class="error">Fill all required fields.</div>'; return; }
        const emotion = analyzeEmotion(content);
        capsules.push({type,content,date,location,emotion});
        localStorage.setItem('futureVaultCapsules',JSON.stringify(capsules));
        vaultStatus.innerHTML = '<div class="status">Capsule stored!</div>';
        vaultForm.reset();
        renderVault();
        renderTrends();
    };
}

function setupAR() {
    document.getElementById('startARBtn').onclick = ()=>{
        renderARDemo();
        document.getElementById('arInfo').innerHTML = 'AR Demo: Capsules floating in your room.';
    };
}

window.onload = function() {
    setupNav();
    setupForm();
    setupAR();
    renderVault();
    renderTrends();
};
