const screens = [...document.querySelectorAll('.screen')];
const todayLabel = document.querySelector('#today-label');
const emojiInput = document.querySelector('#emoji-input');
const dayText = document.querySelector('#day-text');
const photoInput = document.querySelector('#photo-input');
const photoPreview = document.querySelector('#photo-preview');
const saveEntryButton = document.querySelector('#save-entry');
const calendarGrid = document.querySelector('#calendar-grid');
const monthLabel = document.querySelector('#month-label');
const entryDetail = document.querySelector('#entry-detail');
const detailDate = document.querySelector('#detail-date');
const detailEmojis = document.querySelector('#detail-emojis');
const detailText = document.querySelector('#detail-text');
const detailPhotos = document.querySelector('#detail-photos');

let selectedPhotos = [];
const storageKey = 'johanna-journal-entries';

function getEntries() {
  return JSON.parse(localStorage.getItem(storageKey) || '{}');
}

function setEntries(entries) {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function longDate(date = new Date()) {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
  if (id === 'calendar-screen') renderCalendar();
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-go]');
  if (!button) return;
  showScreen(button.dataset.go);
});

todayLabel.textContent = longDate();

photoInput.addEventListener('change', async event => {
  const files = [...event.target.files].slice(0, 5);
  const readers = files.map(file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  }));
  selectedPhotos = await Promise.all(readers);
  renderPhotoPreview();
});

function renderPhotoPreview() {
  photoPreview.innerHTML = selectedPhotos.map(src => `<img src="${src}" alt="Journal photo" />`).join('');
}

saveEntryButton.addEventListener('click', () => {
  const key = todayKey();
  const entries = getEntries();
  entries[key] = {
    date: key,
    emojis: emojiInput.value.trim(),
    text: dayText.value.trim(),
    photos: selectedPhotos,
    createdAt: new Date().toISOString()
  };
  setEntries(entries);
  showScreen('calendar-screen');
});

document.querySelector('#new-entry').addEventListener('click', () => {
  emojiInput.value = '';
  dayText.value = '';
  selectedPhotos = [];
  renderPhotoPreview();
  showScreen('emoji-screen');
});

document.querySelector('#close-detail').addEventListener('click', () => {
  entryDetail.classList.add('hidden');
});

function renderCalendar() {
  const entries = getEntries();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now);
  monthLabel.textContent = monthName;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const weekdays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

  calendarGrid.innerHTML = weekdays.map(day => `<div class="weekday">${day}</div>`).join('');

  for (let i = 0; i < startOffset; i++) {
    calendarGrid.insertAdjacentHTML('beforeend', '<div></div>');
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = entries[dateKey];
    const hasPhoto = entry?.photos?.length;
    const style = hasPhoto ? `style="background-image:url('${entry.photos[0]}')"` : '';
    const classes = ['day-cell', entry ? 'has-entry' : '', hasPhoto ? 'has-photo' : ''].filter(Boolean).join(' ');
    calendarGrid.insertAdjacentHTML('beforeend', `<button class="${classes}" data-date="${dateKey}" ${style}><span>${day}</span></button>`);
  }

  [...calendarGrid.querySelectorAll('.day-cell')].forEach(cell => {
    cell.addEventListener('click', () => showEntry(cell.dataset.date));
  });
}

function showEntry(dateKey) {
  const entry = getEntries()[dateKey];
  if (!entry) return;
  const [year, month, day] = dateKey.split('-').map(Number);
  detailDate.textContent = longDate(new Date(year, month - 1, day));
  detailEmojis.textContent = entry.emojis || '♡';
  detailText.textContent = entry.text || 'Kein Text eingetragen.';
  detailPhotos.innerHTML = (entry.photos || []).map(src => `<img src="${src}" alt="Journal memory" />`).join('');
  entryDetail.classList.remove('hidden');
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
}
