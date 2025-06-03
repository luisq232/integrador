import { Router } from 'express';
import { 
    createProduct, 
    getProduct, 
    getProductById,  
    updateProduct, 
    deleteProduct 
} from './handlers/products';

import { body, param } from 'express-validator';
import { handleInputerrors } from './middleware';

const router = Router();

// Crear producto
router.post('/', 
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede ir vacío')
        .custom(value => value > 0).withMessage("El precio no es válido"),
    handleInputerrors,
    createProduct
);

// Obtener todos los productos
router.get('/', getProduct);

// Obtener un producto por ID
router.get('/:id', 
    param('id')
        .isInt().withMessage("El id debe ser un número entero"),
    handleInputerrors,
    getProductById
);

// Actualizar un producto
router.put('/:id', 
    param('id')
        .isInt().withMessage("El id debe ser un número entero"),
    body('name')
        .notEmpty().withMessage("El nombre no puede ir vacío"),
    body('price')
        .isNumeric().withMessage("Valor no válido")
        .notEmpty().withMessage('El precio del producto no puede ir vacío')
        .custom(value => value > 0).withMessage("El precio no es válido"),
    body('disponibility')
        .isBoolean().withMessage("El valor de disponibilidad no es válido"),
    handleInputerrors,
    updateProduct
);

// Eliminar un producto
router.delete('/:id',
    param('id')
        .isInt().withMessage("El id debe ser un número entero"),
    handleInputerrors,
    deleteProduct
);

export default router;
