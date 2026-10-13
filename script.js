// Редагуйте цей масив, щоб додавати або змінювати секції та завдання.
const checklistData = [
  {
    title: 'Перед виїздом', icon: '🧴', items: [
      { text: 'Перевірити охайний зовнішній вигляд' },
      { text: 'Взяти необхідний інвентар та хімію', description: 'Перевірити замовлення та додаткові послуги, якщо вони вказані.' },
      { text: 'Одягнути змінний одяг: брендовану футболку, лосини та зручне взуття' },
      { text: 'Перевірити, чи все обладнання справне' },
      { text: 'Повідомити керівництво, якщо чогось не вистачає або закінчується' },
      { text: 'Взяти ганчірки, губку, скребок, швабру та рукавички' }
    ]
  },
  {
    title: "Прибуття на об'єкт", icon: '🏠', items: [
      { text: 'Привітатись та уточнити деталі прибирання', description: 'Наприклад: «Доброго дня! Давайте уточнимо замовлення та додаткові послуги».' },
      { text: 'Проговорити, що входить у роботу' },
      { text: 'Уточнити, чи є додаткові побажання' },
      { text: 'Попередити, що додаткові завдання можуть оплачуватись окремо' }
    ]
  },
  {
    title: 'Житлові кімнати', icon: '🛋️', items: [
      { text: 'Витерти пил з усіх відкритих поверхонь' },
      { text: 'Очистити фасади та ручки меблів' },
      { text: 'Протерти дзеркала та скляні поверхні' },
      { text: 'Пропилососити та вимити підлогу' },
      { text: 'Перевірити чистоту плінтусів і вимикачів' }
    ]
  },
  {
    title: 'Кухня', icon: '🍽️', items: [
      { text: 'Очистити стільницю та робочі поверхні' },
      { text: 'Вимити раковину та змішувач' },
      { text: 'Протерти зовнішні поверхні побутової техніки' },
      { text: 'Очистити фасади шаф і ручки' },
      { text: 'Вимити фартух та плиту' },
      { text: 'Вимити підлогу, приділити увагу кутам' }
    ]
  },
  {
    title: 'Ванна кімната', icon: '🫧', items: [
      { text: 'Вимити ванну або душову кабіну' },
      { text: 'Очистити та продезінфікувати унітаз' },
      { text: 'Вимити раковину та змішувач' },
      { text: 'Протерти дзеркало без розводів' },
      { text: 'Очистити доступну плитку та видимі плями' },
      { text: 'Вимити підлогу та перевірити кути' }
    ]
  },
  {
    title: 'Завершення прибирання', icon: '✨', items: [
      { text: 'Зібрати сміття та замінити пакети у відрах' },
      { text: 'Оглянути кімнати та усунути пропущені недоліки' },
      { text: 'Зібрати інвентар і перевірити, чи нічого не залишилось' },
      { text: 'Повідомити клієнту про завершення робіт' },
      { text: 'Надіслати керівництву звіт про виконану роботу' }
    ]
  }
];

const STORAGE_KEY = 'yi-cleaning-checklist-progress';
const checklistElement = document.querySelector('#checklist');
const countElement = document.querySelector('#progress-count');
const progressTrack = document.querySelector('#progress-track');
const progressFill = document.querySelector('#progress-fill');
const emptyState = document.querySelector('#empty-state');
const resetDialog = document.querySelector('#reset-dialog');

// Зберігаємо лише стан завдань, окремо від опису чек-листа.
function readProgress() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

const completedItems = readProgress();

function renderChecklist() {
  const fragment = document.createDocumentFragment();
  checklistData.forEach((section, sectionIndex) => {
    const card = document.createElement('section');
    card.className = 'checklist-card';

    const heading = document.createElement('button');
    const panelId = `section-panel-${sectionIndex}`;
    heading.className = 'card-heading';
    heading.type = 'button';
    heading.setAttribute('aria-expanded', 'true');
    heading.setAttribute('aria-controls', panelId);
    heading.innerHTML = `<span class="section-number">${String(sectionIndex + 1).padStart(2, '0')}</span><span class="section-icon" aria-hidden="true">${section.icon || '•'}</span><span class="section-title"></span><span class="section-chevron" aria-hidden="true"></span>`;
    heading.querySelector('.section-title').textContent = section.title;

    const list = document.createElement('ul');
    list.className = 'task-list';
    list.id = panelId;
    section.items.forEach((item, itemIndex) => {
      const row = document.createElement('li');
      const label = document.createElement('label');
      label.className = 'task-row';
      const checkbox = document.createElement('input');
      checkbox.className = 'task-checkbox';
      checkbox.type = 'checkbox';
      // Ключі для DOM і прогресу генеруються з позицій у масиві.
      const progressKey = `${sectionIndex}:${itemIndex}`;
      checkbox.dataset.progressKey = progressKey;
      checkbox.checked = completedItems[progressKey] === true;
      const copy = document.createElement('span');
      copy.className = 'task-copy';
      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = item.text;
      copy.append(taskText);
      if (item.description) {
        const description = document.createElement('span');
        description.className = 'task-description';
        description.textContent = item.description;
        copy.append(description);
      }
      label.append(checkbox, copy);
      row.append(label);
      list.append(row);
    });

    heading.addEventListener('click', () => {
      const isExpanded = heading.getAttribute('aria-expanded') === 'true';
      heading.setAttribute('aria-expanded', String(!isExpanded));
      list.hidden = isExpanded;
    });
    card.append(heading, list);
    fragment.append(card);
  });
  checklistElement.replaceChildren(fragment);
  emptyState.hidden = checklistData.some((section) => section.items.length > 0);
  updateProgress();
}

function updateProgress() {
  const allProgressKeys = checklistData.flatMap((section, sectionIndex) =>
    section.items.map((item, itemIndex) => `${sectionIndex}:${itemIndex}`)
  );
  const total = allProgressKeys.length;
  const completed = allProgressKeys.reduce((count, key) => count + (completedItems[key] === true ? 1 : 0), 0);
  const percentage = total === 0 ? 0 : (completed / total) * 100;
  countElement.value = `${completed} / ${total}`;
  countElement.textContent = `${completed} / ${total}`;
  progressTrack.setAttribute('aria-valuemax', String(total));
  progressTrack.setAttribute('aria-valuenow', String(completed));
  progressFill.style.width = `${percentage}%`;
}

checklistElement.addEventListener('change', (event) => {
  const checkbox = event.target.closest('.task-checkbox');
  if (!checkbox) return;
  const progressKey = checkbox.dataset.progressKey;
  if (checkbox.checked) completedItems[progressKey] = true;
  else delete completedItems[progressKey];
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(completedItems));
  } catch {
    // Інтерфейс і прогрес лишаються працездатними, навіть коли сховище недоступне.
  }
  updateProgress();
});

document.querySelector('#reset-button').addEventListener('click', () => {
  if (typeof resetDialog.showModal === 'function') resetDialog.showModal();
  else if (window.confirm('Скинути всі позначки чек-листа?')) resetChecklist();
});

function resetChecklist() {
  Object.keys(completedItems).forEach((id) => delete completedItems[id]);
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Скидання інтерфейсу все одно виконується. */ }
  checklistElement.querySelectorAll('.task-checkbox').forEach((checkbox) => { checkbox.checked = false; });
  updateProgress();
}

document.querySelector('#confirm-reset').addEventListener('click', (event) => {
  event.preventDefault();
  resetChecklist();
  resetDialog.close();
});

renderChecklist();

