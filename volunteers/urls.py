from django.urls import path
from . import views

urlpatterns = [
    # Главная страница - ДОБАВЬТЕ ЭТУ СТРОКУ
    path('', views.home, name='home'),
    
    # Все остальные страницы
    path('nko/', views.nko_list, name='nko_list'),
    path('news/', views.news_list, name='news_list'),
    path('knowledge/', views.knowledge_base, name='knowledge_base'),
    path('calendar/', views.calendar_view, name='calendar'),
    path('personal/', views.personal_cabinet, name='personal'),
    path('register/', views.register, name='register'),
]