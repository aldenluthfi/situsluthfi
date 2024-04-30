from django.urls import path
from . import views

app_name = 'articles'

urlpatterns = [
    path('articles/', views.glossary, name='glossary'),
    path('<slug:hash>/', views.article, name='article'),
]
