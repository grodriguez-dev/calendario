
document.addEventListener('DOMContentLoaded', function() {
        let formulario = document.querySelector("#formularioEvento");
        var calendarEl = document.getElementById('agenda');

    var calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: 'dayGridMonth',

        locale:"es",
        displayEventTime:false,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },

        //events:"http://calendario.test/evento/mostrar",
        eventSources:{
            url: baseUrl+"/evento/mostrar",
            method:"post",
            extraParams: {
                _token: formulario._token.value
            }
        },
        
        dateClick:function(info){
            formulario.reset();
            formulario.start.value=info.dateStr;
            formulario.end.value=info.dateStr;
            $("#evento").modal("show");
        },

        eventClick:function (info) {
            var evento = info.event;
            console.log(evento);

            axios.post(baseUrl+"/evento/editar/"+info.event.id).
            then(
                (respuesta) => {
                    formulario.id.value = respuesta.data.id;
                    formulario.title.value = respuesta.data.title;
                    formulario.description.value = respuesta.data.description;
                    formulario.start.value = respuesta.data.start;
                    formulario.end.value = respuesta.data.end;
                    $("#evento").modal("show");
                }
            ).catch(
                error => {
                    if (error.response) {
                        console.log(error,response.data);
                    }
                }
            )
        }

    });
    calendar.render();

    document.getElementById("btnGuardar").addEventListener("click",function(){
        enviarDatos("/evento");
    });
    document.getElementById("btnEliminar").addEventListener("click",function(){
        enviarDatos("/evento/eliminar/"+formulario.id.value);
    });
    document.getElementById("btnModtficar").addEventListener("click",function(){
        enviarDatos("/evento/actualizar/"+formulario.id.value);
    });
    function enviarDatos(url) {
        const datos = new FormData(formulario);
        const nuevaUrl = baseUrl+url;
        axios.post(nuevaUrl, datos).
        then(
            (respuesta) => {
                calendar.refetchEvents();
                $("#evento").modal("hide");
            }
        ).catch(
            error => {
                if (error.response) {
                    console.log(error,response.data);
                }
            }
        )
    }
});
