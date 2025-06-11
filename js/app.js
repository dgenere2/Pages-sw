
  function handleCredentialResponse(response) {
    const id_token = response.credential;

    const URL = "https://script.google.com/macros/s/AKfycby-pxRLDBzdIvwzNSnKzo_UJDhCBHr5oWCgkVI6yb4GC3tZNKArhfTuggIIuSWRv4CZ6Q/exec";
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({ id_token }),
      redirect: "follow"
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        localStorage.removeItem("medida")
        localStorage.setItem("medida",data.medidas)
        localStorage.setItem("conceptos",data.conceptos)
        var medidas = data.medidas.split(',')
        var conceptos = data.conceptos.split(',')

        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("id_token", id_token);
        localStorage.setItem("decripcion", data.decripcion);
        localStorage.setItem("negocio", data.negocio);
        document.getElementById("r-negocio").textContent = data.negocio
        document.getElementById("r-descipcion").textContent = data.decripcion
        document.getElementById("r-documento").textContent = data.documento
        document.getElementById("resultado").textContent = data.email;
        document.getElementById("logout").style.display = "inline-block";
        document.getElementById("boton-login").innerHTML = ""; // Oculta login
        
        for (i in medidas){
         document.getElementById("medida").add(new Option(medidas[i], medidas[i] ));
          }
          
          for (i in conceptos){
         document.getElementById("servicio").add(new Option(conceptos[i], conceptos[i] ));
          }

          
      } else {
        console.error("Error de autenticación");
      }
    })
    .catch(error => {
      console.error("Error en la autenticación:", error);
    });
  }

 function iniciarGoogleLogin() {
    google.accounts.id.initialize({
      client_id: "197964323281-d8hr205c5urqml3f5csqduvii90eo0pu.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("boton-login"),
      { theme: "outline", size: "small" }
    );
  }

  window.onload = function () {
    const emailGuardado = localStorage.getItem("userEmail");
    localStorage.removeItem("ubicacion")
    if (emailGuardado) {
      document.getElementById("resultado").textContent = emailGuardado;
      document.getElementById("logout").style.display = "inline-block";
      var datosMedidas = localStorage.getItem("medida")
      var datosConceptos = localStorage.getItem("conceptos")
      var decripcion = localStorage.getItem("decripcion")
      var negocio = localStorage.getItem("negocio")


       document.getElementById("r-negocio").textContent = negocio
       document.getElementById("r-descipcion").textContent = decripcion

      var medidas = datosMedidas.split(',')
      var conceptos = datosConceptos.split(',')


        for (i in medidas){
         document.getElementById("medida").add(new Option(medidas[i], medidas[i] ));
          }
          
          for (i in conceptos){
         document.getElementById("servicio").add(new Option(conceptos[i], conceptos[i] ));
          }

          

      
    } else {
      iniciarGoogleLogin();
    }

    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("id_token");
      document.getElementById("resultado").textContent = "";
      document.getElementById("logout").style.display = "none";
      iniciarGoogleLogin(); // Vuelve a mostrar botón de login
    });
  };

  function calcularMonto() {
     var cantidad = document.getElementById("peso").value
     var precioQuintal =  document.getElementById("quintal").value
     var inputMonto = document.getElementById('monto');

    var precioUnitario  =  parseFloat( precioQuintal / 130).toFixed(2)
    var montoTotal = precioUnitario * cantidad

    if (cantidad == "" || precioUnitario == ""){ return}
    
    
    inputMonto.value =  parseFloat(montoTotal).toFixed(2)
    document.getElementById("unitario").value = parseFloat(precioUnitario).toFixed(2)


    formatearMoneda(inputMonto);

    }
  

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('✅ SW registrado:', reg);

      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Mostrar aviso
            document.getElementById('update-alert').style.display = 'block';
          }
        };
      };
    }).catch(err => {
      console.error('❌ Error al registrar SW:', err);
    });
  }

  // Menú lateral
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
  });

  document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
  });


