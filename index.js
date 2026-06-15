const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/shopify-order", async (req, res) => {

```
console.log("========== SIPARIS ==========");

console.log("SHOPIFY ORDER ID:", req.body.id);
console.log("ORDER NUMBER:", req.body.order_number);

console.log("ODEME:");
console.log(req.body.financial_status);

req.body.line_items.forEach(item => {
    console.log("URUN:", item.title);
    console.log("SKU:", item.sku);
    console.log("VARYANT:", item.variant_title);
});

console.log("MUSTERI:");
console.log(JSON.stringify(req.body.customer, null, 2));

console.log("ADRES:");
console.log(JSON.stringify(req.body.shipping_address, null, 2));

console.log("KARGO:");
console.log(JSON.stringify(req.body.shipping_lines, null, 2));

res.status(200).json({ success: true });
```

});

app.get("/", (req, res) => {
res.send("Çalışıyor");
});

app.get("/tumurunler", async (req, res) => {
try {

```
    const result = await axios.post(
        "https://rema.butiksistem.com/rest/product/get",
        {
            auth: {
                userName: process.env.BUTIK_USER,
                password: process.env.BUTIK_PASS
            },
            arguments: {},
            responseType: "json"
        }
    );

    res.json(result.data.result.data);

} catch (err) {

    console.error(err.response?.data || err.message);

    res.status(500).json(
        err.response?.data || err.message
    );
}
```

});

app.get("/test-order", async (req, res) => {

```
try {

    const result = await axios.post(
        "https://rema.butiksistem.com/rest/order/add",
        {
            auth: {
                userName: process.env.BUTIK_USER,
                password: process.env.BUTIK_PASS
            },
            arguments: {
               customOrderId: "SHOPIFY-TEST-2",
                orderDate: "2026-06-15",
                orderPaymentTypeId: 1,
                orderShippingValue: 0,
                orderProductsValue: 1200,
                orderPaymentConfirmStat: 0,
                orderStatusId: 3,
                delivery: {
                    name: "Dilan",
                    surName: "Deregözü",
                    mail: "dilan.deregizu@gmail.com",
                    phone: "05010718237",
                    address: "Test Adres",
                    city: "İstanbul",
                    district: "Gaziosmanpaşa",
                    cargoCompanyId: "11",
                    phoneCode: 90
                },
                billing: {
                    name: "Dilan",
                    surName: "Deregözü",
                    mail: "dilan.deregizu@gmail.com",
                    phone: "05010718237",
                    address: "Test Adres",
                    city: "İstanbul",
                    district: "Gaziosmanpaşa",
                    phoneCode: 90
                },
                notification: {
                    sms: true
                },
                items: [
                    {
                        variantId: 1846,
                        quantity: 1
                    }
                ]
            }
        }
    );

    res.json(result.data);

} catch (err) {

    console.error(err.response?.data || err.message);

    res.status(500).json(
        err.response?.data || err.message
    );
}
```

});

app.listen(process.env.PORT || 3000, () => {
console.log("Server çalışıyor");
});
