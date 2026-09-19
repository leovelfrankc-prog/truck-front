const API_URL =
  "https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec";

async function apiFetch({
  modulo,
  accion,
  tokenFirmado,
  payload = {}
}) {

  try {

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        modulo,
        accion,
        tokenFirmado,
        payload
      })
    });

    const data = await response.json();

    return data;

  } catch (error) {

    console.error("apiFetch:", error);

    return {
      ok: false,
      error: error.message
    };

  }

}
