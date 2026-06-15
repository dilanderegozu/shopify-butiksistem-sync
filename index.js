const express = require("express");

const app = express();

app.use(express.json());

app.post("/shopify-order", async (req, res) => {

    console.log("Yeni Sipariş");
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).send("OK");
});

app.get("/", (req, res) => {
    res.send("Çalışıyor");
});

app.listen(process.env.PORT || 3000);
