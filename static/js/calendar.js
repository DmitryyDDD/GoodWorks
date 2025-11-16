// Данные событий
const eventsData = [
    {
        id: 1,
        title: "Волонтерский субботник в парке",
        description: "Приглашаем всех желающих на весенний субботник в Центральном парке. Будем убирать территорию, высаживать цветы и приводить в порядок детские площадки.",
        date: "2025-11-15",
        time: "10:00",
        endTime: "14:00",
        category: "ecology",
        categoryName: "Экология",
        city: "volgodonsk",
        cityName: "Волгодонск",
        location: "Центральный парк, главный вход",
        organizer: "Эко-движение 'Зеленая волна'",
        participants: 45,
        maxParticipants: 100,
        image: null,
        featured: true
    },
    {
        id: 2,
        title: "Мастер-класс по рисованию для детей",
        description: "Творческий мастер-класс для детей от 6 до 12 лет. Учим основам акварельной живописи и развиваем творческие способности.",
        date: "2025-11-15",
        time: "15:00",
        endTime: "17:00",
        category: "education",
        categoryName: "Образование",
        city: "volgodonsk",
        cityName: "Волгодонск",
        location: "Детский центр развития, ул. Мира, 15",
        organizer: "Студия творчества 'Радуга'",
        participants: 12,
        maxParticipants: 20,
        image: null,
        featured: false
    },
    {
        id: 3,
        title: "Благотворительный забег",
        description: "Ежегодный благотворительный забег в поддержку детей с ограниченными возможностями. Все собранные средства пойдут на лечение и реабилитацию.",
        date: "2025-11-16",
        time: "09:00",
        endTime: "12:00",
        category: "sport",
        categoryName: "Спорт",
        city: "volgodonsk",
        cityName: "Волгодонск",
        location: "Стадион 'Атом', старт у центрального входа",
        organizer: "Спортивный клуб 'Энергия'",
        participants: 120,
        maxParticipants: 200,
        image: null,
        featured: true
    }
];

// Текущее состояние
let currentDate = new Date();
let currentView = 'month';
let filteredEvents = [...eventsData];
let selectedDate = null;

// Русские названия месяцев
const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Русские названия дней недели
const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Переменная для отслеживания авторизации
let isUserLoggedIn = false;

// Функция для проверки авторизации
function checkAuthStatus() {
    // В реальном приложении здесь будет проверка токена или сессии
    // Для демонстрации используем localStorage
    const userToken = localStorage.getItem('userToken');
    isUserLoggedIn = !!userToken;
    return isUserLoggedIn;
}

