let http = require('http')
let https = require('https')

if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
    console.log("node [file_name] [target_month] [day_from] [day_to]")
    return
}

const month = process.argv[2]
const day_from = process.argv[3]
const day_to = process.argv[4]

const couchdb_url = "http://localhost:5984/adler-words/" + month
const discord_host = "discordapp.com"
const discord_path = "/api/webhooks/403393085364764672/C-BW2CWmAiJ6SQN_LeS_UZlyCZXXERrRfM40eL_vKth7QTNPM4JMP3nDRwp3UPwBXnAc"

// tweet days word
http.get(couchdb_url, (res) => {
    res.setEncoding('utf8')

    console.log("Fnit")
    if (res.statusCode != 200) {
        return
    }

    let body = ''

    res.on('data', (chunk) => {
        body += chunk
    })

    res.on('end', (res) => {
        let words_document = JSON.parse(body)
        
        let content = ""

        for(let day = day_from; day <= day_to; day++) {

            if ( !(day in words_document["days"])) {
                break;
            }

            let todays_word = words_document["days"][day]
            let heading = todays_word["heading"]
            let paragraph = todays_word["paragraph"]
    
            content += `\`\`\`\n${month}月${day}日\n\n${heading}\n\n${paragraph}\n\`\`\`\n\n`
        }

        // tweet month introduction 
        if (day_from == 1) {
            if ( "introduction" in words_document) {
                let introduction = `${words_document["introduction"]}`

                sendWebhook(introduction)
            }
        }

        sendWebhook(content)
    })
})

function sendWebhook(content) {
    let payload = {
        "content": content
    }

    let options = {
        host: discord_host,
        path: discord_path,
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let req = https.request(options)
    req.write(JSON.stringify(payload))
    req.end();
}
