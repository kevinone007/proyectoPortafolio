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