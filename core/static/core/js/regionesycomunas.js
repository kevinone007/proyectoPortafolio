$(document).ready(function() {

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
    GetAsistentes();
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
        error: function(err) {
            alert('error');
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
        error: function(err) {
            alert('error');
        }
    });

};


const GetComunasModal = (id, ID_REGION) => {
    $('#comunas option').remove();
    console.log(ID_REGION);
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: `http://127.0.0.1:8000/API/Comunas/${ID_REGION}`,
        success: function(res) {
                $.each(JSON.parse(res), function(i, x) {
                    $(`#comunas${id}`).append(`<option value="${x.ID_COMUNA}">${x.DESCRIPCION}</option>`);
                });
            }
            /* ,
                    error: function(err) {
                        alert('error');
                    } */
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
        error: function(err) {
            alert('error');
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
        error: function(err) {
            alert('error');
        }
    });
};

const GetAsistentes = () => {
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: 'http://127.0.0.1:8000/API/Asistentes/',
        success: function(res) {
            $.each(JSON.parse(res), function(i, x) {
                $('#asistentes').append(`<option value="${x.ID_ASISTENTE}">${x.RUT_TRABAJADOR} , ${x.NOMBRE} ${x.AP_PAT} ${x.AP_MAT}</option>`);
            });
        },

        error: function(err) {
            alert('error');
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
                timer: 1500
            });
        }
    });
    if (c == 0) {
        agregar();
    }

}

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
        fila += `<tr id="i${x.cod}">
                    <td style="display:none" >${x.cod}</td>
                    <td>${x.nombre}</td>
                    <td><button onclick="eliminarFila('${x.cod}')" class="btn btnColor">Eliminar</button></td>
                </tr>`
    });
    $('#listAsistentes').append(fila);
};


const eliminarFila = (x) => {
    $(`#i${x}`).remove();
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
    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ 'fecha': fecha, 'idCliente': idCliente }),
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
        success: function(res) {
            id = res[0].ID_ASISTENTE;
            guardar(id);
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
}


$(function() {
    const rowsPerPage = 5;
    const rows = $('#table-actividades tbody tr');
    const rowsCount = rows.length;
    const pageCount = Math.ceil(rowsCount / rowsPerPage); // avoid decimals
    const numbers = $('#numbers');

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
    const rowsPerPage = 5;
    const rows = $('#table-empleados tbody tr');
    const rowsCount = rows.length;
    const pageCount = Math.ceil(rowsCount / rowsPerPage); // avoid decimals
    const numbers = $('#numbers');

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