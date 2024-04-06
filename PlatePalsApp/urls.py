# from django.urls import path
# from . import views
#
# urlpatterns = [
#     path('', views.index, name='index'),
# ]

from django.urls import path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    # Other URL patterns
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]


