// --- Auth Functions ---
function simulateSignup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    if (username && password) {
      localStorage.setItem('mhUser', JSON.stringify({ username, password }));
      alert('Sign up successful. Please login.');
      window.location.href = 'login.html';
    } else {
      alert('Please fill in both fields.');
    }
  }
  
  function simulateLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const storedUser = JSON.parse(localStorage.getItem('mhUser'));
  
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      localStorage.setItem('mhLoggedIn', 'true');
      window.location.href = 'index.html';
    } else {
      alert('Invalid credentials. Try signing up first.');
    }
  }
  
  function logout() {
    localStorage.removeItem('mhLoggedIn');
    window.location.href = 'login.html';
  }
  
  function checkLogin() {
    if (localStorage.getItem('mhLoggedIn') !== 'true') {
      window.location.href = 'login.html';
    }
  }

  function displayUsername() {
    const user = JSON.parse(localStorage.getItem('mhUser'));
    if (user) {
      document.getElementById('username-display').textContent = user.username;
    }
  }
  
  if (document.getElementById('main-app')) {
    checkLogin();
    renderMoodHistory();
    renderAssessment();
    renderJournal();
    displayUsername(); 
  }
  
  // --- Navigation ---
  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
  }
  
  // --- Mood Tracking ---
  function saveMood() {
    const mood = document.getElementById('mood-select').value;
    if (!mood) return;
    const entry = `Mood: ${mood} - ${new Date().toLocaleString()}`;
  
    let moodHistory = JSON.parse(localStorage.getItem('mhMoodHistory') || '[]');
    moodHistory.unshift(entry);
    localStorage.setItem('mhMoodHistory', JSON.stringify(moodHistory));
  
    renderMoodHistory();
  }
  
  function renderMoodHistory() {
    const history = document.getElementById('mood-history');
    const moodHistory = JSON.parse(localStorage.getItem('mhMoodHistory') || '[]');
    history.innerHTML = '';
    moodHistory.forEach(entry => {
      const div = document.createElement('div');
      div.textContent = entry;
      history.appendChild(div);
    });
  
    renderMoodChart();
  }
  
  // --- Mood Chart ---
  function moodToValue(mood) {
    switch (mood) {
      case '😄 Happy': return 5;
      case '😐 Neutral': return 3;
      case '😔 Sad': return 2;
      case '😠 Angry': return 1;
      case '😰 Anxious': return 1.5;
      default: return 0;
    }
  }
  
  function renderMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    const moodHistory = JSON.parse(localStorage.getItem('mhMoodHistory') || '[]');
  
    const labels = moodHistory.map(entry => entry.split(' - ')[1]).reverse();
    const data = moodHistory.map(entry => {
      const moodText = entry.split(' - ')[0].replace('Mood: ', '');
      return moodToValue(moodText);
    }).reverse();
  
    if (window.moodChartInstance) {
      window.moodChartInstance.destroy();
    }
  
    window.moodChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Mood Score (1-5)',
          data,
          borderColor: '#4c6ef5',
          backgroundColor: 'rgba(76, 110, 245, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
  
  // --- Self Assessment ---
  function saveAssessment() {
    const stress = document.getElementById('stress').value;
    const sleep = document.getElementById('sleep').value;
    const energy = document.getElementById('energy').value;
  
    const result = `Stress: ${stress}, Sleep: ${sleep}, Energy: ${energy} - ${new Date().toLocaleString()}`;
    localStorage.setItem('mhAssessment', result);
  
    renderAssessment();
  }
  
  function renderAssessment() {
    const result = localStorage.getItem('mhAssessment');
    const results = document.getElementById('assessment-results');
    results.innerHTML = result ? `<p>${result}</p>` : '';
  }
  
  // --- Journaling ---
  function saveJournal() {
    const entryText = document.getElementById('journal-entry').value;
    if (!entryText) return;
  
    const entry = {
      text: entryText,
      time: new Date().toLocaleString()
    };
  
    let journalHistory = JSON.parse(localStorage.getItem('mhJournal') || '[]');
    journalHistory.unshift(entry);
    localStorage.setItem('mhJournal', JSON.stringify(journalHistory));
  
    document.getElementById('journal-entry').value = '';
    renderJournal();
  }
  
  function renderJournal() {
    const history = document.getElementById('journal-history');
    const journal = JSON.parse(localStorage.getItem('mhJournal') || '[]');
    history.innerHTML = '';
    journal.forEach(entry => {
      const div = document.createElement('div');
      div.innerHTML = `<p>${entry.text}</p><small>${entry.time}</small><hr />`;
      history.appendChild(div);
    });
  }
  
  // --- Init ---
  if (document.getElementById('main-app')) {
    checkLogin();
    renderMoodHistory();
    renderAssessment();
    renderJournal();
  }
  
  