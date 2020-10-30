from django.urls import path , include
from django.contrib import admin
from .views import home, login, registro, inicioCliente, modificarDatos, mataSesion
from .API import Login, Comunas, Regiones, Rubros, Servicios

urlpatterns = [
    path('', home, name='home'),
    path('registro', registro, name='registro'),
    path('login', login, name='login'),
    path('API/Login/', Login.as_view()),
    path('API/Regiones/', Regiones.as_view()),
    path('API/Comunas/<pk>', Comunas.as_view()),
    path('API/Rubros', Rubros.as_view()),
    path('API/Servicios', Servicios.as_view()),
    path('inicioCliente', inicioCliente, name='inicioCliente'),
    path('modificarDatos', modificarDatos, name='modificarDatos'),
    path('mataSesion', mataSesion, name='mataSesion')

]
