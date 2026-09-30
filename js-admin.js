// ============================================================
// INIT
// ============================================================
function init_admin(initData) {
  console.log("[admin] init_admin()", initData);
}

// ============================================================
// OBJETO GLOBAL window.admin
// ============================================================
window.admin = {

  html: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <h2 class="mb-3">Panel de Administración</h2>
          <p class="text-muted mb-4">Vista de prueba del módulo admin</p>

          <div class="card shadow-sm">
            <div class="card-body">
              <p class="mb-3">Has entrado correctamente al módulo <strong>admin</strong>.</p>
              <button 
                type="button" 
                class="btn btn-outline-primary btn-sm"
                onclick="alert('Módulo admin funcionando')">
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

};
