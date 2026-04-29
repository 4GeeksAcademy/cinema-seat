import "./style.css";

const rows = 8;
const cols = 10;

function getRequiredElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`No se encontro el elemento requerido: #${id}`);
  }

  return el as T;
}

const seatsEl = getRequiredElement<HTMLDivElement>("seats");
const occupiedCountEl = getRequiredElement<HTMLSpanElement>("occupied-count");
const availableCountEl = getRequiredElement<HTMLSpanElement>("available-count");
const messageEl = getRequiredElement<HTMLParagraphElement>("message");
const adjacentBtn = getRequiredElement<HTMLButtonElement>("adjacent-btn");
const resetBtn = getRequiredElement<HTMLButtonElement>("reset-btn");

let matrix = createMatrix(rows, cols);

function createMatrix(r: number, c: number): number[][] {
  return Array.from({ length: r }, () => Array(c).fill(0));
}

function updateStats(): void {
  let occupied = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 1) occupied++;
    }
  }

  const available = rows * cols - occupied;
  occupiedCountEl.textContent = `Ocupados: ${occupied}`;
  availableCountEl.textContent = `Disponibles: ${available}`;
}

function seatLabel(row: number, col: number): string {
  return `F${String(row + 1).padStart(2, "0")}-A${String(col + 1).padStart(2, "0")}`;
}

function printRoomStateToConsole(): void {
  console.log("\n--- ESTADO ACTUAL DE LA SALA ---");
  for (let r = 0; r < rows; r++) {
    let rowState = "";
    for (let c = 0; c < cols; c++) {
      rowState += matrix[r][c] === 1 ? "X " : "L ";
    }
    console.log(rowState.trim());
  }
}

function renderSeats(): void {
  seatsEl.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `seat ${matrix[r][c] === 1 ? "occupied" : "free"}`;
      button.textContent = seatLabel(r, c);
      button.disabled = matrix[r][c] === 1;
      button.style.animationDelay = `${(r * cols + c) * 8}ms`;

      button.addEventListener("click", () => {
        if (matrix[r][c] === 0) {
          matrix[r][c] = 1;
          messageEl.textContent = `Reservado ${seatLabel(r, c)} correctamente.`;
          renderSeats();
          updateStats();
          printRoomStateToConsole();
        }
      });

      seatsEl.appendChild(button);
    }
  }
}

function findAdjacentSeats(): [number, number, number] | null {
  let r = 0;
  while (r < rows) {
    for (let c = 0; c < cols - 1; c++) {
      if (matrix[r][c] === 0 && matrix[r][c + 1] === 0) {
        return [r, c, c + 1];
      }
    }
    r++;
  }
  return null;
}

adjacentBtn.addEventListener("click", () => {
  const result = findAdjacentSeats();
  if (result) {
    const [r, c1, c2] = result;
    messageEl.textContent = `Sugerencia: ${seatLabel(r, c1)} y ${seatLabel(r, c2)}.`;
  } else {
    messageEl.textContent = "No hay dos asientos contiguos libres en este momento.";
  }
});

resetBtn.addEventListener("click", () => {
  matrix = createMatrix(rows, cols);
  messageEl.textContent = "Sala reiniciada. Todos los asientos estan libres.";
  renderSeats();
  updateStats();
  printRoomStateToConsole();
});

renderSeats();
updateStats();
printRoomStateToConsole();
