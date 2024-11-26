"use strict";

// Variables
let dinero = null;
let saldoInicial = null;
const Negros = ["2", "4", "6", "8", "10", "11", "13", "15", "17", "19", "21", "23", "25", "27", "30", "32", "34", "36"];
const Rojos = ["1", "3", "5", "7", "9", "12", "14", "16", "18", "20", "22", "24", "26", "28", "29", "31", "33", "35"];

let numeroGanador = null; 
let apuestas = [];

// Definir las etiquetas donde se guardan los valores de dinero
const DineroLabel = document.getElementById("dinersActual");
const DineroLabelAposta = document.getElementById("apostaActual");
DineroLabelAposta.textContent = "0";

// Función 1 - Solicitar el saldo inicial
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

// Función 2 - Inicializar selección de fichas
function inicializarSeleccionFichas(fichaValores) {
    const fichas = document.querySelectorAll('.fichas');
    fichas.forEach(ficha => {
        ficha.addEventListener('click', () => {
            seleccionarFicha(ficha, fichas, fichaValores);
        });
    });
}

// Función 3 - Cambiar de ficha y guardar su valor
function seleccionarFicha(ficha, fichas, fichaValores) {
    fichas.forEach(f => f.classList.remove('fichaSeleccionada'));
    ficha.classList.add('fichaSeleccionada');
    ficha.dataset.valor = fichaValores[ficha.id];
}

// Función 4 - Inicializar celdas de la ruleta
function inicializarCeldasRuleta(fichaValores) {
    const ruletaCells = document.querySelectorAll('.ruletaTablero td');
    ruletaCells.forEach(cell => {
        cell.addEventListener('click', () => Aposta(cell, fichaValores));
    });
}

//Función 5 - Colocar ficha en la celda y registrar apuesta
function Aposta(cell, fichaValores) {
    const selectedFicha = document.querySelector('.fichaSeleccionada');
    if (!selectedFicha) return;  // Si no hay ficha seleccionada, no hacer nada.

    const saldoActual = parseFloat(DineroLabel.textContent);
    const apuestaActual = parseFloat(DineroLabelAposta.textContent);

    const valorFichaSeleccionada = parseFloat(selectedFicha.dataset.valor);  // Valor de la ficha seleccionada.
    
    // Si ya hay una ficha en la celda, eliminarla y devolver el dinero
    const existeixFicha = cell.querySelector('img.fichaEnCelda');
    if (existeixFicha) {
        const valorFichaEnCelda = parseFloat(existeixFicha.dataset.valor);  // Valor de la ficha ya existente en la celda.
        
        // Eliminar la ficha de la celda
        cell.removeChild(existeixFicha);
        
        // Devolver el dinero al saldo
        DineroLabel.textContent = (saldoActual + valorFichaEnCelda).toFixed(2);
        DineroLabelAposta.textContent = (apuestaActual - valorFichaEnCelda).toFixed(2);
        return;
    }

    // Si el saldo es suficiente para apostar la ficha seleccionada
    if (saldoActual >= valorFichaSeleccionada) {
        const existeixFicha = cell.querySelector('img');  // Comprobar si ya hay una ficha en la celda
        if (!existeixFicha) {
            const img = document.createElement('img');
            img.src = `IMG/${selectedFicha.id}.png`;
            img.className = 'fichaEnCelda';
            img.dataset.valor = valorFichaSeleccionada;  
            img.onload = () => {
                cell.appendChild(img);
            };

            // Actualizar el saldo y las apuestas
            DineroLabel.textContent = (saldoActual - valorFichaSeleccionada).toFixed(2);
            DineroLabelAposta.textContent = (apuestaActual + valorFichaSeleccionada).toFixed(2);

            // Registrar la apuesta
            registrarApuesta(cell); 
        }
    } else {
        alert("No tens prou saldo per apostar aquesta fitxa.");
    }
}

// Función 6 - Registrar el número apostado
function registrarApuesta(celda) {
    const numero = celda.textContent.trim();
    if (!apuestas.includes(numero)) {
        apuestas.push(numero);
    }
}

// Función 7 - Limpiar apuestas
function limpiarApuestas() {
    const fichasCeldas = document.querySelectorAll('.ruletaTablero td img');
    fichasCeldas.forEach(ficha => ficha.remove());

    apuestas = [];
    DineroLabel.textContent = saldoInicial.toFixed(2);
    DineroLabelAposta.textContent = "0";
}

// Función 8 - Girar la ruleta y determinar el número ganador
function girarRuleta() {
    const ruletaCell = document.querySelectorAll('.ruletaTable td');
    const randomNum = Math.floor(Math.random() * ruletaCell.length);
    const randomCell = ruletaCell[randomNum];

    const pelotaImg = document.createElement('img');
    pelotaImg.src = 'IMG/pelota.png';
    pelotaImg.className = 'pelota';
    randomCell.appendChild(pelotaImg);

    iniciarAnimacionRuleta(ruletaCell, randomNum, pelotaImg);
}

// Función 9 - Iniciar animación de la ruleta
function iniciarAnimacionRuleta(ruletaCells, indexAleatori, pelotaImg) {
    const numMovimientos = Math.floor(Math.random() * (250 - 90)) + 90;
    let indexActual = indexAleatori;
    let movContador = 0;
    let tempsInterval = 50;

    const moverPelota = () => {
        ruletaCells[indexActual].querySelector('img').remove();

        indexActual = (indexActual - 1 + ruletaCells.length) % ruletaCells.length;

        ruletaCells[indexActual].appendChild(pelotaImg);

        movContador++;

        if (movContador >= Math.floor(numMovimientos * 0.8)) {
            tempsInterval += 12; 
        }
        
        if (movContador >= numMovimientos) {
            DineroLabelAposta.textContent = "0";

            guardarNumeroGanador(ruletaCells[indexActual]); 
            comprobarGanador(); 

            setTimeout(() => {
                const imgFinal = ruletaCells[indexActual].querySelector('img');
                if (imgFinal) {
                    imgFinal.remove();
                }
            }, 6000);
        } else {
            setTimeout(moverPelota, tempsInterval);
        }
    };
        
    setTimeout(moverPelota, tempsInterval);
}

// Función 10 - Guardar el número ganador
function guardarNumeroGanador(celda) {
    numeroGanador = celda.textContent.trim();
}

// Función 11 - Comprobar si hay un ganador
function comprobarGanador() {
    // Eliminar todas las fichas apostadas en el tablero de la ruleta
    const ruletaCellsAposta = document.querySelectorAll('.ruletaTablero td');
    ruletaCellsAposta.forEach(cell => {
        const ficha = cell.querySelector('img.fichaEnCelda');
        if (ficha) {
            ficha.remove(); // Eliminar la ficha de la celda
        }
    });

    // Comprobar si el número ganador está en las apuestas
    const resultadoLabel = document.querySelector('.resultat');
    if (apuestas.includes(numeroGanador)) {
        resultadoLabel.classList.add('mostrar');
        resultadoLabel.textContent = "Has guanyat!";
        

        setTimeout(() => {
            resultadoLabel.classList.remove('mostrar');
        }, 5000);
    } 
    // Limpiar las apuestas 
    apuestas = [];
    DineroLabelAposta.textContent = "0";
}



// Función 12 - Inicializar el juego
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
