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
    if request.method == 'POST' :
        nombreEmpresa = request.POST.get('nombreEmpresa')
        rutEmpresa    = request.POST.get('rutEmpresa')
        direccion     = request.POST.get('direccion')
        telefono      = request.POST.get('telefono')
        comunas       = request.POST.get('comunas')
        correo        = request.POST.get('correo')
        rubros        = request.POST.get('rubros')
        user          = rutEmpresa
        passwd        = rutEmpresa[0:4]
        print(correo, user, passwd)
        cursor.callproc("SPD_ADDCLIENTEEMPRESA",(rutEmpresa, nombreEmpresa, telefono, correo, direccion,  comunas, rubros, user, passwd))
    return render(request,'core/registro.html',  {'nbar': 'registro'})

def retornaDataUsuarioCliente(USER):
    out_cur = django_cursor.connection.cursor()
    cursor.callproc("SPD_GETDATAUSUARIO",[USER, out_cur])
    lista = []
    for x in out_cur:
            lista.append({'id_credencial':x[0], 'user_cred':x[1], 'password':x[2] ,'id_rol':x[3], 'id_est_creden':x[4], 'id_profesional':x[5], 'id_cliente':x[6]})
    return lista

def dataClienteEmpresa(IDCLIENTE):
    out_cur = django_cursor.connection.cursor()
    cursor.callproc("SPD_GETUSUARIOEMPRESA",[IDCLIENTE, out_cur])
    datacliente = []
    for x in out_cur:
            datacliente.append({'ID_CLIENTE':x[0], 'RUT_EMPRESA':x[1], 'NOMBRE_EMPRESA':x[2] ,'TELEFONO':x[3], 'MAIL_EMPRESA':x[4], 'DIRECCION':x[5], 'ID_COMUNA':x[6], 'ID_EST_CLIENT':x[7]})
    return datacliente

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
   
   ####################SPD_INGRESARSOLICITUD###########################
    if request.method == 'POST' and 'btnRealizarSolicitud' in request.POST:
        fechaVisita  =   request.POST.get('fechaVisita')
        horaVisita   =   request.POST.get('horaVisita')
        horaVisita  = str(horaVisita)
        print(horaVisita)
        horaVisita = horaVisita[0:2]
        minutoVisita = request.POST.get('horaVisita')
        minutoVisita = minutoVisita[3:5]
        print(horaVisita, minutoVisita)
        cursor.callproc("SPD_INGRESARSOLICITUD",(fechaVisita, horaVisita, minutoVisita, IDCLIENTE))


    ###################SPD_INGRESARASESORIA############################
    if request.method == 'POST' and 'btnRealizarAsesoria' in request.POST:
        fechaAsesoria  =   request.POST.get('fechaAsesoria')
        horaAsesoria   =   request.POST.get('horaAsesoria')
        servicios       =    request.POST.get('servicios')
        horaAsesoria  = str(horaAsesoria)
        print(horaAsesoria)
        horaAsesoria = horaAsesoria[0:2]
        minutoAsesoria = request.POST.get('horaAsesoria')
        minutoAsesoria = minutoAsesoria[3:5]
        print(horaAsesoria, minutoAsesoria, servicios)
        cursor.callproc("SPD_INGRESARASESORIA",(fechaAsesoria, horaAsesoria, minutoAsesoria, IDCLIENTE, servicios))

    ####################SPD_INGRESARMODIFICACION###########################
    if request.method == 'POST' and 'btnRealizarModificacion' in request.POST:
        fechaModificacion  =   request.POST.get('fechaModificacion')
        horaModificacion   =   request.POST.get('horaModificacion')
        horaModificacion  = str(horaModificacion)
        print(horaModificacion)
        horaModificacion = horaModificacion[0:2]
        minutoVisita = request.POST.get('horaModificacion')
        minutoVisita = minutoVisita[3:5]
        print(horaModificacion, minutoVisita)
        cursor.callproc("SPD_INGRESARMODIFICACION",(fechaModificacion, horaModificacion, minutoVisita, IDCLIENTE))

    return render(request,'core/vistaCliente/inicioCliente.html', data )

def modificarDatos(request):
    lista = retornaDataUsuarioCliente(request.session['S']) 
    data = lista[0]['id_cliente'] 
    print(data)
    ClienteEmpresa = {'data': lista[0], 'ClienteEmpresa': dataClienteEmpresa(data)}

    if request.method == 'POST' :
        nombreEmpresa = request.POST.get('nombreEmpresa')
        rutEmpresa    = request.POST.get('rutEmpresa')
        direccion     = request.POST.get('direccion')
        telefono      = request.POST.get('telefono')
        comunas       = request.POST.get('comunas')
        correo        = request.POST.get('correo')
        cursor.callproc("SPD_MODIFICARCLIENTE",(data, nombreEmpresa, rutEmpresa, direccion, telefono, comunas,correo))
    return render(request, 'core/vistaCliente/modificarDatos.html', ClienteEmpresa)


def solicitarCapacitacion(request):
    lista = retornaDataUsuarioCliente(request.session['S'])
    data = lista[0]['id_cliente'] 
    print(data)
    ClienteEmpresa = {'data': lista[0], 'ClienteEmpresa': dataClienteEmpresa(data)}
    return render(request,'core/vistaCliente/solicitarCapacitacion.html',ClienteEmpresa)

def addAsistente(request):
    lista = retornaDataUsuarioCliente(request.session['S'])
    IDCLIENTE = lista[0]['id_cliente'] 
    out_cur = django_cursor.connection.cursor()
    cursor.callproc("SPD_EMPLEADOS",[IDCLIENTE, out_cur])
    empleados = []
    for x in out_cur:
            empleados.append({'RUT':x[0], 'NOMBRE':x[1], 'AP':x[2], 'AM':x[3], 'COMUNA':x[4], 'GENERO':x[5], 'ID':x[6]})
    ClienteEmpresa = {'data': lista[0], 'ClienteEmpresa': dataClienteEmpresa(IDCLIENTE), 'empleados': empleados}

    #############################################################################
    if request.method == 'POST' and 'btnInsertar' in request.POST:
        rut  =   request.POST.get('rutEmpleado')
        nombre   =   request.POST.get('nombreEmpleado')
        apep   =   request.POST.get('apEmpleado')
        apem   =   request.POST.get('amEmpleado')
        comunas   =   request.POST.get('genero')
        genero   =   request.POST.get('comunas')
        print(rut,nombre,apep,apem,comunas,genero,IDCLIENTE)
        cursor.callproc("SPD_INSERTAREMPLEADO",(rut, nombre, apep, apem, comunas, genero, IDCLIENTE))
        
    return render (request, 'core/vistaCliente/addAsistente.html',ClienteEmpresa)