document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id_token = localStorage.getItem("id_token");
  const emailGuardado = localStorage.getItem("userEmail");
  var noFactura = generarNumeroFactura();
  if (!id_token) {
    alert("Debe iniciar sesión para guardar la factura.");
    return;
  }

  //console.log("Factura ID:", noFactura);
  var concepto = document.getElementById("servicio").value
  var comentario = document.getElementById("comentario").value
  var MontoFormato = document.getElementById("monto").value
   

  const factura = {
    cliente: document.getElementById("cliente").value,
    fecha: document.getElementById("fecha").value,
    servicio: concepto+ ' ' +comentario,
    monto: parseFloat(obtenerMontoSinFormato()).toFixed(2),
    peso: parseFloat(document.getElementById("peso").value).toFixed(2),
    usuario: emailGuardado,
    token: id_token,
    nofactura: noFactura,
    medida: document.getElementById("medida").value,
    preciounidad: document.getElementById("unitario").value,
    quintal: document.getElementById("quintal").value
  };

   document.getElementById("cliente").value = ""
   document.getElementById("fecha").value = ""
   document.getElementById("servicio").value = ""
   document.getElementById("monto").value  = ""
   document.getElementById("peso").value  = ""
  document.getElementById("quintal").value = ""
  document.getElementById("comentario").value = ""
   document.getElementById("unitario").value = ""
   document.getElementById("monto").value = ""

   

  
  


  // Mostrar recibo
  document.getElementById("r-cliente").textContent = factura.cliente;
  document.getElementById("r-fecha").textContent = factura.fecha;
  document.getElementById("r-servicio").textContent = factura.servicio;
  document.getElementById("r-monto").textContent = MontoFormato;
  document.getElementById("flotante").style.display = "block";
  document.getElementById("r-peso").textContent =  factura.peso 
  document.getElementById("r-factura").textContent =  factura.nofactura
   document.getElementById("r-medida").textContent = " " + factura.medida
   document.getElementById("r-punitario").textContent = factura.preciounidad
   document.getElementById("r-label").innerText = "Precio por " + factura.medida
  
  

  // Guardar en línea o local
 if (navigator.onLine) {
  try {
    const respuesta = await enviarFacturaAScript(factura);
    if (!respuesta.ok) throw new Error("Error en servidor"); // si no fue exitoso, lanza error
  } catch (err) {
    console.warn("Error al enviar online, guardando en localStorage:", err);
    guardarEnLocal(factura); // solo se guarda si realmente falló
  }
} else {
  guardarEnLocal(factura);
}

});

function generarNumeroFactura() {
  const ahora = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
  const aleatorio = Math.floor(Math.random() * 900 + 100); // Número aleatorio de 3 cifras
  return `F-${ahora}${aleatorio}`; // Ejemplo: "456789123"
}

  

// Enviar a Apps Script
async function enviarFacturaAScript(factura) {
  const url = "https://script.google.com/macros/s/AKfycbzDrqkdfYA9egr4esL2PGdXMIgMdl5ob6hGItBjzE1R9ydd0C1htdrtbI0zZmSxvLZl/exec"; // Reemplazar con tu URL del Web App de Apps Script
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify(factura),
    redirect: "follow"
  });

  if (!res.ok) throw new Error("Error en respuesta del servidor");

  return res;
}

// Guardar en localStorage
function guardarEnLocal(factura) {
  const pendientes = JSON.parse(localStorage.getItem("facturas_pendientes")) || [];
  pendientes.push(factura);
  localStorage.setItem("facturas_pendientes", JSON.stringify(pendientes));
}


  // Función de impresión
  function imprimirRecibo() {
    const contenido = document.getElementById("recibo").innerHTML;
    const ventana = window.open('', '', 'width=400,height=600');
    ventana.document.write('<html><head><title>Recibo</title><style>');
    ventana.document.write(`
      body { font-family: monospace; padding: 10px; font-size: 14px; }
      h2 { text-align: center; }
      p { margin: 4px 0; }
      hr { margin: 10px 0; }
    `);
    ventana.document.write('</style></head><body>');
    ventana.document.write(contenido);
    ventana.document.write('</body></html>');
    ventana.document.close();
    ventana.print();
  }


window.addEventListener("online", function () {
  const pendientes = JSON.parse(localStorage.getItem("facturas_pendientes")) || [];

  if (pendientes.length > 0) {
    pendientes.forEach(async (factura, index) => {
      try {
        await enviarFacturaAScript(factura);
        pendientes.splice(index, 1); // Eliminar la que ya se envió
        localStorage.setItem("facturas_pendientes", JSON.stringify(pendientes));
      } catch (err) {
        console.warn("No se pudo sincronizar una factura:" + err);
      }
    });
  }
});

function verOption (idMenu){

  valorLocalStorange = localStorage.getItem("ubicacion")
  
var ubicacionActual = valorLocalStorange == null ? 'forma-inicio' : valorLocalStorange;


localStorage.removeItem("ubicacion");
localStorage.setItem("ubicacion",idMenu);  

document.getElementById(ubicacionActual).style.display = 'none'
document.getElementById(idMenu).style.display = ''

    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');

    consultarFacturas();
  
}

function exportarExcel() {
  const tabla = document.querySelector('#tablaFacturas table');
  const wb = XLSX.utils.book_new();
  const ws_data = [];
  var timeTamp = new Date().getTime()
  var nomDocument = 'facturas_'+ timeTamp+ '.xlsx'

  // Encabezado
  ws_data.push(['N° Factura', 'Cliente', 'Fecha', 'Servicio','Cantidad','medida','P. Unid', 'Monto']);

  // Filas visibles
  const filas = tabla.querySelectorAll('tbody tr');
  filas.forEach(fila => {
    if (fila.style.display !== 'none') {
      const celdas = fila.querySelectorAll('td');
      const filaDatos = Array.from(celdas).map(td => td.innerText);
      ws_data.push(filaDatos);
    }
  });

  // Agrega total
  const total = document.getElementById("total-monto").innerText || "0.00";
  ws_data.push(['', '', '','','','', 'TOTAL', total]);

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Facturas");
  XLSX.writeFile(wb, nomDocument);
}


