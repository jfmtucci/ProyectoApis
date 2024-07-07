const coinsList = document.querySelector("#monedas");
const apiURL = "https://mindicador.cl/api";
const cantidad = document.querySelector("#cantidad-convertir");
const resultado = document.querySelector("#resultado");
const btn = document.querySelector("#button");
const canvas = document.getElementById("myChart");
let data = {},
  dataGraphic = [],
  dataDate = [];

async function getCoins() {
  try {
    const res = await fetch(apiURL);
    const monedas = await res.json();
    return monedas;
  } catch (err) {
    console.log(err);
    return {};
  }
}

async function indicadores() {
  try {
    // console.log(coinsList.value);
    const res = await fetch(`https://mindicador.cl/api/${coinsList.value}`);
    const tipoIndicador = await res.json();
    //console.log(tipoIndicador);
    return tipoIndicador;
  } catch (err) {
    console.log(err);
    return {};
  }
}

async function renderMonedas() {
  try {
    const monedas = await getCoins();

    data = monedas;
    //console.log(data);
    if (!monedas || Object.keys(monedas).length === 0) {
      throw new Error("No data available");
    }

    let template = "";

    Object.keys(monedas).forEach((moneda, i) => {
      if (monedas[moneda].codigo && monedas[moneda].nombre) {
        template += `<option value="${monedas[moneda].codigo}">${monedas[moneda].nombre}</option>`;
      }
    });
    coinsList.innerHTML += template;
    //resul();
  } catch (err) {
    console.log(err);
  }
}

async function resul() {
  try {
    const tipoIndicador = await indicadores();
    //console.log(tipoIndicador);
    dataGraphic = [];
    dataDate = [];
    const nombreaBuscar = coinsList.value;
    let numero;
    //console.log(data);
    if (data && data[nombreaBuscar]) {
      const valor = data[nombreaBuscar].valor;
      numero = formatearNumero(parseInt(cantidad.value) * valor);
      resultado.innerHTML = `Resultado: ${numero}`;

      tipoIndicador.serie.forEach((e) => {
        dataDate.push(e.fecha);
        dataGraphic.push(e.valor);
      });

      //console.log(dataDate, dataGraphic);
      getAndCreateDataToChart();
    }
  } catch (err) {
    console.log(err);
  }
}

btn.addEventListener("click", () => {
  resul();
});

function formatearNumero(numero) {
  const parts = Number(numero).toFixed(2).split(".");
  let integerPart = parts[0];
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${integerPart},${parts[1]}`;
}

let myChart;

function getAndCreateDataToChart() {
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: dataDate,
      datasets: [
        {
          label: coinsList.value,
          data: dataGraphic,
          backgroundColor: "rgb(247,252,252)",
          borderColor: "grey",
          Width: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
renderMonedas();
