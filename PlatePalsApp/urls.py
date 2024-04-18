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
    path('api/create_room/', views.create_room, name='create_room'),
    path('api/update_room/', views.update_room, name='update_room'),
    path('api/add_member_to_room/', views.add_member_to_room, name='add_member_to_room'),
    path('api/fetch_members/', views.fetch_members, name='fetch_members'),
    path('api/cosine_sim/', views.cosine_sim, name='cosine_sim'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]


