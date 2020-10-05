from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import json
from jsonify import convert



django_cursor = connection.cursor()
cursor = django_cursor.connection.cursor()

class Login(APIView):

    def post(self ,request):

        out_cur = django_cursor.connection.cursor()

        data = request.data 
        USER_CRED = data['USER_CRED'] 
        PASSWORD = data['PASSWORD'] 
        cursor.callproc("SP_LOGIN_0",[USER_CRED,PASSWORD,out_cur])
        lista = []
        
        for x in out_cur:
            lista.append({'RES':x[1],'TIPO':x[2]})

        if(len(lista) == 0):
            res = json.dumps([{'RES':0}])
        else:
            res = json.dumps(lista)

        return HttpResponse(res, 'application/javascript')

