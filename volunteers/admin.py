from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import *


class VolunteersUserInline(admin.StackedInline):
    model = VolunteersUser
    can_delete = False
    verbose_name_plural = 'Дополнительная информация'

class CustomUserAdmin(UserAdmin):
    inlines = (VolunteersUserInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_city', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    
    def get_city(self, obj):
        try:
            return obj.volunteersuser.town
        except VolunteersUser.DoesNotExist:
            return "Не указан"
    get_city.short_description = 'Город'

# Регистрируем модели
@admin.register(Regions)
class RegionsAdmin(admin.ModelAdmin):
    list_display = ['name_region', 'id']
    search_fields = ['name_region']
    list_per_page = 20

@admin.register(Towns)
class TownsAdmin(admin.ModelAdmin):
    list_display = ['town', 'region', 'id']
    list_filter = ['region']
    search_fields = ['town']
    list_per_page = 20

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['category', 'id']
    search_fields = ['category']
    list_per_page = 20

@admin.register(Hashtags)
class HashtagsAdmin(admin.ModelAdmin):
    list_display = ['hashtag', 'id']
    search_fields = ['hashtag']
    list_per_page = 20

@admin.register(VolunteersUser)
class VolunteersUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'surname', 'name', 'lastname', 'email', 'phone', 'town']
    list_filter = ['town']
    search_fields = ['surname', 'name', 'lastname', 'email', 'phone']
    raw_id_fields = ['user', 'town']
    list_per_page = 20
    
    def email(self, obj):
        return obj.user.email
    email.short_description = 'Email'

@admin.register(Base)
class BaseAdmin(admin.ModelAdmin):
    list_display = ['heading', 'type', 'link', 'created_at']
    list_filter = ['type']  # Убрали 'hashtags' из list_filter
    search_fields = ['heading', 'description']
    readonly_fields = ['created_at']
    list_per_page = 20
    
    def created_at(self, obj):
        return obj.id  # Временное поле, можно заменить на реальное created_at
    created_at.short_description = 'ID'

@admin.register(BaseHashtags)
class BaseHashtagsAdmin(admin.ModelAdmin):
    list_display = ['base', 'hashtag']
    list_filter = ['hashtag']
    search_fields = ['base__heading', 'hashtag__hashtag']
    raw_id_fields = ['base', 'hashtag']
    list_per_page = 20

@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
    list_display = ['description', 'town', 'category', 'company', 'date', 'time_start', 'time_end']
    list_filter = ['town', 'category', 'date']
    search_fields = ['description', 'location', 'company']
    raw_id_fields = ['town', 'category']
    date_hierarchy = 'date'
    list_per_page = 20

@admin.register(CalendarUsers)
class CalendarUsersAdmin(admin.ModelAdmin):
    list_display = ['calendar', 'user']
    list_filter = ['calendar__town', 'calendar__date']
    search_fields = ['calendar__description', 'user__surname', 'user__name']
    raw_id_fields = ['calendar', 'user']
    list_per_page = 20

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['heading', 'town', 'category', 'created_at']
    list_filter = ['town', 'category', 'created_at']
    search_fields = ['heading', 'description']
    raw_id_fields = ['town', 'category']
    date_hierarchy = 'created_at'
    list_per_page = 20

@admin.register(NewsHashtag)
class NewsHashtagAdmin(admin.ModelAdmin):
    list_display = ['news', 'hashtag']
    list_filter = ['hashtag']
    search_fields = ['news__heading', 'hashtag__hashtag']
    raw_id_fields = ['news', 'hashtag']
    list_per_page = 20

@admin.register(NPO)
class NPOAdmin(admin.ModelAdmin):
    list_display = ['heading', 'town', 'category', 'phone', 'link']
    list_filter = ['town', 'category']
    search_fields = ['heading', 'description', 'address', 'phone']
    raw_id_fields = ['town', 'category']
    list_per_page = 20
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('heading', 'description', 'town', 'category')
        }),
        ('Контакты', {
            'fields': ('address', 'phone', 'link', 'vk_link', 'tg_link')
        }),
        ('Координаты', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        })
    )

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


admin.site.site_header = "АтомДобро - Панель управления"
admin.site.site_title = "АтомДобро"
admin.site.index_title = "Добро пожаловать в панель управления АтомДобро"