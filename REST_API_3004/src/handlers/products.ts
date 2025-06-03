import { Request, Response } from 'express';
import Product from '../models/Product.models';

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.findAll({
            order: [['id', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt', 'disponibility'] },
            limit: 5,
        });
        res.json({ data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        res.json({ data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, disponibility } = req.body;
        const product = await Product.create({ name, price, disponibility });
        res.status(201).json({ data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        await product.update(req.body);
        res.json({ data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        await product.destroy();
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
