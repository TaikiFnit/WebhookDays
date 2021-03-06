#!/home/fnit/.nodebrew/current/bin/node

let http = require('http')
let https = require('https')

const now = new Date()
const month = now.getMonth() + 1
const day = now.getDate()

const couchdb_url = "http://localhost:5984/adler-words/" + month
const discord_host = "discordapp.com"
const discord_path = "/api/webhooks/403393085364764672/C-BW2CWmAiJ6SQN_LeS_UZlyCZXXERrRfM40eL_vKth7QTNPM4JMP3nDRwp3UPwBXnAc"

// tweet days word
http.get(couchdb_url, (res) => {
    res.setEncoding('utf8')

    if (res.statusCode != 200) {
        return
    }

    let body = ''

    res.on('data', (chunk) => {
        body += chunk
    })

    res.on('end', (res) => {
        let words_document = JSON.parse(body)
        
        if ( !(day in words_document["days"])) {
            return
        }
        
        let todays_word = words_document["days"][day]
        let heading = todays_word["heading"]
        let paragraph = todays_word["paragraph"]

        let content = `\`\`\`\n${month}月${day}日\n\n${heading}\n\n${paragraph}\n\`\`\`\n\n`

        // tweet month introduction 
        if (day == 1) {
            if ( "introduction" in words_document) {
                let introduction = words_document["introduction"]

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
