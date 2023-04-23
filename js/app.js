//Variables
const formulario = document.querySelector("#formulario");

const resultado = document.querySelector("#resultado");

let loading = false;

//Listeners
document.addEventListener("DOMContentLoaded", () => {
  formulario.addEventListener("submit", validarFormulario);
});

//Funciones

function validarFormulario(e) {
  e.preventDefault();

  //Variables de los input
  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  //validacion
  if (ciudad === "" || pais === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  //Hacer la consulta a la API
  consultarTiempo(ciudad, pais);
}

function mostrarAlerta(msg) {
  const alertaExiste = document.querySelector(".bg-red-500");

  if (alertaExiste) return;

  const alerta = document.createElement("p");
  alerta.classList.add(
    "bg-red-500",
    "text-white",
    "text-center",
    "p-3",
    "mt-3",
    "rounded"
  );
  alerta.textContent = msg;

  formulario.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

function consultarTiempo(ciudad, pais) {
  cargando();
  const API_KEY = "7f81623c9124d15ee220956b9c2132c9";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${API_KEY}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.cod === "404") {
        mostrarAlerta("La ciudad no existe");
        return;
      }
      mostrarTiempo(datos.main);
    })
    .catch((e) => {
      mostrarAlerta("Hubo un fallo en la consulta");
      console.log(e);
    });
}

function mostrarTiempo(tiempo) {
  //limpiar html
  limpiarHtml();
  console.log(tiempo);
  const { feels_like, humidity, temp, temp_max, temp_min } = tiempo;

  const currentTemperature = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);
  const sensacionTermica = kelvinACentigrados(feels_like);

  const svgSun = document.createElement("div");
  svgSun.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ecc94b" class="w-40 h-40 mx-auto">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
  
    `;
  const svgCloud = document.createElement("div");
  svgCloud.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ecc94b" class="w-40 h-40 mx-auto">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
  </svg>
  
    `;

  const temperatura = document.createElement("h2");
  temperatura.classList.add("text-6xl", "text-white", "text-center");
  temperatura.textContent = `${currentTemperature} °C`;

  const temperaturaMax = document.createElement("p");
  temperaturaMax.classList.add("text-2xl", "text-white", "text-center");
  temperaturaMax.textContent = `Máximo ${max} °C`;

  const temperaturaMin = document.createElement("p");
  temperaturaMin.classList.add("text-2xl", "text-white", "text-center");
  temperaturaMin.textContent = `Mínimo ${min} °C`;

  const sensacion = document.createElement("p");
  sensacion.classList.add("text-2xl", "text-white", "text-center");
  sensacion.textContent = `Sensación térmica ${sensacionTermica} °C`;

  const humedad = document.createElement("p");
  humedad.classList.add("text-2xl", "text-white", "text-center");
  humedad.textContent = `Humedad ${humidity} %`;

  if (currentTemperature >= 20) {
    resultado.appendChild(svgSun);
  } else {
    resultado.appendChild(svgCloud);
  }
  resultado.appendChild(temperatura);
  resultado.appendChild(temperaturaMax);
  resultado.appendChild(temperaturaMin);
  resultado.appendChild(sensacion);
  resultado.appendChild(humedad);
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

const cargando = () => {
  limpiarHtml();
  loading = true;
  const contenedor = document.createElement("div");
  contenedor.classList.add("contenedor");
  contenedor.innerHTML = `
        <div class="cloud front">
        <span class="left-front"></span>
        <span class="right-front"></span>
    </div>
    <span class="sun sunshine"></span>
    <span class="sun"></span>
    <div class="cloud back">
        <span class="left-back"></span>
        <span class="right-back"></span>
    </div>
    `;
  resultado.appendChild(contenedor);
};
