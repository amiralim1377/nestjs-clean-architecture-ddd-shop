import { CreateProductHandler } from './use-cases/create-product/create-product.handler.js';
import { DeleteProductHandler } from './use-cases/delete-product/delete-product.handler.js';

export const CommandHandler = [CreateProductHandler, DeleteProductHandler];
