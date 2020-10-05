from django.shortcuts import render
from django.shortcuts import render , redirect
import requests
import json
from django.core.cache import cache

# Create your views here.

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

            request.session["S"] = USER_CRED
            
            if(dataGet[0]['TIPO'] == 1):             
                print('WENA TIPO 1')
            
            if(dataGet[0]['TIPO'] == 2):
                return redirect(inicioCliente)
            
            if(dataGet[0]['TIPO'] == 3):
                print('WENA TIPO 3')
           
        
    return render(request,'core/login.html',  {'nbar': 'login'})
    

def registro(request):

    return render(request,'core/registro.html',  {'nbar': 'registro'})

def inicioCliente(request):
    #user = request.session['S']
    if 'S' in request.session:
        print('x')
    else:
        return redirect(login)
    if request.method == 'POST' and 'cerrar_session' :
        
        del request.session['S']
    return render(request,'core/vistaCliente/inicioCliente.html', {'nbar': 'inicioCliente'})
