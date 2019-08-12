# aws-serverless-express

https://www.npmjs.com/package/aws-serverless-express

# つまずいたポイント

serverless.ymlで全てのhttpリクエストをAPI Gatewayの機能のLambda Proxy IntegrationでExpress側に渡すための設定を記述が必要。<br>
この設定をしなかったせいで500エラーが発生した(module initialization error)。<br>
**公式で`- http: 'ANY {proxy+}'`の記述の詳細を探せなかったので今後調査。**
Proxy Integrationを使うって意味なのかと思ったが、{any+}としてもやはりProxy Integrationが有効となった…。

https://qiita.com/daikiojm/items/087af018959547614376

```
functions:
  run:
    handler: handler.run
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'　// これあっても無くても同じだったけどどういう意味だろ？
```

**！！Lambda Proxy Integrationを有効にするかどうかでパラメーターの受け取り方やレスポンスの返し方を変更する必要がある事に注意！！**

https://rso.hateblo.jp/entry/2019/02/17/232229

# Lambda Proxy Integration

このGatewayに対するリクエストの情報（HTTPメソッド、クエリストリング、パス、ソースIPなど）を勝手にまとめてくれて、Lambdaに渡してくれる機能。<br>
<br>
以前はGatewayからLambdaにリクエストの情報を渡すには、あれこれ設定する必要があった。逆もまた然りで、Lambdaからのレスポンスにも処理を入れる必要があった。その煩わしさを解消してくれる。

## 今後、期待したレスポンスを得られない時に参考にする

2016年当時のlambdaからのレスポンスの返し方。これに従うと今回の方法では期待したレスポンスが得られないはず。

https://qiita.com/_mogaming/items/2bd83204e212e35b2c6c

1. Lambdaのレスポンスを下記のフォーマットで作る
```
{
    statusCode: 200, // 任意
    headers: { 
        // 任意
    },
    body: "" // 文字列 jsonの場合は、jsonを文字列に変換

}
```
2. lambdaの第３引数である`callback`の第２引数に渡して実行
```JS
callback(null,response); // responseは上述のオブジェクト
```
3. 受け取った値を確認

response.bodyは、lambdaにより自動で作成される。
