import express from 'express'
import {ProductManager} from './ProductManager.js'
import { productRouter } from './routes/product.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { CartManager } from './cartManager.js';


const app = express();
const port = 8080;
export const productManager = new ProductManager();
export const cartManager = new CartManager;

app.use(express.json())

app.use('/products', productRouter)
app.use('/api/carts', cartsRouter)


app.listen(port, async () => {
  console.log(`Server run in http://localhost:${port}`);
  await productManager.init();
});

