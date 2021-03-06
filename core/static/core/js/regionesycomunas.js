/*jshint esversion: 6 */
$(document).ready(function() {
    $('#table-actividades tr').each(function(i) {
        var valor = $(this).find('td').eq(5).html();
        var boton = $(this).find('td').eq(0).html();
        if(valor == "Terminada"){
            $('#btnCan'+boton).addClass('disabled');
            $('#btnEli'+boton).addClass('disabled');
        }
        if(valor == "Cancelada"){
            $('#btnCan'+boton).addClass('disabled');
        } 
        if(valor == "En Curso"){
            $('#btnCan'+boton).addClass('disabled');
            $('#btnEli'+boton).addClass('disabled');
        }
        if(valor == "Programada"){
            $('#btnEli'+boton).addClass('disabled');
        }
        if(valor == "Reprogramada"){
            $('#btnEli'+boton).addClass('disabled');
        }
        if(valor == "Solicitada"){
            $('#btnEli'+boton).addClass('disabled');
        }
        if(valor == "Asignada"){
            $('#btnEli'+boton).addClass('disabled');
        }
    });
    var idEmpresa = $('#idCliente').val();
    id = 0;
    GetRegiones(0);
    jQuery('#regiones').change(function() {

        ID_REGION = $('#regiones').val();

        if (ID_REGION == '0') {
            alert('Seleccione una region');
        } else {
            GetComunas(0, ID_REGION);
        }

    });
    GetRubros();
    GetServicios();
    GetAsistentes(idEmpresa);
    $('.asistentes').select2();

});

const GetRegiones = (id) => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: 'http://127.0.0.1:8000/API/Regiones/',
        success: function(res) {

            $.each(JSON.parse(res), function(i, x) {
                if (id == 0) {
                    $(`#regiones`).append(`<option value="${x.ID_REGION}">${x.DESCRIPCION}</option>`);
                } else {
                    $(`#regiones${id}`).append(`<option value="${x.ID_REGION}">${x.DESCRIPCION}</option>`);
                }
            });
        },
        error: function(request, error) {
            alert(error);
        }
    });
};

const GetComunas = (id, ID_REGION) => {
    $('#comunas option').remove();
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: `http://127.0.0.1:8000/API/Comunas/${ID_REGION}`,
        success: function(res) {
            $.each(JSON.parse(res), function(i, x) {
                $('#comunas').append(`<option value="${x.ID_COMUNA}">${x.DESCRIPCION}</option>`);

            });
        },
        error: function(request, error) {
            alert(error);
        }
    });

};


const deleteRegionesById = (identity) => {
    $(`#regiones${identity} option`).remove();
};


const listAsistentesCapacitacion = (idCapa) => {
    var fila = '';
    $(`#h${idCapa} tbody`).empty();
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: `http://127.0.0.1:8000/API/LISTAASISTENTESCAPA/${idCapa}`,
        success: function(res) {
            $.each(JSON.parse(res), function(i, x) {
                fila += (`<tr>
                            <td>${x.RUT}</td>
                            <td>${x.NOMBRE} ${x.AP} ${x.AM}</td>
                            <td>${x.GEN}</td>
                        </tr>`);
            });
            $(`#h${idCapa}`).append(fila);
        },
        error: function(request, error) {
            alert(error);
        }
    });

};


const GetRubros = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: 'http://127.0.0.1:8000/API/Rubros',
        success: function(res) {
            $.each(JSON.parse(res), function(i, x) {
                $('#rubros').append(`<option value="${x.COD_RUBRO}">${x.DESCRIPCION}</option>`);
            });
        },
        error: function(request, error) {
            alert(error);
        }
    });
};


const GetServicios = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: 'http://127.0.0.1:8000/API/Servicios',
        success: function(res) {
            $.each(JSON.parse(res), function(i, x) {
                $('#servicios').append(`<option value="${x.ID_SERVICIO}">${x.NOMBRE}</option>`);
            });

        },
        error: function(request, error) {
            alert(error);
        }
    });
};

const GetAsistentes = (idEmpresa) => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: `http://127.0.0.1:8000/API/Asistentes/${idEmpresa}`,
        success: function(res) {
            $.each(JSON.parse(res), function(i, x) {
                $('#asistentes').append(`<option value="${x.ID_ASISTENTE}">${x.RUT_TRABAJADOR} , ${x.NOMBRE} ${x.AP_PAT} ${x.AP_MAT}</option>`);
            });
        },

        error: function(request, error) {
            alert(error);
        }
    });
};



