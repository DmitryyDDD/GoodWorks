// Валидация формы регистрации
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const registerBtn = document.getElementById('register-btn');
    
    // Элементы формы
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const city = document.getElementById('city');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const agreeTerms = document.getElementById('agree-terms');
    
    // Маска для телефона
    if (phone) {
        phone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            
            let formattedValue = '+7 (';
            if (value.length > 0) {
                formattedValue += value.substring(0, 3);
            }
            if (value.length > 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length > 8) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Валидация в реальном времени
    firstName.addEventListener('blur', validateFirstName);
    lastName.addEventListener('blur', validateLastName);
    email.addEventListener('blur', validateEmail);
    phone.addEventListener('blur', validatePhone);
    city.addEventListener('change', validateCity);
    password.addEventListener('blur', validatePassword);
    confirmPassword.addEventListener('blur', validateConfirmPassword);
    agreeTerms.addEventListener('change', validateAgreeTerms);
    
    // Функции валидации
    function validateFirstName() {
        const value = firstName.value.trim();
        const errorElement = document.getElementById('first-name-error');
        
        if (!value) {
            showError(firstName, errorElement, 'Имя обязательно для заполнения');
            return false;
        }
        
        if (value.length < 2) {
            showError(firstName, errorElement, 'Имя должно содержать минимум 2 символа');
            return false;
        }
        
        showSuccess(firstName, errorElement);
        return true;
    }
    
    function validateLastName() {
        const value = lastName.value.trim();
        const errorElement = document.getElementById('last-name-error');
        
        if (!value) {
            showError(lastName, errorElement, 'Фамилия обязательна для заполнения');
            return false;
        }
        
        if (value.length < 2) {
            showError(lastName, errorElement, 'Фамилия должна содержать минимум 2 символа');
            return false;
        }
        
        showSuccess(lastName, errorElement);
        return true;
    }
    
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
    
    function validatePhone() {
        const value = phone.value.trim();
        const errorElement = document.getElementById('phone-error');
        
        if (value && !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value)) {
            showError(phone, errorElement, 'Введите корректный номер телефона');
            return false;
        }
        
        showSuccess(phone, errorElement);
        return true;
    }
    
    function validateCity() {
        const value = city.value;
        const errorElement = document.getElementById('city-error');
        
        if (!value) {
            showError(city, errorElement, 'Выберите ваш город');
            return false;
        }
        
        showSuccess(city, errorElement);
        return true;
    }
    
    function validatePassword() {
        const value = password.value;
        const errorElement = document.getElementById('password-error');
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        
        if (!value) {
            showError(password, errorElement, 'Пароль обязателен для заполнения');
            return false;
        }
        
        if (!passwordRegex.test(value)) {
            showError(password, errorElement, 'Пароль должен содержать минимум 8 символов, включая буквы и цифры');
            return false;
        }
        
        showSuccess(password, errorElement);
        return true;
    }
    
    function validateConfirmPassword() {
        const value = confirmPassword.value;
        const errorElement = document.getElementById('confirm-password-error');
        
        if (!value) {
            showError(confirmPassword, errorElement, 'Подтвердите пароль');
            return false;
        }
        
        if (value !== password.value) {
            showError(confirmPassword, errorElement, 'Пароли не совпадают');
            return false;
        }
        
        showSuccess(confirmPassword, errorElement);
        return true;
    }
    
    function validateAgreeTerms() {
        const errorElement = document.getElementById('agree-terms-error');
        
        if (!agreeTerms.checked) {
            showError(agreeTerms, errorElement, 'Необходимо согласие с правилами');
            return false;
        }
        
        showSuccess(agreeTerms, errorElement);
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
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация всех полей
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isCityValid = validateCity();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isAgreeTermsValid = validateAgreeTerms();
        
        const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && 
                          isPhoneValid && isCityValid && isPasswordValid && 
                          isConfirmPasswordValid && isAgreeTermsValid;
        
        if (isFormValid) {
            // Блокируем кнопку
            registerBtn.disabled = true;
            registerBtn.textContent = 'Регистрация...';
            
            // Имитация отправки данных
            setTimeout(() => {
                // В реальном приложении здесь будет AJAX запрос
                alert('Регистрация успешно завершена! Добро пожаловать в сообщество волонтеров Росатома.');
                window.location.href = 'personal.html';
            }, 2000);
        } else {
            // Прокрутка к первой ошибке
            const firstError = registerForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
    
    // Синхронизация выбора города с header
    const headerCity = document.getElementById('header-city');
    if (headerCity && city) {
        headerCity.addEventListener('change', function() {
            city.value = this.value;
            validateCity();
        });
        
        city.addEventListener('change', function() {
            headerCity.value = this.value;
        });
    }
});