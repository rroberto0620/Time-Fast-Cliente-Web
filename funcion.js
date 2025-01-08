const URL_WS = 'http://localhost:8084/Time-Fast/api/envio/obtenerEnvioNoGuia/';
const URL_WS_Paquetes = 'http://localhost:8084/Time-Fast/api/paquete/obtenerPaquetesEnvio/';
const URL_WS_Historial = 'http://localhost:8084/Time-Fast/api/posee/obtenerHistorialPorIdEnvio/';
const containerInfo = document.getElementById('container-info');
const containerInfo2 = document.getElementById('container-info2');
const errorMessage = document.getElementById('error-message');

async function obtenerHistorial(idEnvio){
    //INICIA CONSUMO WS
    try{
        const respuesta = await fetch(URL_WS_Historial+idEnvio, {
            method: 'GET',

        });

        if(respuesta.ok){
                const historiales = await respuesta.json();
                console.log(historiales);
                let htmlContent = `
        <div id="historial" class="container">
            <h2>Historial de cambios</h2>
            <div id="historial2" class="timeline"> 
    `;

    historiales.forEach(historial => {
        htmlContent += `
            <ul>
                <li><strong>Motivo:  </strong>${historial.motivo}</li>
                <li><strong>Estatus:  </strong>${historial.estatus}</li>
                <li><strong>Hora y Fecha:  </strong>${historial.tiempo}</li>
            </ul>
            <hr>
        `;
    });
    htmlContent += `<div/></div>`;
    containerInfo2.innerHTML = htmlContent;
    containerInfo.appendChild(containerInfo2)
        }else{
            throw new Error(`Error en la petición: ${respuesta.status}`)
        }
    } catch(error){
        console.error('Error en la peticion ',error);
    }
}

async function obtenerPaquetesEnvio(idEnvio){
    console.log("idEnviado: "+idEnvio)
    //INICIA CONSUMO WS
    try{
        const respuesta = await fetch(URL_WS_Paquetes+idEnvio, {
            method: 'GET',

        });

        if(respuesta.ok){
                const paquetes = await respuesta.json();
                const headerProduct = document.getElementById('headerProduct');
                console.log(paquetes);
                paquetes.forEach(paquete =>{
                    const paqueteElemento = document.createElement('div');
                    paqueteElemento.className = 'container-products';
                    paqueteElemento.innerHTML = `
                        <div class="products"> 
                            <ul>
                                <li><strong>${paquete.descripcion}</strong></li>
                                <li><strong>Peso del producto: </strong>${paquete.peso} kg </li>
                                <li><strong>Dimensiones del producto: </strong>${paquete.dimensiones} cm </li>
                            </ul>
                        </div>
                    `;
                    headerProduct.appendChild(paqueteElemento);
                });

        }else{
            throw new Error(`Error en la petición: ${respuesta.status}`)
        }
    } catch(error){
        console.error('Error en la peticion ',error);
    }
}

async function obtenerInformacionEnvio(){
    
    const inputTrackingNumber = document.getElementById('trackingNumber');
    console.log(inputTrackingNumber.value)
    //INICIA CONSUMO WS
    try{
        const respuesta = await fetch(URL_WS+inputTrackingNumber.value, {
            method: 'GET',

        });

        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }

        const data = await respuesta.json();

        if (data.mensaje === "Numero de guia incorrecto") {
                alert('Este numero de guia no existe, por favor intente con otro.');
            return;
        }

        if(respuesta.ok){
            errorMessage.style.display = 'none';
                console.log(data.envio);
                const idEnvio = data.envio.id;
                console.log(idEnvio);
                mostrarInformacion(containerInfo,data);
                obtenerHistorial(idEnvio)
                obtenerPaquetesEnvio(idEnvio)
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            } 
        else{
            throw new Error(`Error en la petición: ${respuesta.status}`)
        }
    } catch(error){
        console.error('Error en la peticion ',error);
        containerInfo.innerHTML = '<p>Lo sentimos, hubo un error al consultar la información.</p>'
    }
}

function mostrarInformacion(containerInfo, data) {
    containerInfo.innerHTML = `
        <div class="container">
            <div class="content">
                <h2>Estatus del Envío</h2>
                <p><strong>Envío con número de guía:</strong> <span>${data.envio.numeroGuia}</span></p>
                <p class="status"><strong>Estado:</strong> <span id="currentStatus">${data.envio.estatus}</span></p>
                <div class="info-container">
                    <div class="column">
                        <h3>Origen</h3>
                        <p><strong>Dirección:</strong> ${data.envio.calleOrigen} ${data.envio.numeroOrigen} Col. ${data.envio.coloniaOrigen}</p>
                        <p><strong>Código Postal:</strong> ${data.envio.cpOrigen}</p>
                        <p><strong>Ciudad:</strong> ${data.envio.ciudadOrigen}</p>
                        <p><strong>Estado:</strong> ${data.envio.estadoOrigen}</p>
                        <button style="background-color: transparent; display: block; margin: 0 auto;" onclick="abrirEnMaps('${data.envio.calleDestino} ${data.envio.numeroDestino}, ${data.envio.coloniaDestino}, ${data.envio.ciudadDestino}, ${data.envio.estadoDestino}')">
                            <a href="#"><img src="google-maps-svgrepo-com.svg" alt="Maps" width="50"></a>
                        </button>
                    </div>
                    <div class="column">
                        <h3>Destino</h3>
                        <p><strong>Dirección:</strong> ${data.envio.calleDestino} ${data.envio.numeroDestino} Col. ${data.envio.coloniaDestino}</p>
                        <p><strong>Código Postal:</strong> ${data.envio.cpDestino}</p>
                        <button style="background-color: transparent; display: block; margin: 0 auto;" onclick="abrirEnMaps('${data.envio.calleDestino} ${data.envio.numeroDestino}, ${data.envio.coloniaDestino}, ${data.envio.ciudadDestino}, ${data.envio.estadoDestino}')">
                            <a href="#"><img src="google-maps-svgrepo-com.svg" alt="Maps" width="50"></a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <h2 id="headerProduct">Productos contenidos</h2>`;
    document.body.appendChild(containerInfo);
}

function abrirEnMaps(direccion) {
    const direccionCodificada = encodeURIComponent(direccion); 
    window.open(`https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`, '_blank'); 
}

window.addEventListener('scroll', () => {
    const backToTopButton = document.getElementById('backToTop');
    if (window.scrollY > 200) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.getElementById('trackingNumber').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('rastrear').addEventListener('click', function () {
    const input = document.getElementById('trackingNumber');
    if (input.value.trim() === '') {
        errorMessage.textContent = 'El campo no puede estar vacío.';
        errorMessage.style.display = 'inline';
    } else if (input.value.length !== 6) {
        errorMessage.textContent = 'El número debe tener exactamente 6 dígitos.';
        errorMessage.style.display = 'inline';
    } else {
        errorMessage.style.display = 'none';
    }
});

document.getElementById('borrarButton').addEventListener('click', function() {
    // Selecciona el input y borra su contenido
    document.getElementById('trackingNumber').value = '';
});

document.getElementById('headTime').addEventListener('click', function() {
    location.reload(); // Recarga la página
});