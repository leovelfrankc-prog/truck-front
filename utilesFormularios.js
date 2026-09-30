function crearFormulario(config) {

  const {
    titulo = "",
    campos = [],
    botones = [],
    idFormulario = "formDinamico"
  } = config;

  let html = `
    <h4 class="mb-3">${titulo}</h4>
    <form id="${idFormulario}">
  `;

  // ---------------------------------------------------------
  // CAMPOS DINÁMICOS
  // ---------------------------------------------------------
  campos.forEach(campo => {

    html += `<div class="mb-3">`;

    if (campo.label) {
      html += `<label class="form-label">${campo.label}</label>`;
    }

    switch (campo.tipo) {

      case "select":
        html += `<select class="form-select" id="${campo.nombre}">`;
        campo.opciones.forEach(op => {
          html += `<option value="${op}" ${campo.valor === op ? "selected" : ""}>${op}</option>`;
        });
        html += `</select>`;
        break;

      case "textarea":
        html += `
          <textarea 
            class="form-control" 
            id="${campo.nombre}" 
            rows="${campo.filas || 3}"
          >${campo.valor || ""}</textarea>
        `;
        break;

      default:
        html += `
          <input 
            type="${campo.tipo}" 
            class="form-control" 
            id="${campo.nombre}"
            value="${campo.valor || ""}"
            placeholder="${campo.placeholder || ""}"
          />
        `;
    }

    html += `</div>`;
  });

  // ---------------------------------------------------------
  // BOTONES DINÁMICOS
  // ---------------------------------------------------------
  html += `<div class="text-end">`;

  botones.forEach(btn => {
    html += `
      <button 
        type="button" 
        class="btn ${btn.clase || "btn-primary"} me-2"
        data-event="${btn.evento}"
      >
        ${btn.texto}
      </button>
    `;
  });

  html += `</div></form>`;

  return html;
}
