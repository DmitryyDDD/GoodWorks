// Данные НКО (в реальном приложении будут загружаться с сервера)
const nkoData = [
    {
        id: 1,
        name: "Фонд помощи детям 'Надежда'",
        category: "social",
        categoryName: "Социальная защита",
        city: "volgodonsk",
        cityName: "Волгодонск",
        description: "Оказываем помощь детям из малообеспеченных семей, организуем образовательные программы и досуговые мероприятия для детей с ограниченными возможностями.",
        address: "ул. Ленина, 123",
        phone: "+7 (863) 123-45-67",
        website: "https://nadezhda-fund.ru",
        vk: "https://vk.com/nadezhda_volgodonsk",
        telegram: "https://t.me/nadezhda_fund",
        coordinates: [47.5167, 42.1514] // Широта, долгота Волгодонска
    },
    {
        id: 2,
        name: "Экологический центр 'Зеленая планета'",
        category: "ecology",
        categoryName: "Экология",
        city: "novouralsk",
        cityName: "Новоуральск",
        description: "Занимаемся охраной окружающей среды, проводим экологические акции, образовательные программы по экологии для детей и взрослых.",
        address: "ул. Мира, 45",
        phone: "+7 (343) 234-56-78",
        website: "https://greenplanet-eco.ru",
        vk: "https://vk.com/greenplanet_novouralsk",
        telegram: "https://t.me/greenplanet_eco",
        coordinates: [57.2439, 60.0839] // Новоуральск
    },
    {
        id: 3,
        name: "Центр развития молодежи 'Перспектива'",
        category: "youth",
        categoryName: "Молодежная политика",
        city: "obninsk",
        cityName: "Обнинск",
        description: "Развиваем молодежные инициативы, проводим образовательные программы, форумы и конкурсы для талантливой молодежи.",
        address: "пр. Ленина, 78",
        phone: "+7 (484) 345-67-89",
        website: "https://perspektiva-youth.ru",
        vk: "https://vk.com/perspektiva_obninsk",
        telegram: "https://t.me/perspektiva_youth",
        coordinates: [55.0968, 36.6101] // Обнинск
    },
    {
        id: 4,
        name: "Спортивный клуб 'Энергия'",
        category: "sport",
        categoryName: "Спорт",
        city: "sosnovy_bor",
        cityName: "Сосновый Бор",
        description: "Популяризируем здоровый образ жизни, организуем спортивные секции и соревнования для всех возрастных групп.",
        address: "ул. Спортивная, 12",
        phone: "+7 (813) 456-78-90",
        website: "https://energia-sport.ru",
        vk: "https://vk.com/energia_sosnovybor",
        telegram: "https://t.me/energia_sport",
        coordinates: [59.8833, 29.0861] // Сосновый Бор
    },
    {
        id: 5,
        name: "Культурный фонд 'Наследие'",
        category: "culture",
        categoryName: "Культура",
        city: "glazov",
        cityName: "Глазов",
        description: "Сохраняем и популяризируем культурное наследие региона, организуем выставки, концерты и фестивали.",
        address: "ул. Советская, 25",
        phone: "+7 (341) 567-89-01",
        website: "https://nasledie-culture.ru",
        vk: "https://vk.com/nasledie_glazov",
        telegram: "https://t.me/nasledie_culture",
        coordinates: [58.1350, 52.6550] // Глазов
    }
];

// Переменные для карты
let map;
let currentView = 'list';

