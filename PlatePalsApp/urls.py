# from django.urls import path
#
# urlpatterns = [
#     path('', views.index, name='index'),
# ]

from django.urls import path, re_path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    # Other URL patterns
    path('', views.index, name='index'),
    path('api/cosine_sim/', views.cosine_sim, name='cosine_sim'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]


