const express = require('express');
const products = require('./products');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    let id = req.params.id;
    const found = products.inventory.some(item => item.id === +id);

    if(found) {
        res.json(products.inventory.filter(x => x.id === +id))
    } else {
        res.status(400).json({msg: "Dom etter"})
    }
});

app.put('/api/updateproducts/:id', (req, res) => {
    const found = products.inventory.some(item => item.id === parseInt(req.params.id));
    if(found) {
        const updProduct = req.body;
        products.inventory.forEach(item => {
            if(item.id === +req.params.id){
                item.name = updProduct.name ? updProduct.name : item.name
                item.price = updProduct.price ? updProduct.price : item.price
                item.quantity = item.quantity - updProduct.quantity
                res.json({msg: "Product Updated", item})
            }
        })
    } else {
        res.status(400).json({msg: "The product was not found"})
    }
});

app.delete('/api/deleteproducts/:id', (req, res) => {
    const found = products.inventory.some(item => item.id === parseInt(req.params.id));

    if(found){
        res.json({
            msg: "Product Deleted",
            deleted: products.inventory.filter(item => item.id === +req.params.id),
            products: products.inventory.filter(item => item.id !== +req.params.id)
        })
    } else {
        res.status(400).json({msg: "This product was not found"})
    }
})