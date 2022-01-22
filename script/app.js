const connectBtn = document.getElementById('connectToServer')
const disconnectBtn = document.getElementById('disconnectToServer')
const sortSymbolBtn = document.getElementById('sortSymbol')
const traderList = document.getElementById('trader-list')
const handlerMessage = document.getElementById('handler-message')

let getAllSymbols = [];
let sortOrder = false;

function changeSubstrSymbol(str) {
    return str.substr(0, 3) + " / " + str.substr(3, str.length)
}

//receiving a response is an array of symbols, each symbol with selected fields
function fetchData(data) {
    data["Symbols"].map(item => {
        if (item['Category'].includes('CRYPTO')) {
            getAllSymbols.push({
                id: item.id,
                Digits: item.Digits,
                OutputName: changeSubstrSymbol(item.OutputName.split('.')[0]),
                Bid: item.Bid.toFixed(item.Digits),
                Category: item.Category
            })
        }
    });
}
//sorted symbol list alphabetically and implemented switch to ascending/descending
function sortData(array) {
    sortOrder = !sortOrder;
    return array.sort((a, b) => {
        if (sortOrder) {
            if (a.OutputName < b.OutputName) {
                return -1;
            }
            if (a.OutputName > b.OutputName) {
                return 1;
            }
            return 0;
        } else {
            if (a.OutputName > b.OutputName) {
                return -1;
            }
            if (a.OutputName < b.OutputName) {
                return 1;
            }
            return 0;
        }
    })
}
//drawing a list of symbols
function render(getQuotes) {
    traderList.innerHTML = ''
    if (getAllSymbols.length > 0) {
        getAllSymbols.map((item) => {
            let superColor;
            let arrow;
            getQuotes.map(item2 => {
                if (item.id === item2[0]) {
                    if (+item['Bid'] < item2[1]) {
                        superColor = 'green'
                        arrow = 'arrow_upward'
                    } else if (+item['Bid'] > item2[1]) {
                        superColor = 'red'
                        arrow = 'arrow_downward'
                    } else if (+item['Bid'] === item2[1]) {
                        arrow = 'none'
                        superColor = '#fff'
                    }
                    item['Bid'] = item2[1];
                }
            })
            traderList.innerHTML += `
                <li class="currency-item">
                    <div style="width: 100px">${item.OutputName}</div>
                    <div class="currency-bid" style="color:${superColor}">${item.Bid}
                        <span>
                            <i class="material-icons" style="color:${superColor}; margin: 0; padding: 0">${arrow}</i>
                        </span>
                    </div>
                </li>`
        })
    } else {
        traderList.innerHTML = ''
    }
}

function alertErrorHandler(message) {
    handlerMessage.innerHTML = `${message}`
}

sortSymbolBtn.addEventListener('click', () => {
    sortData(getAllSymbols)
})

connectBtn.addEventListener('click', function () {
    initSocket(true)
})

disconnectBtn.addEventListener('click', () => {
    traderList.innerHTML = ''
    getAllSymbols.length = 0
    initSocket(false)
})