function validador() {
    var c = 0;
    var cod = document.getElementById("asistentes").value;
    $('#listAsistentes tr').each(function(i) {
        var $tds = $(this).find('td').eq(0).html();

        if ($tds == cod) {
            c++;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ya agregado',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
    if (c == 0) {
        agregar();
    }

}
var canti = 0;
const agregar = () => {
    var cod = document.getElementById("asistentes").value;
    var combo = document.getElementById("asistentes");
    var selected = combo.options[combo.selectedIndex].text;
    var lista = [];
    var objeto = {
        cod: cod,
        nombre: selected
    };
    lista.push(objeto);
    var fila = '';
    $.each((lista), function(i, x) {
        algo = `${x.cod}`;
        if (algo != '') {
            fila += `<tr id="i${x.cod}">
                        <td style="display:none" >${x.cod}</td>
                        <td>${x.nombre}</td>
                        <td><button onclick="eliminarFila('${x.cod}')" class="btn btnColor">Eliminar</button></td>
                    </tr>`;
            i++;
            canti++;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Seleccione un empleado.',
                showConfirmButton: false,
                timer: 3000
            });
            return false;
        }
    });
    $('#listAsistentes').append(fila);
};


const eliminarFila = (x) => {
    $(`#i${x}`).remove();
    canti--;
};


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');




$('#guardarCapa').click(function() {
    var fecha = $("#fechaCapacitacion").val();
    var idCliente = $("#idCliente").val();
    horaVisita = $("#horaCapacitacion").val();
    horaVisita1 = horaVisita.toString().substr(0, 2);
    horaVisita1 = parseInt(horaVisita1);
    var x = new Date();
    diaActual = x.getDate();
    diaBuscado = diaActual + 2;
    x.setDate(diaBuscado);
    x = x.toISOString().slice(0, 10);
    if (fecha == null || fecha.length == 0 || /^\s+$/.test(fecha) || fecha.length > 50) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Fecha no puede estar vacía.',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    } else if (x > fecha) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Fecha de visita debe ser con 2 días de anticipación.',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    }

    if (horaVisita == null || horaVisita.length == 0 || /^\s+$/.test(horaVisita) || horaVisita.length > 50) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Hora de capacitación no puede estar vacío',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    } else if (horaVisita1 <= 07 || horaVisita1 >= 18) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Hora de capacitación debe ser entre las 8:00 y las 18:00',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    }
    if ($('#listAsistentes tr').length == 1) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Debes llenar la lista de asistentes para la capacitación.',
            showConfirmButton: false,
            timer: 3000
        });
        return false;
    }


    var horaFinal = $("#horaCapacitacion").val();
    var minutoFinal = $("#horaCapacitacion").val();
    horaFinal = horaFinal.substr(0, 2);
    minutoFinal = minutoFinal.substr(3, 2);

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
        type: "POST",
        dataType: 'json',
        async: false,
        data: JSON.stringify({ 'fecha': fecha, 'horaFinal': horaFinal, 'minutoFinal': minutoFinal, 'idCliente': idCliente }),
        url: `http://127.0.0.1:8000/API/InsertActividadCapacitacion/`,
        error: function(err) {
            console.log(err);
        }
    });

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: `http://127.0.0.1:8000/API/ACTIVIDADID/${idCliente}`,
        dataType: 'json',
        async: false,
        success: function(res) {
            id = res[0].ID_ASISTENTE;
            guardar(id);
            Swal.fire({
                icon: 'success',
                title: 'Capacitacion solicitada',
                text: `Su capacitacion ha sido ingresada correctamente para el día: ${fecha} ${horaFinal}:${minutoFinal}`,
                showConfirmButton: true,
                timer: 10000
            }).then(

                function() { window.location.replace('/solicitarCapacitacion'); }

            );
        },
        error: function(err) {
            alert('error');
        }
    });
    console.log(id);

});

const guardar = (id) => {
    $('#listAsistentes tr').each(function(i) {
        if (i > 0) {
            var idUSER = $(this).find('td').eq(0).html();
            var fecha = $("#fechaCapacitacion").val();
            $.ajax({
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                type: "POST",
                dataType: 'json',
                data: JSON.stringify({ fecha: fecha, idUSER: idUSER, idActividad: id }),
                url: `http://127.0.0.1:8000/API/Capacitacion/`,
                error: function(err) {
                    console.log(err);
                }
            });

        }
    });
};

