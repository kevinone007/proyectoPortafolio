from django.shortcuts import render
from django.shortcuts import render , redirect
import requests
import json

# Create your views here.

def home(request):
    return render(request,'core/home.html', {'nbar': 'home'})

def login(request):
    if request.method == 'POST' :
        USER_CRED = request.POST.get('TXT_CRED')
        PASSWORD = request.POST.get('TXT_PASS')
        data = {'USER_CRED':USER_CRED,'PASSWORD':PASSWORD}
        url = 'http://127.0.0.1:8000/API/Login/'
        res = requests.post(url, data)
        respu = json.loads(res.text)
        if respu[0]['respuesta'] == 0:
            data = {'msj': "Credenciales Erroneas"}
            return render(request,'core/login.html', data)
        else:
            #request.session['sessionLogin'] = USER_CRED
            return redirect(home)
    return render(request,'core/login.html',  {'nbar': 'login'})
    

def registro(request):

    return render(request,'core/registro.html',  {'nbar': 'registro'})