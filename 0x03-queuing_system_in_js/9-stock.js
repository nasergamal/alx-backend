const {createClient} = require('redis');
const {promisify} = require('util')
const express = require('express');
const port = 1245;
const server = express();
const client = createClient();
const get = promisify(client.get).bind(client);
const listProducts = [
    {Id: 1, name: "Suitcase 250", price: 50, initialAvailableQuantity: 4},
  {Id: 2, name: "Suitcase 450", price: 100, initialAvailableQuantity: 10},
  {Id: 3, name: "Suitcase 650", price: 350, initialAvailableQuantity: 2},
  {Id: 4, name: "Suitcase 1050", price: 550, initialAvailableQuantity: 5},
]

function getItemById(id) {
  return listProducts.filter((product) => product.Id === id)[0]
}

function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
    const item = await get(`item.${itemId}`);
    return item;
}

server.get('/list_products', (req, res) => {
  res.send(listProducts)
});

server.get('/list_products/:itemId', async(req, res) => {
  const product = getItemById(parseInt(req.params.itemId));
  if (product) {
    let stock = await getCurrentReservedStockById(product.Id);
    if (stock === null) {
        stock = product.initialAvailableQuantity;
    }
    res.send({...product, currentQuantity: stock});
    return;
  }
  res.send({"status":"Product not found"})
});

server.get('/reserve_product/:itemId', async(req, res) => {
  const product = getItemById(parseInt(req.params.itemId));
  if (!product) {
    res.send({"status":"Product not found"})
    return;
  }
  let stock = await getCurrentReservedStockById(parseInt(req.params.itemId));
  if (stock && stock < 1) {
    res.send({"status":"Not enough stock available","itemId": product.Id});
    return;
  } else if (stock === null) {
    stock = product.initialAvailableQuantity
  }
  reserveStockById(product.Id, stock - 1)
  res.send({"status":"Reservation confirmed","itemId": product.Id});
});

server.listen(port);
