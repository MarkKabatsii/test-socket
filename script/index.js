const connectBtn = document.getElementById('connectToServer')
const disconnectBtn = document.getElementById('disconnectToServer')
const sortSymbolBtn = document.getElementById('sortSymbol')
const traderList = document.getElementById('trader-list')
const handlerMessage = document.getElementById('handler-message')

const trader = new Trader()

sortSymbolBtn.addEventListener('click', () => {
    trader.sortData(trader.getAllSymbols)
})

connectBtn.addEventListener('click', function () {
    trader.initSocket(socket)
})

disconnectBtn.addEventListener('click', () => {
    traderList.innerHTML = ''
    trader.getAllSymbols.length = 0
    trader.disconnectSocket(socket)
})