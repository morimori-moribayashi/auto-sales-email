// expressを読み込む
const express = require('express')
 
// expressのオブジェクトを作成
const app = express()
// ポートを指定
const port = 3000
 
// 「/」にアクセスされた時の処理
app.get('/', (req, res) => {
  res.send('Hello World!')
})
 
// サーバーを起動
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})