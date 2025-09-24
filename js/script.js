let habitos = [];
function menu() {
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
  return opcion;
}

const agregarHabito = (habitos, nombre) => {
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

let opcion;
while ((opcion = menu()) !== "6") {
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
    default:
      console.log("Opción inválida");
      break;
  }
}
alert("¡Excelente avance!, ¡nos vemos pronto!");
