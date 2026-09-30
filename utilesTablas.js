function crearTabla(columnas, datos, acciones, clases = "table table-striped") {

  // ----------------------------------------------
  // ENCABEZADOS
  // ----------------------------------------------
  const thead = columnas
    .map(col => `<th>${col}</th>`)
    .join("");

  // ----------------------------------------------
  // FILAS
  // ----------------------------------------------
  const filas = datos.map(item => {

    // Celdas según columnas
    const celdas = columnas
      .map(col => `<td>${item[col]}</td>`)
      .join("");

    // Botones de acción
    const botones = acciones
      .map(a => `
        <button class="btn btn-sm ${a.clase}"
                data-event="${a.evento}"
                data-payload='${JSON.stringify(item)}'>
          ${a.texto}
        </button>
      `)
      .join(" ");

    return `<tr>${celdas}<td>${botones}</td></tr>`;
  }).join("");

  // ----------------------------------------------
  // TABLA FINAL
  // ----------------------------------------------
  return `
    <table class="${clases}">
      <thead>
        <tr>
          ${thead}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>
  `;
}
