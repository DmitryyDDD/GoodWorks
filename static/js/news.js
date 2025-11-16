// Данные новостей
const newsData = [
    {
        id: 1,
        title: "Старт грантовой программы для экологических проектов",
        excerpt: "Объявляем о начале приема заявок на гранты для экологических инициатив в городах присутствия Росатома. Общий фонд - 5 миллионов рублей.",
        date: "2024-03-15",
        category: "grants",
        categoryName: "Гранты",
        city: "all",
        cityName: "Все города",
        image: null,
        tags: ["гранты", "экология", "финансирование"],
        featured: true
    },
    {
        id: 2,
        title: "Волонтерский субботник в парке Ангарска",
        excerpt: "Приглашаем всех желающих принять участие в весеннем субботнике в Центральном парке. Инвентарь и перчатки предоставляются.",
        date: "2024-03-14",
        category: "ecology",
        categoryName: "Экология",
        city: "angarsk",
        cityName: "Ангарск",
        image: null,
        tags: ["субботник", "волонтерство", "парк"],
        featured: false
    }
];

// Текущее состояние
let currentPage = 1;
const itemsPerPage = 6;
let filteredNews = [...newsData];

// Функция для форматирования даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Функция для создания HTML карточки новости
function createNewsCard(news) {
    const imageIcon = getCategoryIcon(news.category);
    
    return `
        <div class="news-card ${news.featured ? 'featured-news' : ''}" data-city="${news.city}" data-category="${news.category}">
            <div class="news-image">
                ${news.image ? 
                    `<img src="${news.image}" alt="${news.title}">` : 
                    `<div style="font-size: 4rem;">${imageIcon}</div>`
                }
                <div class="news-date">${formatDate(news.date)}</div>
            </div>
            
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-category">${news.categoryName}</span>
                    <span class="news-city">${news.cityName}</span>
                </div>
                
                <h3 class="news-title">
                    ${news.title}
                </h3>
                
                <div class="news-excerpt">
                    ${news.excerpt}
                </div>
                
                ${news.tags && news.tags.length > 0 ? `
                    <div class="news-tags">
                        ${news.tags.map(tag => `<span class="news-tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="news-footer">
                    <a href="#" class="read-more">Читать далее</a>
                </div>
            </div>
        </div>
    `;
}

// Функция для получения иконки по категории
function getCategoryIcon(category) {
    const icons = {
        'events': '🎪',
        'grants': '💰',
        'volunteers': '👥',
        'ecology': '🌱',
        'social': '❤️',
        'education': '📚',
        'culture': '🎭'
    };
    return icons[category] || '📰';
}

// Функция для показа модального окна
function showComingSoonModal() {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Функция для скрытия модального окна
function hideComingSoonModal() {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Функция для отображения карточек новостей
function renderNewsCards(newsList, page = 1) {
    const grid = document.getElementById('news-grid');
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newsToShow = newsList.slice(0, endIndex);
    
    if (newsToShow.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>Новости не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    // Сортируем: featured новости сначала
    const sortedNews = [...newsToShow].sort((a, b) => b.featured - a.featured);
    
    grid.innerHTML = sortedNews.map(news => createNewsCard(news)).join('');
    
    // Добавляем обработчики для кнопок "Читать далее"
    const readMoreButtons = grid.querySelectorAll('.read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoonModal();
        });
    });
    
    // Показываем/скрываем кнопку "Загрузить еще"
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        if (endIndex >= newsList.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
}

// Функция для фильтрации новостей
function filterNews() {
    const cityFilter = document.getElementById('filter-city').value;
    const categoryFilter = document.getElementById('filter-category').value;
    
    filteredNews = newsData.filter(news => {
        const cityMatch = !cityFilter || news.city === cityFilter || news.city === 'all';
        const categoryMatch = !categoryFilter || news.category === categoryFilter;
        return cityMatch && categoryMatch;
    });
    
    // Сортировка по дате (новые сначала)
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    currentPage = 1;
    renderNewsCards(filteredNews, currentPage);
}

// Функция для загрузки дополнительных новостей
function loadMoreNews() {
    currentPage++;
    renderNewsCards(filteredNews, currentPage);
}

// Функция для синхронизации фильтров в шапке и на странице
function syncCityFilters() {
    const headerCity = document.getElementById('header-city');
    const pageCity = document.getElementById('filter-city');
    
    if (headerCity && pageCity) {
        headerCity.addEventListener('change', function() {
            pageCity.value = this.value;
            filterNews();
        });
        
        pageCity.addEventListener('change', function() {
            headerCity.value = this.value;
            filterNews();
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация фильтров
    const filters = ['filter-city', 'filter-category'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', filterNews);
        }
    });
    
    // Синхронизация фильтров городов
    syncCityFilters();
    
    // Кнопка "Загрузить еще"
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNews);
    }
    
    // Обработчики для модального окна
    const modal = document.getElementById('coming-soon-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    
    if (closeModal) {
        closeModal.addEventListener('click', hideComingSoonModal);
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideComingSoonModal);
    }
    
    // Закрытие модального окна при клике вне его
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideComingSoonModal();
            }
        });
    }
    
    // Первоначальная загрузка данных
    filterNews();
    
    // Обработка фильтрации из главной страницы
    const urlParams = new URLSearchParams(window.location.search);
    const presetCity = urlParams.get('city');
    if (presetCity) {
        const citySelect = document.getElementById('filter-city');
        const headerCitySelect = document.getElementById('header-city');
        if (citySelect) citySelect.value = presetCity;
        if (headerCitySelect) headerCitySelect.value = presetCity;
        filterNews();
    }
});