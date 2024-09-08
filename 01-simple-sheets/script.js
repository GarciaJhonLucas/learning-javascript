// Variables del entorno
const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

const $table = $('table');
const $head = $('thead');
const $body = $('tbody');

const ROWS = 5//50;
const COLUMNS = 4//40;
const FIRST_CHAR_CODE = 65;

const times = length => Array.from({ length }, (_, i) => i);
const getColumn = i => String.fromCharCode(FIRST_CHAR_CODE + i);

let STATE = times(COLUMNS).map(i => times(ROWS).map(() => ({ computedValue: 0, value: '' })))

function isText(value) {
    // Verifica si el valor contiene solo letras y espacios
    const textRegex = /^[a-zA-Z\s]+$/;
    return textRegex.test(value);
}

function generateCellsConstats(cells) {
    return cells.map((rows, x) => {
        return rows.map((cell, y) => {
            const letter = getColumn(x)
            const cellId = `${letter}${y + 1}`
            if (isText(cell.computedValue) || cell.computedValue === "") cell.computedValue = 0
            return `const ${cellId} = ${cell.computedValue};`
        }).join('\n ')
    }).join('\n ')
}

function computeValue(value, contants) {
    if (typeof value === 'number') return value
    if (!value.startsWith('=')) return value

    const formula = value.slice(1)

    let computedValue
    try {
        computedValue = eval(`(()=>{
                ${contants}
                return ${formula};
            })()`)
    } catch (error) {
        computedValue = `!ERROR: ${error.message}`
    }
    return computedValue
}

function computedAllCells(cells, constants) {
    cells.forEach((rows, x) => {
        rows.forEach((cell, y) => {
            const computedValue = computeValue(cell.value, constants);
            cell.computedValue = computedValue;
        });
    });
}

function updateCell({ x, y, value: value }) {
    const newState = structuredClone(STATE)
    const contants = generateCellsConstats(newState)
    console.log('get data from server: ', contants);
    const cell = newState[x][y]
    const computedValue = computeValue(value, contants)
    cell.computedValue = computedValue
    cell.value = value
    newState[x][y] = cell
    computedAllCells(newState, generateCellsConstats(newState))
    STATE = newState
    renderSpreadSheet()
}

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
                <span>${STATE[column][row].computedValue}</span>
                <input type="text" value="${STATE[column][row].value}" />
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

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') input.blur()
    })

    // Caso que salgamos del input
    input.addEventListener('blur', () => {
        if (input.value === STATE[x][y].value) return;
        updateCell({ x, y, value: input.value })
    }, { once: true })
})

renderSpreadSheet()