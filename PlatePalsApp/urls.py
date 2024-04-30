from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/cosine_sim/', views.cosine_sim, name='cosine_sim'),
]

