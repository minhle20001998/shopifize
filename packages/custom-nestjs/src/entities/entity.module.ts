import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database';
import { roleProviders } from './role.entity';
import { userProviders } from './user.entity';
import { profileProviders } from './profile.entity';
import { addressProviders } from './address.entity';
import { categoryProviders } from './category.entity';
import { productProviders } from './product.entity';
import { productVariantProviders } from './product-detail.entity';
import { productStatusProviders } from './product-status.entity';
import { subCategoryProviders } from './sub-category.entity';
import { rankingProviders } from './ranking.entity';
import { commentProviders } from './comment.entity';
import { cartProviders } from './cart.entity';
import { cartItemProviders } from './cart-item.entity';
import { orderProviders } from './order.entity';
import { orderItemProviders } from './order-item.entity';
import { paymentProviders } from './payment.entity';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...userProviders,
    ...roleProviders,
    ...profileProviders,
    ...addressProviders,
    ...productProviders,
    ...categoryProviders,
    ...productVariantProviders,
    ...productStatusProviders,
    ...subCategoryProviders,
    ...rankingProviders,
    ...commentProviders,
    ...cartProviders,
    ...cartItemProviders,
    ...orderProviders,
    ...orderItemProviders,
    ...paymentProviders,
  ],
  exports: [
    ...userProviders,
    ...roleProviders,
    ...profileProviders,
    ...addressProviders,
    ...productProviders,
    ...categoryProviders,
    ...productVariantProviders,
    ...productStatusProviders,
    ...subCategoryProviders,
    ...rankingProviders,
    ...commentProviders,
    ...cartProviders,
    ...cartItemProviders,
    ...orderProviders,
    ...orderItemProviders,
    ...paymentProviders,
  ],
})
export class EntityModule {}
