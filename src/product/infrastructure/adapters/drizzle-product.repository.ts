import { Inject, Injectable } from '@nestjs/common';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider.js';
import { ProductRepository } from '../../application/port/product.repository.port.js';
import { Sku } from '../../domain/value-objects/sku.vo.js';
import { ProductId } from '../../domain/value-objects/product-id.vo.js';
import { Product } from '../../domain/entities/product.entity.js';
import { products } from '../../../shared/infrastructure/database/postgres/schema/products.schema.js';
import { eq } from 'drizzle-orm';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';

@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(product: Product): Promise<void> {
    const row = DrizzleProductRepository.toPersistence(product);

    await this.db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: row.name,
          description: row.description,
          sku: row.sku,
          priceAmount: row.priceAmount,
          priceCurrency: row.priceCurrency,
          stock: row.stock,
          isActive: row.isActive,
          lowStockThreshold: row.lowStockThreshold,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.sku, sku.getValue()));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  async findByName(name: string): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.name, name));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  async delete(id: ProductId): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id.getValue()));
  }

  async findById(id: ProductId): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id.getValue()));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  private static toPersistence(product: Product): typeof products.$inferSelect {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceAmount: product.price.toCents(),
      priceCurrency: product.price.getCurrency(),
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private static toDomain(row: typeof products.$inferSelect): Product {
    return Product.reconstitute({
      id: new ProductId(row.id),
      name: row.name,
      description: row.description,
      sku: Sku.create(row.sku),
      price: Money.create(row.priceAmount / 100, row.priceCurrency),
      stock: row.stock,
      isActive: row.isActive,
      lowStockThreshold: row.lowStockThreshold,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
