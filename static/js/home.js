// Базовый функционал для фильтрации и динамического контента
document.addEventListener('DOMContentLoaded', function() {
    // Фильтрация по городам - обновляем селектор для работы с header-city
    const citySelectors = document.querySelectorAll('select[id*="city"]');
    
    citySelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const selectedCity = this.value;
            filterContentByCity(selectedCity);
        });
    });

    // Фильтрация НКО
    // Функция для фильтрации контента по городу (общая для всех страниц)
// Функция для фильтрации контента по городу (общая для всех страниц)
// Функция для фильтрации контента по городу (общая для всех страниц)
function filterContentByCity(city) {
    // Для страницы НКО
    const nkoCards = document.querySelectorAll('.nko-card');
    if (nkoCards.length > 0) {
        nkoCards.forEach(card => {
            const cardCity = card.getAttribute('data-city');
            if (!city || cardCity === city) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Для страницы новостей
    const newsCards = document.querySelectorAll('.news-card');
    if (newsCards.length > 0) {
        newsCards.forEach(card => {
            const cardCity = card.getAttribute('data-city');
            if (!city || cardCity === city || cardCity === 'all') {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Для страницы календаря
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length > 0) {
        eventCards.forEach(card => {
            // Для календаря фильтрация обрабатывается в calendar.js
        });
    }
    
    // Обновляем селекторы на странице
    const pageCitySelectors = document.querySelectorAll('#filter-city, #header-city');
    pageCitySelectors.forEach(selector => {
        if (selector) selector.value = city;
    });
}

    // Категории в базе знаний
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убрать активный класс у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Добавить активный класс текущей кнопке
            this.classList.add('active');
            
            const category = this.textContent.toLowerCase();
            filterMaterials(category);
        });
    });

    function filterMaterials(category) {
        const materials = document.querySelectorAll('.material-card');
        
        materials.forEach(material => {
            if (category === 'все материалы') {
                material.style.display = 'block';
            } else {
                const materialType = material.classList[1]; // video, document, etc.
                if (materialType === category) {
                    material.style.display = 'block';
                } else {
                    material.style.display = 'none';
                }
            }
        });
    }

    // Имитация загрузки данных
    function loadNKOData() {
        // В реальном приложении здесь был бы fetch запрос к API
        console.log('Загрузка данных НКО...');
    }

    // Инициализация
    loadNKOData();
});