let greetings = ["Hello", "Hey", "Hai", "hiii", "heyy", "heyyyy", "who dis?"];

let randomFortune = [
    "You got this!",
    "You out cheya!",
    "Stay humble tho",
    "Stop playing too much",
    "Be real with me",
    "Consult with your pet"
]


let bye = [
    "bye",
    "peace",
    "1 time",
    "see ya",
    "adios",
    "you take care now",
    "alright now",
];
//these three lines of code are select elements on our html file so that we can put content in those html locations
let greetingsCol = document.querySelector(".left");
let middleCol = document.querySelector(".middle");
let rightCol = document.querySelector(".right");

function greet() {
    return new Promise((resolve, reject)=>{
        setTimeout(() => {
            console.log("in greeting function");
            let ol = document.createElement("ol");
            greetings.forEach((greeting) => {
                //for each greeting create an li tag
                let li = document.createElement("li");
                li.innerText = `${greeting}`;
                ol.appendChild(li);
            });
            greetingsCol.appendChild(ol);
            resolve("completed the greetings")
        }, 2000);

    })
}

function randomFortuneMiddle() {
    return new Promise((resolve, reject)=>{
        setTimeout(() => {
            try{
                console.log("in randomFortune function");
                let h4Tag = document.createElement("h4");
                let random =
                    randomFortune[Math.floor(Math.random() * randomFortune.length)];
                h4Tag.innerText = random;
                middleCol.appendChild(h4Tag);
                resolve("Successfully added fortune")
            }catch(error){
                let h4Tag = document.createElement("h4");
                h4Tag.innerText = "Error, your array doesnt have anything";
                middleCol.appendChild(h4Tag);
                reject(error)
            }
        }, 1000);

    })
}

function sayBye() {
    setTimeout(() => {
        console.log("in sayBye function");
        let ol = document.createElement("ol");
        bye.forEach((msg) => {
            let li = document.createElement("li");
            li.innerText = `${msg}`;
            rightCol.appendChild(li);
        });
    }, 1000);
}

// greet(() => {
//     randomFortuneMiddle(() => {
//         sayBye();
//              anotthaFuncation()
//                  anothaAgain()
//     });
// });

// greet()
// randomFortuneMiddle()
// sayBye()


function getAllCoins(){
    console.log("in get all coins function")
    //make an api call to coingecko api to get all the coins
    return axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
        .then(({data, status})=>{
            return data //data is the array of coin objects
        })
        .catch(err=>{
            console.log(err.message)
            return err.message
        })
}

function paintCoinsToWindow(coins=[]){
    console.log("in paint coins to window function");

    //create an unorderd list element in html
    let unorderedList = document.createElement("ul")
    //for each coin object, create an li element, and give li element information about the coin name and price
    coins.forEach(coinObj=>{
        let bulletItem = document.createElement("li");
        bulletItem.innerText = `${coinObj.name} - $${coinObj.current_price}`
        unorderedList.appendChild(bulletItem);
    })

    //attach the unordered list to the html
    document.querySelector("#all-coins").appendChild(unorderedList)

    return Promise.resolve(coins)

}


function getOneCoinDetails(coinObj){
    return axios.get(`https://api.coingecko.com/api/v3/coins/${coinObj.id}`)
        .then(response=>response.data)
}

function paintOneCoinDetailToWindow(coinDetails){
    let coinDetailDiv = document.querySelector("#coin-detail");

    let pTag = document.createElement("p");

    pTag.innerText = `Name:${coinDetails.name}- $${coinDetails.market_data.current_price.usd} \n Description: ${coinDetails.description.en} \n `

    coinDetailDiv.appendChild(pTag)

}




greet()
    .then((greetResolveMessage)=>{
        console.log(greetResolveMessage)
        return randomFortuneMiddle()
    })
    .catch(err=>console.log(err))
    .then((randomFortuneResolveMessage)=>{
        console.log(randomFortuneResolveMessage)
        sayBye()
    })


getAllCoins()
    .then((coins)=>{
        // console.log(coins)
        return paintCoinsToWindow(coins)
    })
    // .then(paintCoinsToWindow)
    .then((coins)=>{
        //send the array of coins to another function that will sort them by their 24 hour price change percentage
        coins.sort((coinA, coinB)=>{
            return coinB.price_change_percentage_24h - coinA.price_change_percentage_24h
        })
        let topPerformingCoinPast24Hrs = coins[0]
        return getOneCoinDetails(topPerformingCoinPast24Hrs)
    })
    .then(popularCoinDetails=>{
        paintOneCoinDetailToWindow(popularCoinDetails)
    })



