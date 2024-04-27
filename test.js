const rosnacy = tab => {
    for(let i=0; i < tab.length - 1; i++)
        if (tab[i] >= tab[i+1])
            return false
    return true
}


function functionToTest(_data, _n){
    // const firmaData = $("firmy - pBlock.Rows").find(x => x._id === $("State.firma_id"))
    
    const data = _data //firmaData?.praktykanci?.map(x => x._id)
    const n = _n //+firmaData?.["ilosc miejsc"] || 0
    
    // const all = $("praktykanci - all fields.Rows")
    
    
    
    getDate = (x, type) => new Date(x[`${type === "start"? "poczatek": "koniec"} praktyk`])
    
    
    const done = Array.from(new Array(n), x => {return []})
    const deleted = []
    
    main: for(const line of data){
        //const uczen = all.find(x => x._id === _id)
        //const start = getDate(uczen, "start")
        //const end = getDate(uczen, "end")
        
        const uczen = {"poczatek praktyk": line.split(";")[0], "koniec praktyk": line.split(";")[1]}

        for(let i=0; i<n; i++){
            let test = Array.from(done[i])
            test.push(uczen)
            if(rosnacy(
                test
                    .map(x => [getDate(x, "start"), getDate(x, "end")])
                    .toSorted((a, b) => a[0] - b[0]).flat()
            )){
                done[i].push(uczen)
                continue main
            }
        }
        deleted.push(uczen)
    }
    return [done, deleted]
}


const fs = require('node:fs');

const textFromFile = fs.readFileSync("./data.txt", "utf-8")
const data = textFromFile.split("\n")
const [result, del] = functionToTest(data, 5)


// Sprawdzanie

const formatDate = date => new Date(date).toLocaleDateString('pl-PL', {day: "2-digit", month: "long", year: "numeric"})
const printDate = data => formatDate(data["poczatek praktyk"]).padEnd(22, " ") + formatDate(data["koniec praktyk"])

console.log("Sprawdzanie ręczne\n\n\n")
for (const [i, el] of result.entries()){
    console.log(`\n========== ${i+1} ==========\n`)
    const row = el.toSorted((a, b) => +new Date(a["poczatek praktyk"]) - new Date(b["poczatek praktyk"]))
    for (const data of row)
        console.log(`${printDate(data)}`)
}

console.log("\n\n\n==== elementy co się nie dostały =====\n\n\n")
const deleted = del.reduce((pre, curr) => pre += printDate(curr) + ";\t", "")
console.log(deleted)

console.log("\n\n\nSprawdzanie komputerowe")
//algorytm działa na zasadzie tworzenia n tablic z czego każda zawiera daty nie nachodzące na siebie,
//a n jest ilością miejsc dla praktykantów

let valid = true

//sprawdzanie czy w jakiejś tablicy elemnty nachodzą na siebie

for (const tab of result){
    //zmienienie tekstu na date
    let test = tab.map(x => [new Date(x["poczatek praktyk"]), new Date(x["koniec praktyk"])])
    //posortowana tablica
    test = test.toSorted((a, b) => +a[0] - b[0])
    //tablica zawierająca posortowane początki i końce praktyk
    test = test.flat()
    //jeżeli tablica nie jest rosnaca oznacza to, że wartości nachodzą na siebie
    if (!rosnacy(test)){
        valid = false
        break
    }
}

console.log(valid)





