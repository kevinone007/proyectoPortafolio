from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import json
from jsonify import convert

class Login(APIView):

    def post(self ,request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()

        data = request.data 
        USER_CRED = data['USER_CRED'] 
        PASSWORD = data['PASSWORD'] 
        cursor.callproc("SP_LOGIN",[USER_CRED,PASSWORD,out_cur])
        lista = []
        
        for x in out_cur:
            lista.append({'RES':x[0], 'id_credencial':x[1], 'user_cred':x[2], 'password':x[3] ,'id_rol':x[4], 'id_est_creden':x[5], 'id_profesional':x[6], 'id_cliente':x[7]})
        if(len(lista) == 0):
            res = json.dumps([{'RES':0}])
        else:
            res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')


class Regiones(APIView):
    def get(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_REGIONES',[out_cur])
        lista = []
        for x in out_cur:
            lista.append({'ID_REGION':x[0], 'DESCRIPCION':x[1], 'ID_PAIS':x[2]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

class Comunas(APIView):
    def get(self, request, pk):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_COMUNAS',[ pk,out_cur])
        lista = []
        for x in out_cur:
            lista.append({'ID_COMUNA':x[0], 'DESCRIPCION':x[1], 'ID_REGION':x[2]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

class Servicios(APIView):
    def get(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_SERVICIOS',[out_cur])
        lista = []
        for x in out_cur:
            lista.append({'ID_SERVICIO':x[0], 'NOMBRE':x[1]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

class Rubros(APIView):
    def get(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_RUBROS',[out_cur])
        lista = []
        for x in out_cur:
            lista.append({'COD_RUBRO':x[0], 'DESCRIPCION':x[1]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

        
class Asistentes(APIView):
    def get(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_ASISTENTES',[out_cur])
        lista = []
        for x in out_cur:
            lista.append({'ID_ASISTENTE':x[0], 'RUT_TRABAJADOR':x[1], 'NOMBRE':x[2], 'AP_PAT':x[3], 'AP_MAT':x[4], 'NUM_ACCIDENTE':x[5], 'NUM_ACC_POST_CAP':x[6], 'FEC_CAPACITACION':str(x[7]), 'ID_CLIENTE':x[8], 'ID_GENERO':x[9], 'ID_COMUNA':x[10]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

class Capacitacion(APIView):
    def post(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        data = request.data 
        fecha = data['fecha'] 
        idUSER = data['idUSER'] 
        idActividad = data['idActividad']
        cursor.callproc('SPD_CAPACITACION',[fecha,idUSER,idActividad])
        return HttpResponse('application/javascript')

class InsertActividadCapacitacion(APIView):
    def post(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        data = request.data 
        fecha = data['fecha'] 
        idCliente = data['idCliente'] 
        cursor.callproc('SPD_INSERTACTIVIDADCAPACITACION',[str(fecha),idCliente])
        return HttpResponse('application/javascript')

class ACTIVIDADID(APIView):
    def get(self, request, idEmpresa):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_ACTIVIDADID',[idEmpresa,out_cur])
        lista = []
        for x in out_cur:
            lista.append({'ID_ASISTENTE':x[0]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

class RUTASISTENTE(APIView):
    def get(self, request, rutsito):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_RUTASISTENTE',[rutsito,out_cur])
        lista = []
        for x in out_cur:
            lista.append({'RESULTADO':x[0]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')
        
class RUTEMPRESA(APIView):
    def get(self, request, rutsito):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        out_cur = django_cursor.connection.cursor()
        cursor.callproc('SPD_RUTEMPRESA',[rutsito,out_cur])
        lista = []
        for x in out_cur:
            lista.append({'RESULTADO':x[0]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')