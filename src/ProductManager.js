import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'



export class ProductManager {

  constructor() {
    this.path = './productos.json';
    this.idCounter = 0;
    this.products = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.idCounter = Math.max(...this.products.map((product) => product.id), 0);
    } catch (error) {
      this.products = [];
    }
  }

  generateProductId() {
    return ++this.idCounter;
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  addProduct = async ({ title, description, price, thumbnail, code, stock, status = true, category }) => {
    const id = uuidv4();

    let newProduct = { id, title, description, price, thumbnail, code, stock, status, category }

    this.products = this.getProducts()
    this.products.push(newProduct)

    await fs.writeFile(this.path, JSON.stringify(this.products))
    return newProduct;
  }



  updateProduct = async (id, { ...data }) => {
    const products = this.getProducts()
    const index = products.findIndex(product => product.id == id)
    console.log(id)
    console.log(index)
    if (index != -1) {
      products[index] = { id, ...data }

      await fs.writeFile(this.path, JSON.stringify(products))
      return products[index]
    } else {
      console.log('Producto no encontrado!')
    }

  }

  async deleteProduct(pid) {

    try {
      const index = this.products.findIndex((product) => product.id == pid);
      if (index != -1) {
        this.products.splice(index, 1);

        await this.saveProductsToFile();

        console.log(`Producto con ID ${pid} eliminado con éxito`);
      } else {
        console.log(`Producto con ID ${pid} no encontrado`);
      }
    } catch (error) {
      console.error('Error no se pudo borrar el producto:', error.message);
    }
  }

  getProducts() {
    console.log(this.products)
    return this.products;
  }

  async getProductById(id) {
    const okProduct = this.products.find((product) => product.id === id);
    return okProduct || null;

  }
}
