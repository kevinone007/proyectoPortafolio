from django.urls import path , include
from django.contrib import admin
from .views import home, login, registro, inicioCliente, solicitarVisita, mataSesion
from .API import Login

#from core.view.registro import registro

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('registro', registro, name='registro'),
    path('login', login, name='login'),
    path('API/Login/', Login.as_view()),
    path('inicioCliente', inicioCliente, name='inicioCliente'),
    path('solicitarVisita', solicitarVisita, name='solicitarVisita'),
    path('mataSesion', mataSesion, name='mataSesion')

]
