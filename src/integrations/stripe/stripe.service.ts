import { Injectable, NotFoundException } from '@nestjs/common';
import { EnvService } from 'src/modules/env/env.service';
import Stripe from 'stripe';
import { CreateCheckoutDto } from './dtos/create-checkout.dto';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly envService: EnvService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.envService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(dto: CreateCheckoutDto, userId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: dto.priceId, quantity: 1 }],
      success_url: dto.successUrl,
      cancel_url: dto.cancelUrl,
    });

    const agency = await this.prisma.agency.findFirst({
      where: {
        users: {
          some: { id: userId },
        },
      },
    });

    if (!agency) {
      throw new NotFoundException('Usuário não pertence a nenhuma agência.');
    }

    await this.prisma.subscription.upsert({
      where: { agencyId: agency.id },
      update: {
        stripeSessionId: session.id,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? 'brl',
        paymentStatus: session.payment_status ?? 'unpaid',
        status: session.status ?? 'open',
        expiresAt: session.expires_at
          ? new Date(session.expires_at * 1000)
          : new Date(),
        planType: dto.planType,
      },
      create: {
        agencyId: agency.id,
        stripeSessionId: session.id,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? 'brl',
        paymentStatus: session.payment_status ?? 'unpaid',
        status: session.status ?? 'open',
        expiresAt: session.expires_at
          ? new Date(session.expires_at * 1000)
          : new Date(),
        planType: dto.planType,
      },
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.envService.get('STRIPE_WEBHOOK_SECRET'),
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return { error: 'Invalid signature' };
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSuccess(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.handleSubscriptionUpdate(
          event.data.object as Stripe.Subscription,
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  async handleCheckoutSuccess(session: Stripe.Checkout.Session) {
    if (!session.id || !session.subscription || !session.customer) return;

    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription.toString(),
    );

    await this.prisma.subscription.update({
      where: { stripeSessionId: session.id },
      data: {
        stripeCustomerId: session.customer.toString(),
        stripeSubscriptionId: session.subscription.toString(),
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
        status: 'active',
        expiresAt: new Date(subscription.current_period_end * 1000),
        isTrial: false,
      },
    });
  }

  async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        paymentStatus: subscription.status === 'active' ? 'paid' : 'unpaid',
      },
    });
  }
}