function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  var timeTamp = new Date().getTime()
  var nomDocument = 'facturas_'+ timeTamp+ '.pdf'

  doc.text("Consulta de Facturas", 14, 15);

  const tabla = document.querySelector('#tablaFacturas table');
  if (!tabla) {
    alert("Tabla no encontrada.");
    return;
  }

  const head = [['N° Factura', 'Cliente', 'Fecha', 'Servicio','Cantidad','medida','P. Unid', 'Monto']];
  const body = [];

  const filas = tabla.querySelectorAll('tbody tr');
  filas.forEach(fila => {
    if (fila.style.display !== 'none') {
      const celdas = fila.querySelectorAll('td');
      const datos = Array.from(celdas).map(td => td.innerText);
      body.push(datos);
    }
  });

  // Agrega total solo si hay datos
  if (body.length > 0) {
    const total = document.getElementById("total-monto").innerText || "0.00";
    body.push(['', '', '','','','', 'TOTAL', total]);
  }

  doc.autoTable({
    head: head,
    body: body,
    startY: 20
  });



  doc.save(nomDocument);
}

let facturasCargadas = []; // Variable global para almacenar los datos

async function consultarFacturas() {
  const url = "https://script.google.com/macros/s/AKfycby3Ir5diIy3a--V100zZMFtINTHJncpDp3C_cbyafQ4IB1Z41jK-SpRbFmkfzj36CnK/exec";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ accion: "consultar" })
    });

    const json = await res.json();
    if (json.facturas) {
      facturasCargadas = json.facturas; // Guardar facturas
      renderizarFacturas(facturasCargadas); // Mostrar sin filtros al inicio
    }

  } catch (err) {
    console.error("Error al consultar facturas:", err);
  }
}

function renderizarFacturas(facturas) {
  const tbody = document.querySelector("#tablaFacturas tbody");
  tbody.innerHTML = "";

  let total = 0;
  let totalcant = 0;
  facturas.forEach(f => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${f.noFactura}</td>
      <td>${f.cliente}</td>
      <td>${f.fecha}</td>
      <td>${f.servicio}</td>
      <td>${parseFloat(f.peso).toFixed(2)}</td>
      <td>${f.quintal}</td>
      <td>${parseFloat(f.unitario).toFixed(2)}</td>
      <td>${parseFloat(f.monto).toFixed(2)}</td>
    `;
    tbody.appendChild(fila);
    total += parseFloat(f.monto);
    totalcant += parseFloat(f.peso);
    
  });

  document.getElementById("total-monto").textContent = total.toFixed(2);
   document.getElementById("total-cant").textContent = totalcant.toFixed(2);
}

function filtrarTabla() {
  const factura = document.getElementById('filtroFactura').value.toLowerCase();
  const cliente = document.getElementById('filtroCliente').value.toLowerCase();
  const fechaDesde = document.getElementById('filtroFechaDesde').value;
  const fechaHasta = document.getElementById('filtroFechaHasta').value;
  const servicio = document.getElementById('filtroServicio').value.toLowerCase();

  const filtradas = facturasCargadas.filter(f => {
    const noFactura = (f.noFactura || "").toString().toLowerCase();
    const clienteF = (f.cliente || "").toString().toLowerCase();
    const fechaF = (f.fecha || "").toString(); // formato 'yyyy-mm-dd'
    const servicioF = (f.servicio || "").toString().toLowerCase();

    const dentroDeRango =
      (!fechaDesde || fechaF >= fechaDesde) &&
      (!fechaHasta || fechaF <= fechaHasta);

    return (
      noFactura.includes(factura) &&
      clienteF.includes(cliente) &&
      servicioF.includes(servicio) &&
      dentroDeRango
    );
  });

  renderizarFacturas(filtradas);
}



function limpiarFiltros() {
  document.getElementById('filtroFactura').value = '';
  document.getElementById('filtroCliente').value = '';
  document.getElementById('filtroFechaDesde').value = '';
  document.getElementById('filtroFechaHasta').value = '';
  document.getElementById('filtroServicio').value = '';
  renderizarFacturas(facturasCargadas); // Mostrar todo de nuevo
}

 // Ejecutar al cargar
 consultarFacturas();



 function formatearMoneda(input) {
  let valor = input.value.replace(/[^\d.-]/g, ''); // Eliminar todo excepto números y punto

  // Evitar múltiples puntos
  let partes = valor.split('.');
  if (partes.length > 2) {
    valor = partes[0] + '.' + partes.slice(1).join('');
  }

  let numero = parseFloat(valor);
  if (!isNaN(numero)) {
    input.value = "DOP " + numero.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } else {
    input.value = "";
  }
}

function obtenerMontoSinFormato() {
  let valor = document.getElementById("monto").value;
  let limpio = valor.replace(/[^\d.-]/g, '');
  return parseFloat(limpio) || 0;
}



