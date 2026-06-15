const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Çalışıyor");
});

app.post("/shopify-order", async (req, res) => {
    try {
const phone = (req.body.shipping_address?.phone || "")
    .replace(/\D/g, "")
    .replace(/^0/, "");
        
console.log("TELEFON:", phone)
console.log("CITY:", req.body.shipping_address?.city);
console.log("PROVINCE:", req.body.shipping_address?.province);
console.log("ADDRESS1:", req.body.shipping_address?.address1);
console.log("ADDRESS2:", req.body.shipping_address?.address2);
console.log("TELEFON:", phone);
        console.log(
    JSON.stringify(req.body.payment_gateway_names, null, 2)
);
        console.log("========== SIPARIS ==========");
        console.log("SHOPIFY ORDER ID:", req.body.id);
        console.log("ORDER NUMBER:", req.body.order_number);

        const items = req.body.line_items.map(item => ({
            variantId: parseInt(item.sku),
            quantity: item.quantity
        }));

        const cargoName =
            req.body.shipping_lines?.[0]?.title || "";
console.log("KARGO ADI:", cargoName);
        let cargoCompanyId = "11";
        let cargoCompanyExtArgs = {
            company_id: "11",
            software_type: "1",
            branchCode: "POE",
            branchName: "PTT",
            gCompanyId: "11"
        };

        if (cargoName.toUpperCase().includes("ARAS")) {
            cargoCompanyExtArgs = {
                company_id: "11",
                software_type: "1",
                branchCode: "167",
                branchName: "ARAS",
                gCompanyId: "13"
            };
        }

        const result = await axios.post(
            "https://rema.butiksistem.com/rest/order/add",
            {
                auth: {
                    userName: process.env.BUTIK_USER,
                    password: process.env.BUTIK_PASS
                },
                arguments: {
                    customOrderId: String(req.body.id),
                    orderDate: new Date()
                        .toISOString()
                        .split("T")[0],

                    orderPaymentTypeId:
                        req.body.financial_status === "paid"
                            ? 6
                            : 1,

                    orderShippingValue:
                        Number(req.body.total_shipping_price_set?.shop_money?.amount || 0),

                    orderProductsValue:
                        Number(req.body.current_subtotal_price || 0),

                    orderPaymentConfirmStat:
                        req.body.financial_status === "paid"
                            ? 1
                            : 0,

                    orderStatusId: 3,

                  delivery: {
    name: req.body.shipping_address?.first_name || "",
    surName: req.body.shipping_address?.last_name || "",
    mail: req.body.customer?.email || "",
    phone: phone,
    address:
        (req.body.shipping_address?.address1 || "") +
        " " +
        (req.body.shipping_address?.address2 || ""),
    city: req.body.shipping_address?.city || "",
    district: req.body.shipping_address?.address2 || "",
    cargoCompanyId,
    cargoCompanyExtArgs,
    phoneCode: 90
},

                 billing: {
    name: req.body.shipping_address?.first_name || "",
    surName: req.body.shipping_address?.last_name || "",
    mail: req.body.customer?.email || "",
    phone: phone,
    address:
        (req.body.shipping_address?.address1 || "") +
        " " +
        (req.body.shipping_address?.address2 || ""),
    city: req.body.shipping_address?.city || "",
    district: req.body.shipping_address?.address2 || "",
    phoneCode: 90
},

                    notification: {
                        sms: true
                    },

                    items
                }
            }
        );

        console.log("BUTIK SISTEM:");
        console.log(result.data);

        res.status(200).json({
            success: true
        });

    } catch (err) {

        console.error("HATA:");
        console.error(
            err.response?.data || err.message
        );

        res.status(500).json(
            err.response?.data || {
                error: err.message
            }
        );
    }
});

app.get("/test-order", async (req, res) => {
    try {

        const result = await axios.post(
            "https://rema.butiksistem.com/rest/order/add",
            {
                auth: {
                    userName: process.env.BUTIK_USER,
                    password: process.env.BUTIK_PASS
                },
                arguments: {
                    customOrderId:
                        "SHOPIFY-" + Date.now(),

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

        console.error(
            err.response?.data || err.message
        );

        res.status(500).json(
            err.response?.data || {
                error: err.message
            }
        );
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server çalışıyor");
});
