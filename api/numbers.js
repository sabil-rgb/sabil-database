export default async function handler(req, res) {

  const OWNER = "sabil-rgb"
  const REPO  = "sabil-database"
  const FILE  = "database.json"
  const BRANCH = "main"

  const FIXED_PASSWORD = "coolerbot"
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN

  const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`

  // GET → ambil data
  if (req.method === "GET") {
    const r = await fetch(API)
    const j = await r.json()
    const data = JSON.parse(
      Buffer.from(j.content, "base64").toString()
    )
    return res.json(data)
  }

  // POST → login / tambah nomor
  if (req.method === "POST") {
    const { action, password, number } = req.body

    if (action === "login") {
      return res.json({ success: password === FIXED_PASSWORD })
    }

    if (!number) return res.json({ success:false })

    const r = await fetch(API)
    const j = await r.json()
    let data = JSON.parse(
      Buffer.from(j.content, "base64").toString()
    )

    data.push(number)

    await fetch(API, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update database",
        content: Buffer.from(
          JSON.stringify(data, null, 2)
        ).toString("base64"),
        sha: j.sha,
        branch: BRANCH
      })
    })

    return res.json({ success:true })
  }

  res.status(405).end()
}
