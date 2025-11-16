from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def home(request):
    """Главная страница"""
    return render(request, 'home.html')

def nko_list(request):
    """Страница списка НКО"""
    return render(request, 'nko.html')

def news_list(request):
    """Страница новостей"""
    return render(request, 'news.html')

def knowledge_base(request):
    """База знаний"""
    return render(request, 'knowledge.html')

def calendar_view(request):
    """Календарь событий"""
    return render(request, 'calendar.html')

def personal_cabinet(request):
    """Личный кабинет"""
    return render(request, 'personal.html')

def register(request):
    """Регистрация"""
    return render(request, 'register.html')

@login_required
def personal_cabinet(request):
    """Личный кабинет (только для авторизованных)"""
    return render(request, 'personal.html', {
        'user': request.user
    })