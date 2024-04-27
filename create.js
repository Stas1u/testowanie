const fs = require("node:fs")

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

let content = ""

for (let i=0; i<10000; i++){
    const date = new Date("4/25/2006")
    date.setDate(random(1, 31))
    date.setMonth(random(0, 11))
    date.setFullYear(random(2022, 2025))

    const second = new Date(+date + random(5, 47) * (1000 * 60 * 60 * 24))
    content += `${date.toLocaleDateString("en-US")};${second.toLocaleDateString("en-US")}\n`
}
// console.log(content)
fs.writeFileSync("./data.txt", content.slice(0, -1))
