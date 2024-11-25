"use strict";

//Variables dels diners
let dinero = null;
let saldoInicial = null;

//Definir les etiquetes on es guarden els valors dels diners
const DineroLabel = document.getElementById("dinersActual");
const DineroLabelAposta = document.getElementById("apostaActual");
DineroLabelAposta.textContent = "0";

//Funció 1 - Solicitar els diners
function solicitarSaldoInicial() {
    while (true) {
        dinero = prompt("Quants diners vols ingresar?");
        if (!dinero || dinero.trim() === "") {
            alert("No has introduït cap preu.");
            continue;
        }

        dinero = parseFloat(dinero);
        if (!isNaN(dinero) && dinero >= 0.10) {
            saldoInicial = dinero;
            alert(`Has introduït un valor de ${dinero.toFixed(2)} per jugar a la Super Spin.`);
            DineroLabel.textContent = dinero.toFixed(2);
            break;
        } else {
            alert("Error: Només es poden ingresar números o un valor més gran de 0.10.");
        }
    }
}

//Funció 2 - Poder seleccionar fitxes
function inicializarSeleccionFichas(fichaValores) {
    const fichas = document.querySelectorAll('.fichas');
    fichas.forEach(ficha => {
        ficha.addEventListener('click', () => {
            seleccionarFicha(ficha, fichas, fichaValores);
        });
    });
}

//Funció 3 - Cambiar de fitxa i guardar el seu valor
function seleccionarFicha(ficha, fichas, fichaValores) {
    fichas.forEach(f => f.classList.remove('fichaSeleccionada'));
    ficha.classList.add('fichaSeleccionada');
    ficha.dataset.valor = fichaValores[ficha.id];
}

//Funció 4 - Configuració cel·les taula
function inicializarCeldasRuleta(fichaValores) {
    const ruletaCells = document.querySelectorAll('.ruletaTablero td');
    ruletaCells.forEach(cell => {
        cell.addEventListener('click', () => Aposta(cell, fichaValores));
    });
}

//Funció 5 - Colocar fitxa a la cel·la
function Aposta(cell, fichaValores) {
    const selectedFicha = document.querySelector('.fichaSeleccionada');
    if (!selectedFicha) return;
    const valorFicha = parseFloat(selectedFicha.dataset.valor);
    const saldoActual = parseFloat(DineroLabel.textContent);
    const apuestaActual = parseFloat(DineroLabelAposta.textContent);

    if (saldoActual >= valorFicha) {
        const existeixFicha = cell.querySelector('img');
        if (!existeixFicha) {
            const img = document.createElement('img');
            img.src = `/IMG/${selectedFicha.id}.png`;
            img.className = 'fichaEnCelda';
            img.onload = () => {
                cell.appendChild(img);
            };
            DineroLabel.textContent = (saldoActual - valorFicha).toFixed(2);
            DineroLabelAposta.textContent = (apuestaActual + valorFicha).toFixed(2);
        }
    } else {
        alert("No tens prou saldo per apostar aquesta fitxa.");
    }
}

//Funció 6 - Reiniciar Apuesta
function limpiarApuestas() {
    const fichasCeldas = document.querySelectorAll('.ruletaTablero td img');
    fichasCeldas.forEach(ficha => ficha.remove());

    DineroLabel.textContent = saldoInicial.toFixed(2);
    DineroLabelAposta.textContent = "0";
}

//Funció 7 - Inicia animació de girar la ruleta
function girarRuleta() {
    const fichasCeldas = document.querySelectorAll('.ruletaTablero td img');
    fichasCeldas.forEach(ficha => ficha.remove());
    const ruletaCell = document.querySelectorAll('.ruletaTable td');
    const randomNum = Math.floor(Math.random() * ruletaCell.length);
    const randomCell = ruletaCell[randomNum];

    const pelotaImg = document.createElement('img');
    pelotaImg.src = '/IMG/pelota.png';
    pelotaImg.className = 'pelota';
    randomCell.appendChild(pelotaImg);

    iniciarAnimacionRuleta(ruletaCell, randomNum, pelotaImg);
}

//Funció 8 - Moviment de la pilota
function iniciarAnimacionRuleta(ruletaCells, indexAleatori, pelotaImg) {
    const numMovimientos = Math.floor(Math.random() * (170 - 50 + 1)) + 50;
    let indexActual = indexAleatori;
    let movContador = 0;
    let tempsInterval = 50;

    const moverPelota = setInterval(() => {
        ruletaCells[indexActual].querySelector('img').remove();

        indexActual = (indexActual - 1 + ruletaCells.length) % ruletaCells.length;

        ruletaCells[indexActual].appendChild(pelotaImg);

        movContador++;

        if (movContador >= numMovimientos) {
            clearInterval(moverPelota);
            verificarGanador(ruletaCells[indexActual]);
        }
    }, tempsInterval);
}

//Funció 9 - Verificar el guanyador
function verificarGanador(casillaFinal) {
    const fichaEnCasilla = casillaFinal.querySelector('img.fichaEnCelda');
    if (fichaEnCasilla) {
        alert('Felicitats, has guanyat');
    }
}

//Funció 10
document.addEventListener('DOMContentLoaded', () => {
    const fichaValores = {
        "F1": 0.10,
        "F2": 0.20,
        "F3": 0.50,
        "F4": 1.00,
        "F5": 2.00,
        "F6": 5.00,
        "F7": 10.00,
    };

    solicitarSaldoInicial();
    inicializarSeleccionFichas(fichaValores);
    inicializarCeldasRuleta(fichaValores);

    document.getElementById('limpiar').addEventListener('click', limpiarApuestas);
    document.getElementById('girarRule').addEventListener('click', girarRuleta);
});
