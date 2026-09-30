// ============================================================
// INIT
// ============================================================
function init_chofer(initData) {
  console.log("[chofer] init_chofer()", initData);
}

// ============================================================
// OBJETO GLOBAL window.chofer
// ============================================================
window.chofer = {

  html: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <h2 class="mb-3">Panel del Chofer</h2>
          <p class="text-muted mb-4">Vista de prueba del módulo chofer</p>

          <div class="card shadow-sm">
            <div class="card-body">
              <p class="mb-3">Has entrado correctamente al módulo <strong>chofer</strong>.</p>
              <button 
                type="button" 
                class="btn btn-outline-primary btn-sm"
                onclick="alert('Módulo chofer funcionando')">
                Probar botón
              </button>
            </div>
          </div>

          <p class="text-muted mt-4" style="font-size: 0.85rem;">
            Esta es una vista temporal de prueba.
          </p>
        </div>
      </div>
    </div>
  `

console.log("[CHOFER] módulo chofer cargado");

};
