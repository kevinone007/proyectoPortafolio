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
        #query = "call SP_AUTENTICAR_USUARIO('%s', '%s', O_RESULT)"  %(USER_CRED , PASSWORD)
        #query = "SP_AUTENTICAR_USUARIO"
        data = cursor.execute(query)
        lista = []
        for x in data:
            lista.append({'respuesta':x[0]})
        res = json.dumps(lista)
        return HttpResponse(res, 'application/javascript')
