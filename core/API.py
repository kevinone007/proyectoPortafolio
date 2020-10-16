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
        print(res)
        return HttpResponse(res, 'application/javascript')


class Regiones(APIView):
    def get(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        data = cursor.execute('select ID_REGION , DESCRIPCION ,ID_PAIS from region')
        lista = []
        for x in data:
            lista.append({'ID_REGION':x[0], 'DESCRIPCION':x[1], 'ID_PAIS':x[2]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

class Comunas(APIView):
    def get(self, request, pk):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        data = cursor.execute('select ID_COMUNA,DESCRIPCION,ID_REGION from comuna where ID_REGION = '+pk+'')
        lista = []
        for x in data:
            lista.append({'ID_COMUNA':x[0], 'DESCRIPCION':x[1], 'ID_REGION':x[2]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')

class Rubros(APIView):
    def get(self, request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        data = cursor.execute('select COD_RUBRO,DESCRIPCION from rubro')
        lista = []
        for x in data:
            lista.append({'COD_RUBRO':x[0], 'DESCRIPCION':x[1]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')
