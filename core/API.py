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
        data = request.data 
        USER_CRED = data['USER_CRED'] 
        PASSWORD = data['PASSWORD'] 
        query = "select count(ID_CREDENCIAL) from CREDENCIAL where USER_CRED = '%s' and PASSWORD = '%s'"  %(USER_CRED , PASSWORD)
        data = cursor.execute(query)
        lista = []
        for x in data:
            lista.append({'respuesta':x[0]})
        res = json.dumps(lista)
        print(lista)
        return HttpResponse(res, 'application/javascript')


        """ /////////////////////////////////////////////////////////////////////////////////////////////////////// """
        """ ////////////////////////////////////QUERY PARA OBTENER todo EL OBJETO DEL USUARIO////////////////////// """
        """ /////////////////////////////////////////////////////////////////////////////////////////////////////// """

    def get(self ,request):
        django_cursor = connection.cursor()
        cursor = django_cursor.connection.cursor()
        data = request.data 
        USER_CRED = data['USER_CRED'] 
        PASSWORD = data['PASSWORD'] 
        query2 = "select * from CREDENCIAL where USER_CRED = '%s' and PASSWORD = '%s'"  %(USER_CRED , PASSWORD)
        data2 = cursor.execute(query2)
        lista2 = []
        for x in data2:
            lista2.append({'ID_CREDENCIAL':x[0],'USER_CRED':x[1],'PASSWORD':x[2],'ID_ROL':x[3],'ID_EST_CREDEN':x[4],'ID_PROFESIONAL':x[5],'ID_CLIENTE':x[6]})
        res2 = json.dumps(lista2)
        print(res2)
        return HttpResponse(res2, 'application/javascript')
        


