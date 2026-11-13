
const SYMBOLS = ["🐯", "💎", "🍀", "🪙", "🐸", "🍊", "⭐"];

const PAYOUTS = {
  "🐯": 12,
  "💎": 8,
  "🍀": 6,
  "🪙": 4,
  "🐸": 3,
  "🍊": 2,
  "⭐": 1.5
};

let balance = Number(localStorage.getItem("spl_balance") || 30);
let turbo = false;
let spinning = false;
let currentGame = "tiger";

const $ = id => document.getElementById(id);

function money(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function updateBalance() {
  $("balance").textContent = money(balance);

  localStorage.setItem("spl_balance", balance);
}

function navigate(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.remove("active");
  });

  $(page).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function openGame(game) {
  currentGame = game;

  const titles = {
    tiger: "🐯 Tigre da Sorte",
    frog: "🐸 Sapo Dourado",
    island: "🌴 Ilha das Moedas"
  };

  $("gameTitle").textContent = titles[game];

  createGrid();

  navigate("game");
}

function createGrid() {
  const grid = $("slotGrid");

  grid.innerHTML = "";

  for (let column = 0; column < 3; column++) {
    const reel = document.createElement("div");

    reel.className = "reel";

    for (let row = 0; row < 3; row++) {
      const cell = document.createElement("div");

      cell.className = "symbol";
      cell.textContent = randomSymbol();

      reel.appendChild(cell);
    }

    grid.appendChild(reel);
  }
}

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function toggleTurbo() {
  turbo = !turbo;

  $("turboButton").textContent =
    turbo ? "TURBO ON" : "TURBO OFF";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 * Resultado definido antes da animação.
 * A animação só revela os símbolos sorteados.
 */
async function spin() {
  if (spinning) return;

  const bet = Number($("bet").value);

  if (!Number.isFinite(bet) || bet <= 0) {
    $("winMessage").textContent = "Escolha uma aposta válida.";
    return;
  }

  if (bet > balance) {
    $("winMessage").textContent = "Créditos insuficientes.";
    return;
  }

  spinning = true;

  $("spinButton").disabled = true;

  balance -= bet;

  updateBalance();

  $("winMessage").textContent = "Girando...";

  // Sorteio de todos os símbolos ANTES do giro.
  const outcome = Array.from(
    { length: 9 },
    () => randomSymbol()
  );

  const cells = [...document.querySelectorAll(".symbol")];

  cells.forEach(cell => {
    cell.classList.remove("winner");
    cell.classList.add("spinning");
  });

  const duration = turbo ? 650 : 1800;

  // Animação independente do resultado.
  await sleep(duration);

  // Revelação sequencial das três colunas.
  for (let column = 0; column < 3; column++) {
    const reelCells = cells.slice(column * 3, column * 3 + 3);

    reelCells.forEach((cell, row) => {
      cell.textContent = outcome[column * 3 + row];
      cell.classList.remove("spinning");
    });

    await sleep(turbo ? 100 : 300);
  }

  const result = calculateResult(outcome, bet);

  if (result.prize > 0) {
    balance += result.prize;

    updateBalance();

    result.winningCells.forEach(index => {
      cells[index].classList.add("winner");
    });

    $("winMessage").textContent =
      "✨ GANHOU " + money(result.prize) + " créditos!";
  } else {
    $("winMessage").textContent = "Mais uma rodada!";
  }

  $("spinButton").disabled = false;

  spinning = false;
}

/*
 * Avaliação de linhas horizontais.
 * Cada linha é avaliada da esquerda para a direita.
 */
function calculateResult(symbols, bet) {
  let prize = 0;
  let winningCells = [];

  for (let row = 0; row < 3; row++) {
    const line = [
      symbols[row],
      symbols[row + 3],
      symbols[row + 6]
    ];

    const first = line[0];

    if (line.every(symbol => symbol === first)) {
      prize += bet * PAYOUTS[first];

      winningCells.push(
        row,
        row + 3,
        row + 6
      );
    } else if (line[0] === line[1] || line[1] === line[2]) {
      const matched = line[0] === line[1]
        ? line[0]
        : line[1];

      prize += bet * PAYOUTS[matched] * 0.15;

      winningCells.push(
        row,
        row + 3,
        row + 6
      );
    }
  }

  return {
    prize: Number(prize.toFixed(2)),
    winningCells
  };
}

/*
 * Pix: não processa pagamentos.
 * Esta seção apenas informa a limitação do GitHub Pages.
 */
function selectPix(value) {
  $("pixPanel").hidden = false;

  $("pixTitle").textContent =
    "Pix de R$ " + value.toFixed(2).replace(".", ",");

  $("pixCode").value =
    "Pix indisponível neste site estático.\n" +
    "Não existe confirmação de pagamento ou crédito automático.";

  $("pixFeedback").textContent =
    "Nenhuma transferência será processada aqui.";

  $("pixPanel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function copyPix() {
  $("pixFeedback").textContent =
    "Não há código de pagamento ativo para copiar.";
}

function backPix() {
  $("pixPanel").hidden = true;
}

/*
 * Cadastro local no navegador.
 */
$("accountForm").addEventListener("submit", event => {
  event.preventDefault();

  const user = {
    name: $("userName").value.trim(),
    email: $("userEmail").value.trim()
  };

  localStorage.setItem("spl_user", JSON.stringify(user));

  $("accountFeedback").textContent =
    "Informações salvas neste dispositivo.";
});

/*
 * Inicialização.
 */
createGrid();
updateBalance();
