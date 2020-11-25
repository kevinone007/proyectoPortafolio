from django.urls import path , include
from .views import home, login, registro, inicioCliente, modificarDatos, mataSesion,solicitarCapacitacion, addAsistente
from .API import Login, Comunas, Regiones, Rubros, Servicios, Asistentes, Capacitacion, InsertActividadCapacitacion, ACTIVIDADID

urlpatterns = [
    path('', home, name='home'),
    path('registro', registro, name='registro'),
    path('login', login, name='login'),
    path('API/Login/', Login.as_view()),
    path('API/Regiones/', Regiones.as_view()),
    path('API/Comunas/<pk>', Comunas.as_view()),
    path('API/Capacitacion/', Capacitacion.as_view()),
    path('API/ACTIVIDADID/<idEmpresa>', ACTIVIDADID.as_view()),
    path('API/InsertActividadCapacitacion/', InsertActividadCapacitacion.as_view()),
    path('API/Rubros', Rubros.as_view()),
    path('API/Servicios', Servicios.as_view()),
    path('API/Asistentes/', Asistentes.as_view()),
    path('solicitarCapacitacion', solicitarCapacitacion, name='solicitarCapacitacion'),
    path('inicioCliente', inicioCliente, name='inicioCliente'),
    path('modificarDatos', modificarDatos, name='modificarDatos'),
    path('addAsistente', addAsistente, name='addAsistente'),
    path('mataSesion', mataSesion, name='mataSesion')
]
