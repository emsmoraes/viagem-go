import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum PlanType {
  INDIVIDUAL = 'INDIVIDUAL',
  AGENCY = 'AGENCY',
}

export class CreateCheckoutDto {
  @ApiProperty({
    example: 'price_1MoBy5LkdIwHu7ixZhnattbh',
    description: 'ID do preço do produto no Stripe',
  })
  @IsNotEmpty()
  @IsString()
  priceId: string;

  @ApiProperty({
    example: 'https://meusite.com/success',
    description: 'URL para redirecionamento após o pagamento bem-sucedido',
  })
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  successUrl: string;

  @ApiProperty({
    example: 'https://meusite.com/cancel',
    description: 'URL para redirecionamento caso o pagamento seja cancelado',
  })
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  cancelUrl: string;

  @IsEnum(PlanType)
  planType: PlanType;
}