// Функция для показа модального окна подтверждения регистрации
function showRegistrationConfirmModal() {
    const modal = document.getElementById('registration-confirm-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Функция для скрытия модального окна подтверждения регистрации
function hideRegistrationConfirmModal() {
    const modal = document.getElementById('registration-confirm-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Функция для показа модального окна требования входа
function showLoginRequiredModal() {
    const modal = document.getElementById('login-required-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Функция для скрытия модального окна требования входа
function hideLoginRequiredModal() {
    const modal = document.getElementById('login-required-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Функция для форматирования даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Функция для получения названия месяца
function getMonthName(month) {
    return months[month];
}

// Функция для отображения календаря на месяц
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Обновляем заголовок
    document.getElementById('current-month').textContent = `${getMonthName(month)} ${year}`;
    
    // Получаем первый день месяца и день недели
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    
    // Корректируем день недели (понедельник = 0)
    const startingDayAdjusted = startingDay === 0 ? 6 : startingDay - 1;
    
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startingDayAdjusted; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'rosatom-calendar-day other-month';
        const prevMonthDay = new Date(year, month, -i);
        dayElement.innerHTML = `
            <div class="rosatom-calendar-day-number">${prevMonthDay.getDate()}</div>
        `;
        daysContainer.appendChild(dayElement);
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        const currentDay = new Date(year, month, day);
        const isToday = isSameDay(currentDay, new Date());
        
        dayElement.className = `rosatom-calendar-day ${isToday ? 'today' : ''}`;
        
        // Находим события на этот день
        const dayEvents = filteredEvents.filter(event => 
            isSameDay(new Date(event.date), currentDay)
        );
        
        let eventsHTML = '';
        if (dayEvents.length > 0) {
            // Показываем до 3 событий
            const eventsToShow = dayEvents.slice(0, 3);
            eventsHTML = eventsToShow.map(event => 
                `<div class="rosatom-day-event ${event.category}" title="${event.title}">${event.title}</div>`
            ).join('');
            
            // Если событий больше 3, показываем "+X еще"
            if (dayEvents.length > 3) {
                eventsHTML += `<div class="rosatom-more-events">+${dayEvents.length - 3} еще</div>`;
            }
        }
        
        dayElement.innerHTML = `
            <div class="rosatom-calendar-day-number">${day}</div>
            <div class="rosatom-day-events">${eventsHTML}</div>
        `;
        
        // Добавляем обработчик клика
        dayElement.addEventListener('click', () => showDayEvents(dayEvents, currentDay));
        
        daysContainer.appendChild(dayElement);
    }
}

// Функция для проверки, один ли это день
function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

// Функция для отображения событий в виде списка
function renderEventsList() {
    const eventsList = document.getElementById('events-list');
    
    let eventsToShow = filteredEvents;
    
    // Если выбрана конкретная дата, фильтруем события по этой дате
    if (selectedDate) {
        eventsToShow = filteredEvents.filter(event => 
            isSameDay(new Date(event.date), selectedDate)
        );
    }
    
    if (eventsToShow.length === 0) {
        eventsList.innerHTML = `
            <div class="rosatom-no-results">
                <h3>События не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    // Сортируем события по дате
    const sortedEvents = [...eventsToShow].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    eventsList.innerHTML = sortedEvents.map(event => createEventCard(event)).join('');
}

// Функция для создания карточки события
function createEventCard(event) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = getMonthName(eventDate.getMonth()).substring(0, 3);
    const weekday = weekdays[eventDate.getDay()];
    
    return `
        <div class="rosatom-event-card">
            <div class="rosatom-event-date">
                <div class="rosatom-event-day">${day}</div>
                <div class="rosatom-event-month">${month}</div>
                <div class="rosatom-event-weekday">${weekday}</div>
            </div>
            
            <div class="rosatom-event-content">
                <div class="rosatom-event-header">
                    <div>
                        <h3 class="rosatom-event-title">
                            ${event.title}
                        </h3>
                        <div class="rosatom-event-meta">
                            <span class="rosatom-event-category">${event.categoryName}</span>
                            <span class="rosatom-event-city">${event.cityName}</span>
                            <span class="rosatom-event-time">${event.time} - ${event.endTime}</span>
                        </div>
                    </div>
                </div>
                
                <div class="rosatom-event-description">
                    ${event.description}
                </div>
                
                <div class="rosatom-event-details">
                    <div class="rosatom-event-detail rosatom-event-location">${event.location}</div>
                    <div class="rosatom-event-detail rosatom-event-organizer">${event.organizer}</div>
                    <div class="rosatom-event-detail rosatom-event-participants">${event.participants} участников</div>
                </div>
                
                <div class="rosatom-event-actions">
                    <button class="rosatom-register-btn" onclick="registerForEvent(${event.id})">
                        📝 Записаться
                    </button>
                    <button class="rosatom-details-btn" onclick="showEventDetails(${event.id})">
                        ℹ️ Подробнее
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Функция для фильтрации событий
function filterEvents() {
    const cityFilter = document.getElementById('filter-city').value;
    const categoryFilter = document.getElementById('filter-category').value;
    
    filteredEvents = eventsData.filter(event => {
        // Фильтрация по городу
        const cityMatch = !cityFilter || event.city === cityFilter || event.city === 'all';
        
        // Фильтрация по категории
        const categoryMatch = !categoryFilter || event.category === categoryFilter;
        
        return cityMatch && categoryMatch;
    });
    
    // Обновляем отображение в зависимости от текущего вида
    if (currentView === 'month') {
        renderCalendar();
    } else {
        renderEventsList();
    }
}

// Функция для переключения вида
function switchView(view) {
    currentView = view;
    
    // Обновляем активные кнопки
    document.querySelectorAll('.rosatom-calendar-view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    
    // Показываем/скрываем соответствующий вид
    document.getElementById('month-view').classList.toggle('active', view === 'month');
    document.getElementById('list-view').classList.toggle('active', view === 'list');
    
    // Скрываем навигацию по месяцам в режиме списка
    const calendarHeader = document.querySelector('.rosatom-calendar-header');
    if (calendarHeader) {
        calendarHeader.style.display = view === 'month' ? 'flex' : 'none';
    }
    
    // Перерисовываем контент
    if (view === 'month') {
        renderCalendar();
    } else {
        renderEventsList();
    }
}

// Функция для регистрации на событие
function registerForEvent(eventId) {
    // Проверяем авторизацию
    if (!checkAuthStatus()) {
        showLoginRequiredModal();
        return;
    }
    
    // Логика для авторизованного пользователя
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        // В реальном приложении здесь будет запрос к API
        console.log(`Регистрация на событие: ${event.title}`);
        showRegistrationConfirmModal();
    }
}

// Функция для показа деталей события
function showEventDetails(eventId) {
    // В реальном приложении здесь будет переход на страницу события
    console.log(`Просмотр деталей события ID: ${eventId}`);
    // Временно показываем модальное окно
    showRegistrationConfirmModal();
}

// Функция для показа событий дня
function showDayEvents(events, date) {
    selectedDate = date;
    switchView('list');
}

// Функция для навигации по месяцам
function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем статус авторизации
    checkAuthStatus();
    
    // Настройка фильтров
    const filters = ['filter-city', 'filter-category'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', filterEvents);
        }
    });
    
    // Настройка кнопок вида
    document.querySelectorAll('.rosatom-calendar-view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchView(this.getAttribute('data-view'));
        });
    });
    
    // Настройка навигации по месяцам
    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));
    
    // Синхронизация фильтров городов
    const headerCity = document.getElementById('header-city');
    const pageCity = document.getElementById('filter-city');
    
    if (headerCity && pageCity) {
        headerCity.addEventListener('change', function() {
            pageCity.value = this.value;
            filterEvents();
        });
        
        pageCity.addEventListener('change', function() {
            headerCity.value = this.value;
            filterEvents();
        });
    }
    
    // Обработчики для модальных окон
    setupModalHandlers();
    
    // Явно устанавливаем начальный вид
    switchView('month');
    
    // Обработка фильтрации из URL
    const urlParams = new URLSearchParams(window.location.search);
    const presetCity = urlParams.get('city');
    if (presetCity) {
        const citySelect = document.getElementById('filter-city');
        const headerCitySelect = document.getElementById('header-city');
        if (citySelect) citySelect.value = presetCity;
        if (headerCitySelect) headerCitySelect.value = presetCity;
        filterEvents();
    }
});

// Функция для настройки обработчиков модальных окон
function setupModalHandlers() {
    // Модальное окно подтверждения регистрации
    const registrationModal = document.getElementById('registration-confirm-modal');
    const registrationClose = registrationModal.querySelector('.close-modal');
    const registrationCloseBtn = registrationModal.querySelector('.modal-close-btn');
    
    registrationClose.addEventListener('click', hideRegistrationConfirmModal);
    registrationCloseBtn.addEventListener('click', hideRegistrationConfirmModal);
    
    registrationModal.addEventListener('click', function(e) {
        if (e.target === registrationModal) {
            hideRegistrationConfirmModal();
        }
    });
    
    // Модальное окно требования входа
    const loginModal = document.getElementById('login-required-modal');
    const loginClose = loginModal.querySelector('.close-modal');
    const loginCloseBtn = loginModal.querySelector('.modal-close-btn');
    
    loginClose.addEventListener('click', hideLoginRequiredModal);
    loginCloseBtn.addEventListener('click', hideLoginRequiredModal);
    
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            hideLoginRequiredModal();
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideRegistrationConfirmModal();
            hideLoginRequiredModal();
        }
    });
}