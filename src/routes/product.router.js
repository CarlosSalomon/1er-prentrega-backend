import { Router } from "express";
import { productManager } from "../app.js";

const productRouter = Router()

productRouter.get('/', async (req, res) =>{
    try{
        const{limit} = req.query;
        const products =  productManager.getProducts()

        if(limit){
            const limitedProducts = products.slice(0, limit)
            return res.json(limitedProducts)
        }else{
            const productCardsHTML = products.map(product => `
                <div class="product-card">
                    <h3>${product.title}</h3>
                    <p>Descripcion: ${product.description}</p>
                    <p>Precio: $${product.price}</p>
                    <p>Imagen: ${product.thumbnail}</p>
                    <p>Codigo: ${product.code}</p>
                    <p>Stock: ${product.stock}</p>
                    <p>Estado: ${product.status}</p>
                    <p>Categoria: ${product.category}</p>
                    
                </div>
            `).join('');
            return res.send(`
                <html>
                    <head>
                        <style>
                            
                            .product-card {
                                border: 1px solid #ddd;
                                padding: 10px;
                                margin: 10px;
                                width: 200px;
                                text-align: center;
                                display: inline-block;
                            }
                        </style>
                    </head>
                    <body>
                        ${productCardsHTML}
                    </body>
                </html>
            `);
        }
        
    }catch (error){
        console.log(error);
        res.send('Error al intentar recibir los productos!')
    }
})

productRouter.get('/:pid', async (req, res)=>{
    const {pid} = req.params;
    try {
        
        const product = await productManager.getProductById(pid)
        const productDetailsHTML = `
        <div> <h3>${product.id}</h3></div>
                <div class="product-card">
                    <h3>${product.title}</h3>
                    <p>Descripcion: ${product.description}</p>
                    <p>Precio: $${product.price}</p>
                    <p>Imagen: ${product.thumbnail}</p>
                    <p>Codigo: ${product.code}</p>
                    <p>Stock: ${product.stock}</p>
                    <p>Estado: ${product.status}</p>
                    <p>Categoria: ${product.category}</p>
                </div> `;
            return res.send(`
            <html>
                <head>
                    <style>
                        
                        .product-card {
                            border: 1px solid #ddd;
                            padding: 10px;
                            margin: 10px;
                            width: 200px;
                            text-align: center;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    ${productDetailsHTML}
                </body>
            </html>
        `);

    } catch (error) {
        console.log(error);
        res.send(`Error al intentar recibir el producto con ID:${pid}`)
    }

})

productRouter.post('/', async (req, res)=>{
    try {
        const {title, description, price, thumbnail, code, stock, status = true, category} = req.body;
        const response = await productManager.addProduct({title, description, price, thumbnail, code, stock, status, category})
        res.json(response)
    } catch (error) {
        console.log(error)
        res.send('Error al intentar agregar producto')
    }
})

productRouter.put('/:pid', async (req, res) =>{
    const {pid} = req.params;

    try {
        const {title, description, price, thumbnail, code, stock, status = true, category} = req.body;
        const response = await productManager.updateProduct(pid, {title, description, price, thumbnail, code, stock, status, category})
        res.json(response)
    } catch (error) {
        console.log(error)
        res.send( `Error al intentar editar el producto con id:${pid} `)
    }
})

productRouter.delete('/:pid', async (req, res) => {
    const {pid} = req.params;
    try {
        await productManager.deleteProduct(pid)
        res.send('PRODUCTO ELIMINADO CORRECTAMENTE !')
    }
    catch (error) {
        res.send(`ERROR AL ELIMINAR EL PRODUCTO CON ID ${pid}`)
    }
})


export {productRouter}