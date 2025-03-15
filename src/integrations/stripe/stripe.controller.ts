import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dtos/create-checkout.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  
  @UseGuards(AuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() createCheckoutDto: CreateCheckoutDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.stripeService.createCheckoutSession(createCheckoutDto, userId);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      return { error: 'Missing rawBody' };
    }

    return this.stripeService.handleWebhook(req.rawBody, signature);
  }
}
