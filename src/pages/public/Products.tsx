import { ProductsHero } from './products/ProductsHero';
import { ProductDirectionStrip } from './products/ProductDirectionStrip';
import { FeaturedProduct } from './products/FeaturedProduct';
import { DynamicProductsGrid } from './products/DynamicProductsGrid';
import { ProductPrinciples } from './products/ProductPrinciples';
import { ProductEcosystem } from './products/ProductEcosystem';
import { ProductLifecycle } from './products/ProductLifecycle';
import { ProductsCTA } from './products/ProductsCTA';

export default function Products() {
  return (
    <div className="flex flex-col w-full">
      <ProductsHero />
      <ProductDirectionStrip />
      <FeaturedProduct />
      <DynamicProductsGrid />
      <ProductPrinciples />
      <ProductEcosystem />
      <ProductLifecycle />
      <ProductsCTA />
    </div>
  );
}
