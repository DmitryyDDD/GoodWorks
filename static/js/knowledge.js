// Данные материалов базы знаний
const knowledgeData = [
    {
        id: 1,
        title: "Основы волонтерской деятельности",
        description: "Полное руководство для начинающих волонтеров: права, обязанности, лучшие практики и безопасность.",
        type: "documents",
        typeName: "Документ",
        format: "PDF",
        size: "2.4 MB",
        date: "2025-11-14",
        tags: ["волонтерство", "руководство", "начало"],
        popular: true,
        fileUrl: "/materials/volunteer-basics.pdf",
        image: null
    },
    {
        id: 2,
        title: "Организация мероприятий: от идеи до реализации",
        description: "Видеоурок о том как правильно планировать и проводить социальные мероприятия.",
        type: "video",
        typeName: "Видео",
        duration: "15:30",
        date: "2025-11-10",
        tags: ["мероприятия", "организация", "планирование"],
        popular: true,
        videoUrl: "https://example.com/video1",
        image: null
    }
];

// Текущее состояние
let currentCategory = 'all';
let currentSearch = '';

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

// Функция для форматирования даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Функция для получения иконки по типу материала
function getMaterialIcon(type) {
    const icons = {
        'video': '🎥',
        'documents': '📄',
        'presentations': '📊',
        'instructions': '📋'
    };
    return icons[type] || '📚';
}

// Функция для создания HTML карточки материала
function createMaterialCard(material) {
    const isVideo = material.type === 'video';
    const materialIcon = getMaterialIcon(material.type);
    
    return `
        <div class="material-card" data-type="${material.type}">
            <div class="material-header">
                <div class="material-image">
                    ${material.image ? 
                        `<img src="${material.image}" alt="${material.title}">` : 
                        `<div>${materialIcon}</div>`
                    }
                </div>
                <div class="material-type">${material.typeName}</div>
            </div>
            
            <div class="material-content">
                <h3 class="material-title">
                    ${material.title}
                </h3>
                
                <div class="material-description">
                    ${material.description}
                </div>
                
                <div class="material-tags">
                    ${material.tags.map(tag => `<span class="material-tag">#${tag}</span>`).join('')}
                </div>
                
                <div class="material-meta">
                    <span class="material-date">${formatDate(material.date)}</span>
                </div>
                
                <div class="material-actions">
                    ${isVideo ? `
                        <button class="watch-btn" onclick="showComingSoonModal()">
                            ▶ Смотреть
                        </button>
                        <button class="preview-btn" onclick="showComingSoonModal()">
                            📋 Описание
                        </button>
                    ` : `
                        <button class="download-btn" onclick="showComingSoonModal()">
                            📥 Скачать
                        </button>
                        <button class="preview-btn" onclick="showComingSoonModal()">
                            👁️ Просмотр
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

// Функция для отображения карточек материалов
function renderMaterials(materials) {
    const grid = document.getElementById('materials-grid');
    
    if (materials.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <h3>Материалы не найдены</h3>
                <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = materials.map(material => createMaterialCard(material)).join('');
}

// Функция для фильтрации материалов
function filterMaterials() {
    let filtered = knowledgeData;
    
    // Фильтрация по категории
    if (currentCategory !== 'all') {
        filtered = filtered.filter(material => material.type === currentCategory);
    }
    
    // Фильтрация по поиску
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(material => 
            material.title.toLowerCase().includes(searchLower) ||
            material.description.toLowerCase().includes(searchLower) ||
            material.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    renderMaterials(filtered);
}

// Функция для переключения категорий
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убрать активный класс у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Добавить активный класс текущей кнопке
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            filterMaterials();
        });
    });
}

// Функция для настройки поиска
function setupSearch() {
    const searchInput = document.getElementById('knowledge-search');
    const searchBtn = document.querySelector('.search-btn');
    
    const performSearch = () => {
        currentSearch = searchInput.value.trim();
        filterMaterials();
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
    
    // Поиск при нажатии Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Настройка фильтров
    setupCategoryFilters();
    setupSearch();
    
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
    setTimeout(() => {
        renderMaterials(knowledgeData);
    }, 500);
    
    // Обработка фильтрации из URL
    const urlParams = new URLSearchParams(window.location.search);
    const presetCategory = urlParams.get('category');
    if (presetCategory) {
        const categoryBtn = document.querySelector(`[data-category="${presetCategory}"]`);
        if (categoryBtn) {
            categoryBtn.click();
        }
    }
});