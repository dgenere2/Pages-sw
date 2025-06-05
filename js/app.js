
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
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("id_token", id_token);
        document.getElementById("r-negocio").textContent = data.negocio
        document.getElementById("r-descipcion").textContent = data.decripcion
        document.getElementById("r-documento").textContent = data.documento
        document.getElementById("resultado").textContent = data.email;
        document.getElementById("logout").style.display = "inline-block";
        document.getElementById("boton-login").innerHTML = ""; // Oculta login
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
    if (emailGuardado) {
      document.getElementById("resultado").textContent = emailGuardado;
      document.getElementById("logout").style.display = "inline-block";
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
     var pricioUnitario = document.getElementById("unitario").value
    var montoTotal = pricioUnitario * cantidad

    if (cantidad == "" || pricioUnitario == ""){ return}
    
    
    document.getElementById("monto").value =  parseFloat(montoTotal).toFixed(2)

    }
  

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./js/sw.js').then(reg => {
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
  var noFactura = getIdDinamico();
  if (!id_token) {
    alert("Debe iniciar sesión para guardar la factura.");
    return;
  }

  console.log("Factura ID:", noFactura);

  const factura = {
    cliente: document.getElementById("cliente").value,
    fecha: document.getElementById("fecha").value,
    servicio: document.getElementById("servicio").value,
    monto: parseFloat(document.getElementById("monto").value).toFixed(2),
    peso: parseFloat(document.getElementById("peso").value).toFixed(2),
    usuario: emailGuardado,
    token: id_token,
    nofactura: noFactura,
    medida: document.getElementById("medida").value,
    preciounidad: document.getElementById("unitario").value 
  };

   document.getElementById("cliente").value = ""
   document.getElementById("fecha").value = ""
   document.getElementById("servicio").value = ""
   document.getElementById("monto").value  = ""
  document.getElementById("peso").value  = ""


  // Mostrar recibo
  document.getElementById("r-cliente").textContent = factura.cliente;
  document.getElementById("r-fecha").textContent = factura.fecha;
  document.getElementById("r-servicio").textContent = factura.servicio;
  document.getElementById("r-monto").textContent = factura.monto;
  document.getElementById("recibo").style.display = "block";
  document.getElementById("r-peso").textContent =  factura.peso 
  document.getElementById("r-factura").textContent =  factura.nofactura
   document.getElementById("r-medida").textContent = " " + factura.medida
   document.getElementById("r-punitario").textContent = factura.preciounidad
  

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

      function getIdDinamico() {
  return new Date().getTime() + '-' + (Math.floor(Math.random() * 100) + 1);

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
}
