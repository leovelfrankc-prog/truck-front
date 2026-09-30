function router(modulo) {
  console.log("[ROUTER] Navegando a:", modulo);

  const vista = window[modulo];

  if (!vista || typeof vista.html !== "string") {
    console.error(`[ROUTER] Módulo no encontrado: "${modulo}"`);
    console.log(
      "[ROUTER] Módulos disponibles:",
      Object.keys(window).filter(k => window[k] && typeof window[k].html === "string")
    );

    const contenedor = document.getElementById("vistas");
    if (contenedor) {
      contenedor.innerHTML = `
        <div style="padding:20px;color:#b91c1c;font-family:monospace;">
          Módulo no encontrado: <strong>${modulo}</strong>
        </div>
      `;
    }
    return;
  }

  document.getElementById("vistas").innerHTML = vista.html;
}
