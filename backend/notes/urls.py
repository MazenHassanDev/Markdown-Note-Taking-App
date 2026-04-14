from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_notes, name='list_notes'),
    path('save/', views.save_notes, name='save_notes'),
    path('<int:pk>/', views.get_single_note, name='get_single_note'),
    path('<int:pk>/edit/', views.update_note, name='update_note'),
    path('<int:pk>/delete/', views.delete_note, name='delete_note'),
    path('<int:pk>/grammar/', views.get_grammar_result, name='get_grammar_result'),
    path('<int:pk>/render/', views.render_note, name='render_note'),
]