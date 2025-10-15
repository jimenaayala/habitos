let habitosContainer = document.getElementById("habitos-container");

const habitos = [];
let cartStorage = localStorage.getItem("cardHabitos");
if (cartStorage) {
  cartStorage = JSON.parse(cartStorage);
  cartStorage.forEach((habito) => {
    habito.fechasRealizadas = habito.fechasRealizadas.map(
      (fecha) => new Date(fecha)
    );

    habitos.push(habito);
  });
}

renderHabitos(habitos);

let nombre = document.getElementById("idNombreHabito");
let guardarHabito = document.getElementById("guardarHabito");
guardarHabito.onclick = (e) => {
  e.preventDefault();
  mensaje.textContent = "";
  const existe = habitos.some(
    (habito) => habito.nombre.toLowerCase() === nombre.value.toLowerCase()
  );

  if (existe) {
    mensaje.textContent = "Ese hábito ya existe";
    return;
  }

  const nuevoHabito = {
    id: habitos.length + 1,
    nombre: nombre.value,
    fechasRealizadas: [],
  };

  habitos.push(nuevoHabito);
  nombre.value = "";
  //console.log(nuevoHabito);
  renderHabitos(habitos);
  localStorage.setItem("cardHabitos", JSON.stringify(habitos));
};

function marcarComoRealizado(habito) {
  const hoy = new Date();
  habito.fechasRealizadas.push(hoy);
  console.log(habito);
  //alert("su habito se registro");
}

function renderHabitos(habitosArray) {
  habitosContainer.innerHTML = "";
  habitosArray.forEach((habito) => {
    const card = document.createElement("div");
    const listaFechas = document.createElement("ul");
    if (habito.fechasRealizadas.length > 0) {
      habito.fechasRealizadas.forEach((fecha) => {
        const item = document.createElement("li");
        item.textContent = new Date(fecha).toLocaleDateString();
        //item.textContent = new Date(fecha + "T00:00:00").toLocaleString();
        listaFechas.appendChild(item);
      });
    } else {
      const item = document.createElement("li");
      item.textContent = "Sin avance";
      listaFechas.appendChild(item);
    }

    card.innerHTML = `<h3>${habito.nombre}</h3>
                    <button class="habitoRegistrar" id="${habito.id}">Registrar Avance</button>`;
    card.appendChild(listaFechas);
    habitosContainer.appendChild(card);
  });
  addToCardButton();
}
function addToCardButton() {
  addButton = document.querySelectorAll(".habitoRegistrar");
  addButton.forEach((button) => {
    button.onclick = (e) => {
      const habitoId = e.currentTarget.id;
      const habitoSeleccionado = habitos.find(
        (habito) => habito.id == habitoId
      );
      //console.log(habitoSeleccionado);
      marcarComoRealizado(habitoSeleccionado);
      renderHabitos(habitos);
      localStorage.setItem("cardHabitos", JSON.stringify(habitos));
    };
  });
}
