async function router(modulo) {
  // Capturamos la variable global TOKEN definida en index.html
  

  console.group(`[ROUTER] Cargando módulo: "${modulo}"`);
  console.log("--> 1. Parámetros de entrada:", { modulo, token });

  try {
    console.log("--> 2. Solicitando datos a apiFetch...");
    const respuesta = await apiFetch({
      modulo,
      accion: "cargarVista",
      
      payload: {}
    });

    console.log("--> 3. Respuesta de apiFetch recibida:", respuesta);

    if (!respuesta) {
      console.error("❌ ERROR: apiFetch no devolvió nada (undefined/null)");
      return;
    }

    if (!respuesta.ok) {
  alert(JSON.stringify(respuesta, null, 2)); // Corregido: stringify
  console.error("❌ ERROR: la respuesta devolvió ok: false", respuesta.error);
  throw new Error(respuesta.error || "Error al cargar la vista");
}

    // 1. Insertar HTML
    const contenedor = document.getElementById("vistas");
    console.log("--> 4. Buscando contenedor #vistas:", contenedor);

    if (contenedor) {
      console.log("--> 4a. Longitud de respuesta.html:", respuesta.html?.length || 0);
      contenedor.innerHTML = respuesta.html || "";
      console.log("✅ HTML insertado correctamente.");
    } else {
      console.error("❌ ERROR CRÍTICO: No se encontró el elemento DOM con id='vistas'");
    }

    // 2. Insertar JS
    if (respuesta.js) {
      console.log("--> 5. Insertando script JS (longitud:", respuesta.js.length, "caracteres)...");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.textContent = respuesta.js;
      document.body.appendChild(script);
      console.log("✅ Etiqueta <script> adjuntada al body.");
    } else {
      console.warn("⚠️ ADVERTENCIA: respuesta.js vino vacío o undefined.");
    }

    // 3. Ejecutar init[Modulo]() únicamente si existe
    const nombreFuncion = "init" + modulo.charAt(0).toUpperCase() + modulo.slice(1);
    console.log(`--> 6. Buscando función de inicialización: window["${nombreFuncion}"]`);

    const initFuncion = window[nombreFuncion];

    if (typeof initFuncion === "function") {
      console.log(`🚀 Ejecutando ${nombreFuncion}()...`);
      initFuncion(respuesta.initData || {});
      console.log(`✅ ${nombreFuncion}() ejecutada.`);
    } else {
      console.log(`ℹ️ La función ${nombreFuncion} no existe en 'window'. Se omite la ejecución.`);
    }

  } catch (error) {
    console.error("❌ ERROR CAPTURADO EN ROUTER:", error);
  } finally {
    console.groupEnd();
  }
}
