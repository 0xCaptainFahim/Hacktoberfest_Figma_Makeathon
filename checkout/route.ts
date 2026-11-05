import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    // In a real app, require authentication to checkout
    // if (!session?.user) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // Using a mock URL for this demo since we might not have real keys
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ url: 'https://checkout.stripe.com/pay/mock' });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/?canceled=true`,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'NexusGuard Pro',
              description: 'Unlimited Deep Repository Scans',
            },
            unit_amount: 1999,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: (session?.user as any)?.id || 'guest_id',
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