const CancelarActividad = (idAct) => {
    Swal.fire({
        title: 'Estás segura/o?',
        text: "Esta acción no se puede revertir.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, cancelar.',
        cancelButtonText: 'No, volver atrás',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                type: "PUT",
                url: `http://127.0.0.1:8000/API/CANCELACAPA/${idAct}`,
                dataType: 'json'
            }).then(
                Swal.fire(
                    'Cancelada!',
                    'La capacitación ha sido cancelada correctamente.',
                    'success'
                ));
        }
    });



};

const EliminarActividad = (idAct) => {
    Swal.fire({
        title: 'Estás segura/o?',
        text: "Esta acción no se puede revertir.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar.',
        cancelButtonText: 'No, volver atrás',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                type: "PUT",
                url: `http://127.0.0.1:8000/API/ELIMINACAPA/${idAct}`,
                dataType: 'json'
            }).then(
                Swal.fire(
                    'Eliminada!',
                    'La capacitación ha sido eliminada correctamente.',
                    'success'
                ));
        }
    });



};
$(function() {
    var rowsPerPage = 5;
    var rows = $('#table-actividades tbody tr');
    var rowsCount = rows.length;
    var pageCount = Math.ceil(rowsCount / rowsPerPage); // avoid decimals
    var numbers = $('#numbers');

    // Generate the pagination.
    for (var i = 0; i < pageCount; i++) {
        numbers.append('<li class="page-item"><a class="page-link" href="#">' + (i + 1) + '</a></li>');
    }

    // Mark the first page link as active.
    $('#numbers li:first-child a').addClass('active');

    // Display the first set of rows.
    displayRows(1);

    // On pagination click.
    $('#numbers li a').click(function(e) {
        var $this = $(this);

        e.preventDefault();

        // Remove the active class from the links.
        $('#numbers li a').removeClass('active');

        // Add the active class to the current link.
        $this.addClass('active');

        // Show the rows corresponding to the clicked page ID.
        displayRows($this.text());
    });

    // Function that displays rows for a specific page.
    function displayRows(index) {
        var start = (index - 1) * rowsPerPage;
        var end = start + rowsPerPage;

        // Hide all rows.
        rows.hide();

        // Show the proper rows for this page.
        rows.slice(start, end).show();
    }
});



$(function() {
    var rowsPerPage = 5;
    var rows = $('#table-empleados tbody tr');
    var rowsCount = rows.length;
    var pageCount = Math.ceil(rowsCount / rowsPerPage); // avoid decimals
    var numbers = $('#numbers');

    // Generate the pagination.
    for (var i = 0; i < pageCount; i++) {
        numbers.append('<li class="page-item"><a class="page-link" href="#">' + (i + 1) + '</a></li>');
    }

    // Mark the first page link as active.
    $('#numbers li:first-child a').addClass('active');

    // Display the first set of rows.
    displayRows(1);

    // On pagination click.
    $('#numbers li a').click(function(e) {
        var $this = $(this);

        e.preventDefault();

        // Remove the active class from the links.
        $('#numbers li a').removeClass('active');

        // Add the active class to the current link.
        $this.addClass('active');

        // Show the rows corresponding to the clicked page ID.
        displayRows($this.text());
    });

    // Function that displays rows for a specific page.
    function displayRows(index) {
        var start = (index - 1) * rowsPerPage;
        var end = start + rowsPerPage;

        // Hide all rows.
        rows.hide();

        // Show the proper rows for this page.
        rows.slice(start, end).show();
    }
});

// Valida el rut con su cadena completa "XXXXXXXX-X"
const rutValid = (rutCompleto) => {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
    var tmp = rutCompleto.split("-");
    var digv = tmp[1];
    var rutx = tmp[0];
    if (digv == "K") digv = "k";
    return dvValid(rutx) == digv;
};
const dvValid = (T) => {
    var M = 0,
        S = 1;
    for (; T; T = Math.floor(T / 10))
        S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : "k";
};


const ComunasById = (identificador) => {
        $(`#comunas${identificador} option`).remove();
        $.ajax({
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    type: "GET",
                    url: `http://127.0.0.1:8000/API/Comunas/${$(`#regiones${identificador} option:selected`).val()}`,
    success: function(res) {
        $.each(JSON.parse(res), function(i, x) {
            $(`#comunas${identificador}`).append(`<option value="${x.ID_COMUNA}">${x.DESCRIPCION}</option>`);
        });
    },
    error: function(request, error) {
        alert(error);
    }
});
};