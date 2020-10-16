from django.shortcuts import render
from django.shortcuts import render , redirect
import requests
import json
from django.db import connection
from django.core.cache import cache

# Create your views here.

django_cursor = connection.cursor()
cursor = django_cursor.connection.cursor()


def home(request):
    return render(request,'core/home.html', {'nbar': 'home'})

def login(request):

    if "S" in request.session:
        return redirect(home)
    
    if request.method == 'POST' :

        USER_CRED = request.POST.get('TXT_CRED')
        PASSWORD = request.POST.get('TXT_PASS')

        dataSet = {'USER_CRED':USER_CRED,'PASSWORD':PASSWORD}
        url = 'http://127.0.0.1:8000/API/Login/'
        res = requests.post(url, dataSet)

        dataGet = json.loads(res.text)


        if dataGet[0]['RES'] == 0:
            data = {'msj': "Credenciales Erroneas"}
            return render(request,'core/login.html', data)
        else:
            if(dataGet[0]['id_est_creden'] == 2):
                data = {'msj': "Cuenta Bloqueada, contacte al administrador"}
                return render(request,'core/login.html', data)
            else:
                request.session["S"] = USER_CRED
                
                if(dataGet[0]['id_rol'] == 1):             
                    data = {'msj': "Usted es administrador, debe iniciar sesion en el sistema de escritorio."}
                    return render(request,'core/login.html', data)
                
                if(dataGet[0]['id_rol'] == 2):
                    return redirect(inicioCliente)

                if(dataGet[0]['id_rol'] == 3):
                    print('WENA TIPO 3')    

    return render(request,'core/login.html',  {'nbar': 'login'})
    

def registro(request):

    return render(request,'core/registro.html',  {'nbar': 'registro'})

def retornaDataUsuarioCliente(USER):
    out_cur = django_cursor.connection.cursor()
    cursor.callproc("SPD_GETDATAUSUARIO",[USER, out_cur])
    lista = []
    for x in out_cur:
            lista.append({'id_credencial':x[0], 'user_cred':x[1], 'password':x[2] ,'id_rol':x[3], 'id_est_creden':x[4], 'id_profesional':x[5], 'id_cliente':x[6]})
    return lista

def mataSesion(request):
    if 'S' in request.session:
        del request.session['S']
        return redirect(login)




def inicioCliente(request):
    if 'S' in request.session:
        print('Usuario loggeado')
    else:
        return redirect(login)
    lista = retornaDataUsuarioCliente(request.session['S'])
    IDCLIENTE = lista[0]['id_cliente']
    out_cur = django_cursor.connection.cursor()
    cursor.callproc("SPD_ACTIVIDADES",[IDCLIENTE, out_cur])
    actividades = []
    for x in out_cur:
            actividades.append({'NOMBRE':x[0], 'FECHA':x[1], 'PROFESIONAL':x[2] ,'DESCRIPCION':x[3]})
    data = {'data': lista[0], 'actividad': actividades } #cuando viene con [0] es un array y cuando viene solo es un objeto, el cual es iterable por el FOR 
    return render(request,'core/vistaCliente/inicioCliente.html', data)



    

def solicitarVisita(request):
    lista = retornaDataUsuarioCliente(request.session['S'])
    data = {'data': lista[0] }
    return render(request, 'core/vistaCliente/solicitarVisita.html', data)