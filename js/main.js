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
        listaFechas.appendChild(item);
      });
    } else {
      // Si no hay fechas, muestro mensaje
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

/**const agregarHabito = (habitos, nombre) => {
  habitos.push([nombre, false, []]);
  console.log("Su hábito fue guardado con éxito");
};

const listarHabitos = (habitos) => {
  let contador = 0;
  for (const habito of habitos) {
    console.log(
      `Numero ${contador}: ${habito[0]} - Realizado: ${habito[1]} - Registros: ${habito[2]}`
    );
    contador++;
  }
};

const obtenerIndiceOk = (habitos, mensaje) => {
  let indice = parseInt(prompt(mensaje), 10);
  if (!isNaN(indice) && indice >= 0 && indice < habitos.length) {
    return indice;
  } else {
    alert("Número incorrecto");
    return null;
  }
};

function eliminarHabito(habitos) {
  listarHabitos(habitos);
  const indice = obtenerIndiceOk(
    habitos,
    "Ingrese el número del hábito que desea eliminar:"
  );
  if (indice !== null && confirm("¿Estás seguro de eliminar este hábito?")) {
    habitos.splice(indice, 1);
    alert("Hábito eliminado correctamente");
  }
}

function modificarHabito(habitos) {
  listarHabitos(habitos);
  const indice = obtenerIndiceOk(
    habitos,
    "Ingrese el número del hábito que desea modificar:"
  );
  if (indice !== null) {
    habitos[indice][0] = prompt(
      "Nombre actual: " + habitos[indice][0] + "\n Ingrese nuevo nombre: "
    );
    alert("Hábito modificado correctamente");
  }
}

function registrarHabito(habitos) {
  listarHabitos(habitos);
  const indice = obtenerIndiceOk(
    habitos,
    "Ingrese el habito sobre el cual desea registrar avances:"
  );
  if (indice !== null) {
    habitos[indice][1] = true;
    habitos[indice][2].push(new Date());
    alert("Felicitaciones! registramos tu avance, estas mas cerca de tu meta!");
  }
}
continuar = true;
while (continuar) {
  let opcion = prompt(
    "***********************************\n" +
      "Seleccione la opción deseada:\n" +
      "1. Agregar un hábito\n" +
      "2. Eliminar un hábito\n" +
      "3. Modificar un hábito\n" +
      "4. Registrar que un habito fue realizado\n" +
      "5. Listar tus habitos\n" +
      "6. Salir\n" +
      "**********************************"
  );
  switch (opcion) {
    case "1":
      agregarHabito(habitos, prompt("Ingrese nombre del habito a agregar:"));
      break;
    case "2":
      eliminarHabito(habitos);
      break;
    case "3":
      modificarHabito(habitos);
      break;
    case "4":
      registrarHabito(habitos);
      break;
    case "5":
      listarHabitos(habitos);
      break;
    case "6":
      continuar = false;
      break;
    default:
      console.log("Opción inválida");
      break;
  }
}
alert("¡Excelente avance!, ¡nos vemos pronto!");**/

// let precio = document.getElementById("precio")
// let cuotas = document.getElementById("cuotas")
// let calcular = document.getElementById("calcular")

// calcular.onclick = () => {
//     let precioFinal = precio.value/cuotas.value
//     // console.log(precioFinal)

//     let print = document.createElement("h3")
//     print.innerHTML = `Son ${cuotas.value} cuotas de $${precioFinal}`
//     document.body.append(print)
