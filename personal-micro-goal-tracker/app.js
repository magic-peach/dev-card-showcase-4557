// Personal Micro-Goal Tracker
const form = document.getElementById('goal-form');
const goalInput = document.getElementById('goal-input');
const goalList = document.getElementById('goal-list');
const celebrate = document.getElementById('celebrate');

let goals = JSON.parse(localStorage.getItem('microGoals') || '[]');

function renderGoals() {
    goalList.innerHTML = '';
    goals.forEach((goal, idx) => {
        const li = document.createElement('li');
        li.textContent = goal.text;
        if (goal.completed) li.classList.add('completed');
        const btn = document.createElement('button');
        btn.textContent = goal.completed ? 'Undo' : 'Complete';
        btn.style.marginLeft = '12px';
        btn.addEventListener('click', () => {
            goal.completed = !goal.completed;
            localStorage.setItem('microGoals', JSON.stringify(goals));
            renderGoals();
            if (goal.completed) {
                celebrate.style.display = 'block';
                setTimeout(() => celebrate.style.display = 'none', 2000);
            }
        });
        li.appendChild(btn);
        goalList.appendChild(li);
    });
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const text = goalInput.value.trim();
    if (text) {
        goals.push({ text, completed: false });
        localStorage.setItem('microGoals', JSON.stringify(goals));
        goalInput.value = '';
        renderGoals();
    }
});

renderGoals();