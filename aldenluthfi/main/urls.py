from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.main, name='main'),
    path('toggle-language/', views.toggle_language, name='toggle-language')
]
