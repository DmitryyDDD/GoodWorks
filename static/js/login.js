// Валидация формы входа
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    
    // Элементы формы
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const rememberMe = document.getElementById('remember-me');
    
    // Валидация в реальном времени
    email.addEventListener('blur', validateEmail);
    password.addEventListener('blur', validatePassword);
    
    // Функции валидации
    function validateEmail() {
        const value = email.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value) {
            showError(email, errorElement, 'Email обязателен для заполнения');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            showError(email, errorElement, 'Введите корректный email адрес');
            return false;
        }
        
        showSuccess(email, errorElement);
        return true;
    }
    
    function validatePassword() {
        const value = password.value;
        const errorElement = document.getElementById('password-error');
        
        if (!value) {
            showError(password, errorElement, 'Пароль обязателен для заполнения');
            return false;
        }
        
        if (value.length < 6) {
            showError(password, errorElement, 'Пароль должен содержать минимум 6 символов');
            return false;
        }
        
        showSuccess(password, errorElement);
        return true;
    }
    
    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('show');
    }
    
    // Обработка отправки формы
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация всех полей
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        const isFormValid = isEmailValid && isPasswordValid;
        
        if (isFormValid) {
            // Блокируем кнопку
            loginBtn.disabled = true;
            loginBtn.textContent = 'Вход...';
            
            // Имитация отправки данных
            setTimeout(() => {
                // В реальном приложении здесь будет AJAX запрос
                // Для демонстрации - успешный вход
                simulateLogin();
            }, 1500);
        } else {
            // Прокрутка к первой ошибке
            const firstError = loginForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
    
    // Функция имитации входа
    function simulateLogin() {
        // Сохраняем данные для "запомнить меня"
        if (rememberMe.checked) {
            localStorage.setItem('rosatom_remember_email', email.value);
        } else {
            localStorage.removeItem('rosatom_remember_email');
        }
        
        // Сохраняем информацию о входе
        sessionStorage.setItem('rosatom_logged_in', 'true');
        sessionStorage.setItem('rosatom_user_email', email.value);
        
        // Показываем успешное сообщение
        showSuccessMessage();
        
        // Перенаправляем в личный кабинет
        setTimeout(() => {
            window.location.href = 'personal.html';
        }, 2000);
    }
    
    // Функция показа успешного сообщения
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'rosatom-success-message';
        successMessage.innerHTML = `
            <div class="rosatom-success-content">
                <div class="rosatom-success-icon">✅</div>
                <h4>Вход выполнен успешно!</h4>
                <p>Перенаправляем в личный кабинет...</p>
            </div>
        `;
        
        // Стили для сообщения
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            border: 2px solid #4caf50;
        `;
        
        document.body.appendChild(successMessage);
        
        // Автоматическое скрытие
        setTimeout(() => {
            successMessage.remove();
        }, 1900);
    }
    
    // Восстановление email если был выбран "запомнить меня"
    const rememberedEmail = localStorage.getItem('rosatom_remember_email');
    if (rememberedEmail) {
        email.value = rememberedEmail;
        rememberMe.checked = true;
        validateEmail();
    }
    
    // Автофокус на поле email
    email.focus();
});

// Добавляем стили для успешного сообщения
const successStyles = document.createElement('style');
successStyles.textContent = `
    .rosatom-success-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .rosatom-success-icon {
        font-size: 3rem;
    }
    
    .rosatom-success-content h4 {
        color: #4caf50;
        margin: 0;
        font-size: 1.3rem;
    }
    
    .rosatom-success-content p {
        color: #666;
        margin: 0;
    }
`;
document.head.appendChild(successStyles);