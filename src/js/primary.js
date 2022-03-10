$(document).ready(function () {
    console.log("ready!");
    checkDate();
    getAllItem();
});

const myKey = '07E90CE3-1F1C-4AF4-9E61-94851314901D';
const baseUrl = 'https://rest.coinapi.io/v1';
const filterCoin = '?filter_asset_id=BTC;ADA;MATIC;SOL;XRP;ETH;DOGE;DOT;LTC;ATOM;USDT;UNI';
const filterCoinArray = ['BTC', 'ADA', 'MATIC', 'SOL', 'XRP', 'ETH', 'DOGE', 'DOT', 'LTC', 'ATOM', 'USDT', 'UNI'];
// const filterCoinArray = ['BTC'];


const checkDate = () => {
    let chance;
    let tot_ady;
    let today = new Date().getDate();
    localDate = localStorage.getItem("last_used_day");

    if (localStorage.getItem("last_used_day") == null || today > localDate) {
        localStorage.setItem("request_today_apiku", 1);
        localStorage.setItem("last_used_day", today);
        chance = 10 - localStorage.getItem("request_today_apiku");
    } else {
        tot_ady = localStorage.getItem("request_today_apiku");
        localStorage.setItem("request_today_apiku", parseInt(tot_ady) + 1);
        chance = 10 - localStorage.getItem("request_today_apiku");
    }

    alert(`${chance} remaining chance to reload it for today. Please be understand, because i use a free limited CoinAPI.io API :)`);
}

const getPercentageAllItem = async () => {
    for (let index = 0; index < filterCoinArray.length; index++) {
        await findPerItem(filterCoinArray[index]);
    }
}

const getAllItem = async () => {
    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CoinAPI-Key": myKey
            }
        };

        const response = await fetch(`${baseUrl}/assets/${filterCoin}`, options);
        const responseJson = await response.json();

        if (responseJson.error) {
            showResponseMessage(responseJson.error);
        } else {

            //LOOPING EVERY FITEM
            for (const element of responseJson.slice(0, 15)) {
                await appendItem(element);

            }

            //UNCOMMENT THIS BELLOW PLEASE IF YOU WANT TO SEE THE PERCENTAGE
            getPercentageAllItem();

        }
    } catch (error) {
        showResponseMessage(error);
    }
}

const appendItem = async (item) => {
    const itemWilappended = await renderItem(item);
    $("#coin-container").append(itemWilappended);
}

const renderItem = async (item) => {
    return `
    <div class="col-xl-3 card-col col-sm-12">
        <div class="card">
            <div class="divku-1">
                <img src="./node_modules/cryptocurrency-icons/svg/color/${item.asset_id.toLowerCase()}.svg" class="img-crypto card-img-top"
                    alt="${item.asset_id}-image">
            </div>
            <div class="card-body">
                <h5 class="card-title">${item.name} <span class="singkatanku">${item.asset_id} </span><span id="span_${item.asset_id}"><i
                            class="fa-solid fa-caret-up" id="caret_${item.asset_id}"></i>
                        TBA%</span></h5>
                <p class="card-text">
                    <input type="hidden" id="vprice_${item.asset_id}" value="${item.price_usd}">
                    <b>Price - </b>  ${formatter.format(item.price_usd)} <br>
                    <b>Volume(24h) -</b> ${formatter.format(item.volume_1day_usd)}
                </p>
                
            </div>
        </div>
    </div>
    `;
}

const findPerItem = async (item) => {
    //GET EXACT YESTERDAY PRICE
    let yesterday;
    let curprice = $('#vprice_' + item).val();
    var date2 = new Date();
    date2.setDate(date2.getDate() - 1);
    yesterday = date2.toISOString();

    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CoinAPI-Key": myKey
            }
        };

        const response = await fetch(`${baseUrl}/exchangerate/${item}/USD?time=${yesterday}`, options);
        const responseJson = await response.json();

        if (responseJson.error) {
            showResponseMessage(responseJson.error);
        } else {
            //CALCULATE PERCENTAGE NOW
            let caret;
            let colorClass;

            let percentageDifferent = ((parseFloat(curprice) - parseFloat(responseJson.rate)) / ((parseFloat(curprice) + parseFloat(responseJson.rate)) / 2)) * 100;
            // alert(`${item}__${parseFloat(curprice)}___${parseFloat(responseJson.rate)} `);
            if (curprice >= responseJson.rate) {
                colorClass = "hijauku";
                caret = "up";
            } else {
                colorClass = "merahku";
                caret = "down";
            }

            const objKu = { caret: caret, colorClass: colorClass, percentageDifferent: percentageDifferent };

            $("#span_" + item).attr('class', objKu.colorClass);
            $("#span_" + item).html(`
            <i class="fa-solid fa-caret-${objKu.caret}" id="caret_${item}"></i> ${objKu.percentageDifferent.toFixed(2)}%
            `);
        }
    } catch (error) {
        showResponseMessage(error);
    }
}

const showResponseMessage = (errormsg) => {
    alert(errormsg);
}

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});