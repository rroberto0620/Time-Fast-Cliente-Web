const URL_WS = 'http://localhost:8084/Time-Fast/api/envio/obtenerEnvioNoGuia/';
const URL_WS_Paquetes = 'http://localhost:8084/Time-Fast/api/paquete/obtenerPaquetesEnvio/';
const URL_WS_Historial = 'http://localhost:8084/Time-Fast/api/posee/obtenerHistorialPorIdEnvio/';
const containerInfo = document.getElementById('container-info');

async function obtenerHistorial(idEnvio){
    //INICIA CONSUMO WS
    try{
        const respuesta = await fetch(URL_WS_Historial+idEnvio, {
            method: 'GET',

        });

        if(respuesta.ok){
                const historiales = await respuesta.json();
                console.log(historiales);
                historiales.forEach(historial =>{
                    const paqueteElemento2 = document.createElement('div');
                    paqueteElemento2.className = 'container-products';
                    paqueteElemento2.innerHTML = `
                        <div class="products"> 
                            <ul>
                                <li><strong>Motivo:${historial.motivo}  Estatus:${historial.estatus}  Hora y Fecha:${historial.tiempo}</strong></li>
                            </ul>
                        </div>
                    `;
                    containerInfo.appendChild(paqueteElemento2);
                });

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
                    containerInfo.appendChild(paqueteElemento);
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

        if(respuesta.ok){
                const data = await respuesta.json();
                console.log(data.envio);
                const idEnvio = data.envio.id;
                console.log(idEnvio);
                obtenerPaquetesEnvio(idEnvio)
                obtenerHistorial(idEnvio)
                mostrarInformacion(containerInfo,data);
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
        }else{
            throw new Error(`Error en la petición: ${respuesta.status}`)
        }
    } catch(error){
        console.error('Error en la peticion ',error);
    }
}


function mostrarInformacion(containerInfo,data){
    containerInfo.innerHTML =`<div class="container">
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
            </div>
            <div class="column">
                <h3>Destino</h3>
                <p><strong>Dirección:</strong> ${data.envio.calleDestino} ${data.envio.numeroDestino} Col. ${data.envio.coloniaDestino}</p>
                <p><strong>Código Postal:</strong> ${data.envio.cpDestino}</p>
                <p><strong>Ciudad:</strong> ${data.envio.ciudadDestino}</p>
                <p><strong>Estado:</strong> ${data.envio.estadoDestino}</p>
            </div>
        </div>
        <div class="timeline">
            <h3>Historial de Cambios</h3>
            <ul>
                <li><strong>10:50 a.m.:</strong> Delimitado (Xalapa, Ver)</li>
                <li><strong>12:00 p.m.:</strong> En tránsito</li>
                <li><strong>10:30 p.m.:</strong> Finalizado</li>
            </ul>
        </div>
    </div>
</div>
<h3>Productos contenidos</h3>`;
    document.body.appendChild(containerInfo);
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
    // Permitir solo números en el input
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('rastrear').addEventListener('click', function () {
    const input = document.getElementById('trackingNumber');
    const errorMessage = document.getElementById('error-message');
    
    // Validar si el input está vacío o no tiene 6 caracteres
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
