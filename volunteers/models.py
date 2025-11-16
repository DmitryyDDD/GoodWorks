from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Regions(models.Model):
    name_region = models.CharField(max_length=255, verbose_name="Название региона")
    
    class Meta:
        verbose_name = "Регион"
        verbose_name_plural = "Регионы"
    
    def __str__(self):
        return self.name_region

class Towns(models.Model):
    town = models.CharField(max_length=255, verbose_name="Название города")
    region = models.ForeignKey(Regions, on_delete=models.CASCADE, verbose_name="Регион")
    
    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"
    
    def __str__(self):
        return self.town

class Category(models.Model):
    category = models.CharField(max_length=255, verbose_name="Категория")
    
    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
    
    def __str__(self):
        return self.category

class Hashtags(models.Model):
    hashtag = models.CharField(max_length=255, verbose_name="Хэштег")
    
    class Meta:
        verbose_name = "Хэштег"
        verbose_name_plural = "Хэштеги"
    
    def __str__(self):
        return f"#{self.hashtag}"

class VolunteersUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь Django")
    surname = models.CharField(max_length=255, verbose_name="Фамилия")
    name = models.CharField(max_length=255, verbose_name="Имя")
    lastname = models.CharField(max_length=255, blank=True, verbose_name="Отчество")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Телефон")  # Изменено на CharField
    town = models.ForeignKey(Towns, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Город")
    
    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
    
    def __str__(self):
        return f"{self.surname} {self.name}"

class Base(models.Model):
    TYPE_CHOICES = [
        ('document', 'Документ'),
        ('video', 'Видео'),
        ('link', 'Ссылка'),
        ('article', 'Статья'),
    ]
    
    heading = models.CharField(max_length=255, verbose_name="Заголовок")
    description = models.TextField(verbose_name="Описание")
    link = models.URLField(blank=True, verbose_name="Ссылка", null=True)
    type = models.CharField(max_length=255, choices=TYPE_CHOICES, verbose_name="Тип")
    hashtags = models.ManyToManyField(Hashtags, through='BaseHashtags', verbose_name="Хэштеги")
    
    class Meta:
        verbose_name = "Материал базы знаний"
        verbose_name_plural = "База знаний"
    
    def __str__(self):
        return self.heading

class BaseHashtags(models.Model):
    base = models.ForeignKey(Base, on_delete=models.CASCADE, verbose_name="Материал")
    hashtag = models.ForeignKey(Hashtags, on_delete=models.CASCADE, verbose_name="Хэштег")
    
    class Meta:
        verbose_name = "Хэштег материала"
        verbose_name_plural = "Хэштеги материалов"
        unique_together = ['base', 'hashtag']
    
    def __str__(self):
        return f"{self.base.heading} - #{self.hashtag.hashtag}"

class Calendar(models.Model):
    town = models.ForeignKey(Towns, on_delete=models.CASCADE, verbose_name="Город")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категория")
    description = models.TextField(verbose_name="Описание")
    location = models.CharField(max_length=255, verbose_name="Место проведения")
    company = models.CharField(max_length=255, verbose_name="Организатор")
    time_start = models.TimeField(verbose_name="Время начала")
    time_end = models.TimeField(verbose_name="Время окончания")
    date = models.DateField(default=timezone.now, verbose_name="Дата мероприятия")
    participants = models.ManyToManyField(VolunteersUser, through='CalendarUsers', verbose_name="Участники")
    
    class Meta:
        verbose_name = "Мероприятие"
        verbose_name_plural = "Календарь мероприятий"
        ordering = ['date', 'time_start']
    
    def __str__(self):
        return f"{self.description[:50]}... ({self.town.town})"

class CalendarUsers(models.Model):
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE, verbose_name="Мероприятие")
    user = models.ForeignKey(VolunteersUser, on_delete=models.CASCADE, verbose_name="Пользователь")
    
    class Meta:
        verbose_name = "Участник мероприятия"
        verbose_name_plural = "Участники мероприятий"
        unique_together = ['calendar', 'user']
    
    def __str__(self):
        return f"{self.user} - {self.calendar}"

class News(models.Model):
    heading = models.CharField(max_length=255, verbose_name="Заголовок")
    description = models.TextField(verbose_name="Описание")
    town = models.ForeignKey(Towns, on_delete=models.CASCADE, verbose_name="Город")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категория")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Дата создания")
    hashtags = models.ManyToManyField(Hashtags, through='NewsHashtag', verbose_name="Хэштеги")
    
    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.heading

class NewsHashtag(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE, verbose_name="Новость")
    hashtag = models.ForeignKey(Hashtags, on_delete=models.CASCADE, verbose_name="Хэштег")
    
    class Meta:
        verbose_name = "Хэштег новости"
        verbose_name_plural = "Хэштеги новостей"
        unique_together = ['news', 'hashtag']
    
    def __str__(self):
        return f"{self.news.heading} - #{self.hashtag.hashtag}"

class NPO(models.Model):
    heading = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    town = models.ForeignKey(Towns, on_delete=models.CASCADE, verbose_name="Город")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категория")
    address = models.CharField(max_length=255, verbose_name="Адрес")
    phone = models.CharField(max_length=20, verbose_name="Телефон", null=True)  # Изменено на CharField
    link = models.URLField(blank=True, verbose_name="Сайт", null=True)
    vk_link = models.URLField(blank=True, verbose_name="VK", null=True)
    tg_link = models.URLField(blank=True, verbose_name="Telegram", null=True)
    latitude = models.FloatField(null=True, blank=True, verbose_name="Широта")  # width → latitude
    longitude = models.FloatField(null=True, blank=True, verbose_name="Долгота")  # longitude
    
    class Meta:
        verbose_name = "НКО"
        verbose_name_plural = "НКО"
    
    def __str__(self):
        return self.heading