// Функция для создания HTML карточки НКО
function createNkoCard(nko) {
    return `
        <div class="nko-card" data-city="${nko.city}" data-category="${nko.category}">
            <div class="nko-card-header">
                <div class="nko-title">
                    <h3><a href="#" class="nko-link" data-nko-id="${nko.id}">${nko.name}</a></h3>
                    <div class="nko-meta">
                        <span class="nko-category">${nko.categoryName}</span>
                        <span class="nko-city">${nko.cityName}</span>
                    </div>
                </div>
            </div>
            
            <div class="nko-description">
                ${nko.description}
            </div>
            
            <div class="nko-contacts">
                ${nko.address ? `<div class="nko-address">${nko.address}</div>` : ''}
                ${nko.phone ? `<div class="nko-phone">${nko.phone}</div>` : ''}
            </div>
            
            <div class="nko-social">
                ${nko.website ? `<a href="${nko.website}" target="_blank">Сайт</a>` : ''}
                ${nko.vk ? `<a href="${nko.vk}" target="_blank">ВКонтакте</a>` : ''}
                ${nko.telegram ? `<a href="${nko.telegram}" target="_blank">Telegram</a>` : ''}
            </div>
        </div>
    `;
}

// Функция для отображения карточек НКО
function renderNkoCards(nkoList) {
    const grid = document.getElementById('nko-grid');
    
    if (nkoList.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>Организации не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = nkoList.map(nko => createNkoCard(nko)).join('');
    
    // Добавляем обработчики событий для ссылок НКО
    addNkoLinkHandlers();
}

// Функция для добавления обработчиков на ссылки НКО
function addNkoLinkHandlers() {
    const nkoLinks = document.querySelectorAll('.nko-link');
    
    nkoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showDevelopmentModal();
        });
    });
}

// Функция для показа модального окна "В разработке"
function showDevelopmentModal() {
    // Создаем модальное окно, если его еще нет
    let modal = document.getElementById('developmentModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'developmentModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-icon">🚧</div>
                <h3>В разработке</h3>
                <p>Данная страница находится в разработке. Приносим извинения за временные неудобства!</p>
                <button class="modal-close-btn">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Добавляем обработчики для закрытия модального окна
        const closeBtn = modal.querySelector('.close-modal');
        const closeModalBtn = modal.querySelector('.modal-close-btn');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Закрытие при клике вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Закрытие при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }
    
    // Показываем модальное окно
    modal.style.display = 'flex';
}

// Функция инициализации карты
function initMap() {
    if (!window.ymaps) {
        console.error('Yandex Maps API не загружена');
        return;
    }

    ymaps.ready(function() {
        // Создаем карту
        map = new ymaps.Map('yandex-map', {
            center: [55.76, 37.64], // Москва по умолчанию
            zoom: 5,
            controls: ['zoomControl', 'fullscreenControl']
        });

        // Добавляем метки организаций
        addNkoMarkersToMap();
    });
}

// Функция добавления меток на карту
function addNkoMarkersToMap() {
    if (!map) return;

    // Очищаем старые метки
    map.geoObjects.removeAll();

    const filteredNko = getFilteredNko();
    
    // Если нет организаций после фильтрации, показываем сообщение
    if (filteredNko.length === 0) {
        const noResults = new ymaps.Placemark(
            [55.76, 37.64],
            {
                balloonContent: 'Организации не найдены. Попробуйте изменить параметры фильтрации.'
            },
            {
                preset: 'islands#redIcon',
                iconColor: '#ff0000'
            }
        );
        map.geoObjects.add(noResults);
        return;
    }
    
    let hasMarkers = false;
    
    filteredNko.forEach(nko => {
        if (nko.coordinates && nko.coordinates.length === 2) {
            hasMarkers = true;
            const marker = new ymaps.Placemark(
                nko.coordinates,
                {
                    balloonContent: `
                        <div class="map-balloon">
                            <h3>${nko.name}</h3>
                            <p><strong>${nko.categoryName}</strong> • ${nko.cityName}</p>
                            <p>${nko.description}</p>
                            ${nko.address ? `<p>📍 ${nko.address}</p>` : ''}
                            ${nko.phone ? `<p>📞 ${nko.phone}</p>` : ''}
                            <div class="map-balloon-actions">
                                <button onclick="showNkoDetails(${nko.id})" class="map-btn">Подробнее</button>
                            </div>
                        </div>
                    `
                },
                {
                    preset: 'islands#blueIcon',
                    balloonCloseButton: true
                }
            );

            map.geoObjects.add(marker);
        }
    });

    // Если есть метки, устанавливаем границы карты
    if (hasMarkers) {
        const coordinates = filteredNko
            .filter(nko => nko.coordinates && nko.coordinates.length === 2)
            .map(nko => nko.coordinates);
        
        if (coordinates.length > 0) {
            map.setBounds(map.geoObjects.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 50
            });
        }
    }
}

