$(document).ready(function() {
    GetRegiones();

    jQuery('#regiones').change(function() {

        ID_REGION = $('#regiones').val();

        if (ID_REGION == '0') {
            alert('Seleccione una region');
        } else {
            GetComunas(ID_REGION);
        }

    });
    GetRubros();
    GetServicios();
    GetAsistentes();
    $('.asistentes').select2();
});
const GetRegiones = () => {

    $.ajax({
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        type: "GET",
        url: 'http://127.0.0.1:8000/API/Regiones/',
        success: function(res) {
            $.each(JSON.parse(res), function(i, x) {
                $('#regiones').append(`<option value="${x.ID_REGION}">${x.DESCRIPCION}</option>`);
            });
        },
        error: function(err) {
            alert('error');
        }
    });

};

const GetComunas = (ID_REGION) => {
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

var x = [];
const getList = () => {
    document.getElementById('listAsistentes').addEventListener('click', function(item) {
            var row = item.path[1];
            var row_value = "";
            for (var j = 0; j < row.cells.length; j++) {

                x += row.cells[j].innerHTML;
                alert(x)
            }
            alert(row_value);
        }

    );
};
/* const PostCapacitacion = () => {
    $('#listAsistentes tr').each(function(i) {
        var tds = $(this).find('td').eq(0).html();
        for (x in tds) {

        }

    });
}; */