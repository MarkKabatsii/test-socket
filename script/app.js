class Trader {
    constructor() {
        this.getAllSymbols = []
        this.sortOrder = false;
    }

    //receiving a response is an array of symbols, each symbol with selected fields
    fetchData(data) {
        data["Symbols"].map(item => {
            if (item['Category'].includes('CRYPTO')) {
                this.getAllSymbols.push({
                    id: item.id,
                    Digits: item.Digits,
                    OutputName: this.changeSubstrSymbol(item.OutputName.split('.')[0]),
                    Bid: item.Bid.toFixed(item.Digits),
                    Category: item.Category
                })
            }
        });
    }

    changeSubstrSymbol(str) {
        return str.substr(0, 3) + " / " + str.substr(3, str.length)
    }

//sorted symbol list alphabetically and implemented switch to ascending/descending
    sortData(array) {
        this.sortOrder = !this.sortOrder;
        return array.sort((a, b) => {
            if (this.sortOrder) {
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

    initSocket(socket) {
        socket.connect()
        trader.alertErrorHandler('')
        /*
            MT4GetAllSymbols - Emit notes:
            - Used to request a list of all symbols, should be used once socket connected
        */
        socket.emit('MT4GetAllSymbols', {reqId: parseInt(Math.random() * 9999)});
        /*
        quotesSubscribe - Emit notes:
        - subscribe to "quotes" stream
        */
        socket.emit('quotesSubscribe', {real: 0, reqID: parseInt(Math.random() * 9999)});

    }

    disconnectSocket(socket) {
        socket.disconnect();
    }

//drawing a list of symbols
    render(getQuotes) {
        traderList.innerHTML = ''
        if (this.getAllSymbols.length > 0) {
            this.getAllSymbols.map((item) => {
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

    alertErrorHandler(message) {
        handlerMessage.innerHTML = `${message}`
    }

}