// Функция переключения между списком и картой
function toggleView(view) {
    currentView = view;
    const listSection = document.getElementById('list-section');
    const mapSection = document.getElementById('map-section');
    const listBtn = document.getElementById('list-view');
    const mapBtn = document.getElementById('map-view');

    if (view === 'list') {
        listSection.style.display = 'block';
        mapSection.style.display = 'none';
        listBtn.classList.add('active');
        mapBtn.classList.remove('active');
    } else {
        listSection.style.display = 'none';
        mapSection.style.display = 'block';
        listBtn.classList.remove('active');
        mapBtn.classList.add('active');
        
        // Инициализируем карту если она еще не создана
        if (!map && window.ymaps) {
            initMap();
        } else if (map) {
            // Обновляем метки на карте при переключении
            addNkoMarkersToMap();
        }
    }
}

// Функция для получения отфильтрованных НКО
function getFilteredNko() {
    const cityFilter = document.getElementById('filter-city').value;
    const categoryFilter = document.getElementById('filter-category').value;
    
    return nkoData.filter(nko => {
        const cityMatch = !cityFilter || nko.city === cityFilter;
        const categoryMatch = !categoryFilter || nko.category === categoryFilter;
        return cityMatch && categoryMatch;
    });
}

// Функция для показа деталей НКО
function showNkoDetails(nkoId) {
    showDevelopmentModal();
}

// Функция для фильтрации НКО
function filterNko() {
    if (currentView === 'list') {
        const filteredNko = getFilteredNko();
        renderNkoCards(filteredNko);
    } else {
        addNkoMarkersToMap();
    }
}

// Функция для синхронизации фильтров в шапке и на странице
function syncCityFilters() {
    const headerCity = document.getElementById('header-city');
    const pageCity = document.getElementById('filter-city');
    
    if (headerCity && pageCity) {
        headerCity.addEventListener('change', function() {
            pageCity.value = this.value;
            filterNko();
        });
        
        pageCity.addEventListener('change', function() {
            headerCity.value = this.value;
            filterNko();
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
            filter.addEventListener('change', filterNko);
        }
    });
    
    // Синхронизация фильтров городов
    syncCityFilters();
    
    // Обработчики для переключателя вида
    document.getElementById('list-view').addEventListener('click', () => toggleView('list'));
    document.getElementById('map-view').addEventListener('click', () => toggleView('map'));
    
    // Первоначальная загрузка данных
    setTimeout(() => {
        renderNkoCards(nkoData);
    }, 500);
    
    // Обработка фильтрации из главной страницы
    const urlParams = new URLSearchParams(window.location.search);
    const presetCity = urlParams.get('city');
    if (presetCity) {
        const citySelect = document.getElementById('filter-city');
        const headerCitySelect = document.getElementById('header-city');
        if (citySelect) citySelect.value = presetCity;
        if (headerCitySelect) headerCitySelect.value = presetCity;
        filterNko();
    }
    
    // Предзагрузка API карт
    if (window.ymaps) {
        ymaps.ready(() => {
            console.log('Yandex Maps API загружена');
        });
    }
});

// Функция для поиска НКО (можно добавить поисковую строку)
function searchNko(query) {
    const filtered = nkoData.filter(nko => 
        nko.name.toLowerCase().includes(query.toLowerCase()) ||
        nko.description.toLowerCase().includes(query.toLowerCase()) ||
        nko.categoryName.toLowerCase().includes(query.toLowerCase())
    );
    
    if (currentView === 'list') {
        renderNkoCards(filtered);
    } else {
        // Для карты можно добавить фильтрацию меток
        addNkoMarkersToMap();
    }
}