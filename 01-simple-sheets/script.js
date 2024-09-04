// Variables del entorno
const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

const $table = $('table');
const $head = $('thead');
const $body = $('tbody');

const ROWS = 100;
const COLUMNS = 40;
const FIRST_CHAR_CODE = 65;

const times = length => Array.from({ length }, (_, i) => i);
const getColumn = i => String.fromCharCode(FIRST_CHAR_CODE + i);

let STATE = times(COLUMNS).map(i => times(ROWS).map(() => ({ computedValue: 0, value: '' })))

const renderSpreadSheet = () => {

    const headerHTML = `<tr>
    <th></th>
    ${times(COLUMNS).map(i => `<th>${getColumn(i)}</th>`).join('')}
    </tr>`
    $head.innerHTML = headerHTML;

    // Vamos a usar el rango de filas y para cada fila vamos a dibujar cada fila y para cada espacio
    // y despues creaamos las celdas para cada columna
    const bodyHTML = times(ROWS).map(row => {
        return `<tr>
        <td>${row + 1}</td>
        ${times(COLUMNS).map(column => `
            <td data-x="${column}" data-y="${row}">
                <span></span>
                <input type="text" value="" />
            </t>
            `).join('')}
    </tr>`
    }).join('')
    $body.innerHTML = bodyHTML;
}

// Escuchamos los eventos del click del body
$body.addEventListener('click', event => {
    //Buscamos acceder al td del body
    const td = event.target.closest('td');
    if (!td) return;

    // accesos del dataset
    const { x, y } = td.dataset;

    // accedermos al input
    const input = td.querySelector('input')
    const span = td.querySelector('span')

    const endInputValue = input.value.length
    input.setSelectionRange(endInputValue, endInputValue)
    //input.setSelectionRange(0, endInputValue) selecion all elements
    input.focus();

    // Caso que salgamos del input
    input.addEventListener('blur', () => {
        console
    })
})

renderSpreadSheet()