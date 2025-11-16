// Данные для личного кабинета
const userData = {
    id: 1,
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (900) 123-45-67",
    city: "volgodonsk",
    cityName: "Волгодонск",
    avatar: null,
    interests: ["Экология", "Волонтерство", "Образование"],
    skills: ["Организация мероприятий", "Работа с детьми"],
    status: "active"
};

// Данные событий пользователя
const userEvents = [
    {
        id: 1,
        title: "Волонтерский субботник в парке",
        date: "2024-03-20",
        time: "10:00",
        category: "ecology",
        categoryName: "Экология",
        city: "volgodonsk",
        cityName: "Волгодонск",
        status: "registered",
        type: "upcoming"
    },
    {
        id: 3,
        title: "Благотворительный концерт для детей",
        date: "2024-03-25",
        time: "18:30",
        category: "social",
        categoryName: "Социальные",
        city: "obninsk",
        cityName: "Обнинск",
        status: "registered",
        type: "upcoming"
    },
    {
        id: 7,
        title: "Акция по сбору макулатуры",
        date: "2024-03-15",
        time: "09:00",
        category: "ecology",
        categoryName: "Экология",
        city: "sosnovy_bor",
        cityName: "Сосновый Бор",
        status: "attended",
        type: "past"
    }
];

// Текущее состояние
let currentTab = 'profile';
let currentEventFilter = 'upcoming';

// Функция для переключения вкладок
function switchTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.rosatom-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активный класс у всех пунктов меню
    document.querySelectorAll('.rosatom-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Показываем выбранную вкладку
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Активируем соответствующий пункт меню
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    currentTab = tabName;
    
    // Загружаем данные для вкладки
    loadTabData(tabName);
}

// Функция для загрузки данных вкладки
function loadTabData(tabName) {
    switch(tabName) {
        case 'profile':
            loadProfileData();
            break;
        case 'events':
            loadEventsData();
            break;
    }
}

// Загрузка данных профиля
function loadProfileData() {
    // Данные уже отображаются в HTML
    updateUserInfo();
}

// Обновление информации пользователя
function updateUserInfo() {
    document.querySelector('.rosatom-user-name').textContent = userData.name;
    document.querySelector('.rosatom-user-email').textContent = userData.email;
    document.querySelector('.rosatom-user-city').textContent = `г. ${userData.cityName}`;
}

// Загрузка данных событий
function loadEventsData() {
    const eventsList = document.getElementById('user-events-list');
    const filteredEvents = userEvents.filter(event => 
        currentEventFilter === 'all' || event.type === currentEventFilter
    );
    
    if (filteredEvents.length === 0) {
        eventsList.innerHTML = `
            <div class="rosatom-no-content">
                <div class="rosatom-no-content-icon">📅</div>
                <h4>Событий не найдено</h4>
                <p>${currentEventFilter === 'upcoming' ? 
                    'У вас нет предстоящих событий' : 
                    'У вас нет прошедших событий'}</p>
                <a href="calendar.html" class="rosatom-cta-button">Найти события</a>
            </div>
        `;
        return;
    }
    
    eventsList.innerHTML = filteredEvents.map(event => createEventCard(event)).join('');
}

// Создание карточки события для личного кабинета
function createEventCard(event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('ru-RU');
    
    return `
        <div class="rosatom-user-event-card">
            <div class="rosatom-event-date-badge">
                <div class="rosatom-event-day">${eventDate.getDate()}</div>
                <div class="rosatom-event-month">${eventDate.toLocaleDateString('ru-RU', { month: 'short' })}</div>
            </div>
            <div class="rosatom-event-content">
                <h4 class="rosatom-event-title">${event.title}</h4>
                <div class="rosatom-event-meta">
                    <span class="rosatom-event-category">${event.categoryName}</span>
                    <span class="rosatom-event-time">${formattedDate} в ${event.time}</span>
                    <span class="rosatom-event-city">${event.cityName}</span>
                </div>
                <div class="rosatom-event-status ${event.status}">
                    ${event.status === 'registered' ? '✅ Зарегистрирован' : '🎉 Посещено'}
                </div>
            </div>
            <div class="rosatom-event-actions">
                ${event.type === 'upcoming' ? 
                    `<button class="rosatom-action-btn rosatom-cancel-btn" onclick="cancelRegistration(${event.id})">
                         Отменить
                     </button>` : 
                    ''
                }
                <button class="rosatom-action-btn rosatom-details-btn" onclick="showEventDetails(${event.id})">
                    Подробнее
                </button>
            </div>
        </div>
    `;
}

// Функция-заглушка для подробностей события
function showEventDetails(eventId) {
    alert('Детальная информация о событии будет доступна в будущем обновлении');
}

// Обработчики действий
function cancelRegistration(eventId) {
    if (confirm('Вы уверены, что хотите отменить регистрацию на это событие?')) {
        // В реальном приложении здесь будет запрос к API
        alert('Регистрация отменена');
        loadEventsData(); // Перезагружаем события
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация вкладок
    document.querySelectorAll('.rosatom-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            if (!this.classList.contains('rosatom-logout')) {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            }
        });
    });
    
    // Инициализация фильтров событий
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновляем активные кнопки фильтров
            document.querySelectorAll('.rosatom-filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Обновляем фильтр и перезагружаем данные
            if (this.closest('.rosatom-tab-filters')) {
                const tab = this.closest('.rosatom-tab-content').id.replace('-tab', '');
                if (tab === 'events') {
                    currentEventFilter = filter;
                    loadEventsData();
                }
            }
        });
    });
    
    // Кнопка выхода
    document.querySelector('.rosatom-logout')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Вы уверены, что хотите выйти?')) {
            window.location.href = 'login.html';
        }
    });
    
    // Кнопка редактирования профиля
    document.querySelector('.rosatom-edit-btn')?.addEventListener('click', function() {
        alert('Форма редактирования профиля будет открыта');
    });
    
    // Первоначальная загрузка данных
    updateUserInfo();
    loadTabData(currentTab);
    
    // Синхронизация фильтров городов
    const headerCity = document.getElementById('header-city');
    if (headerCity) {
        headerCity.value = userData.city;
    }
});