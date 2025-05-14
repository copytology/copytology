
# Payment Integration Plan (Phase 2)

## MidTrans Integration for Indonesian Payments

### 1. Database Schema for Subscriptions

```sql
-- Create subscription plans table
create table public.subscription_plans (
  id serial primary key,
  name text not null,
  description text not null,
  price_monthly integer not null,
  price_yearly integer not null,
  features text[] not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Insert default subscription plans
insert into public.subscription_plans (name, description, price_monthly, price_yearly, features) values
('Free', 'Basic features to get started', 0, 0, ARRAY['10 challenges per month', 'Basic feedback', 'Access to copywriting challenges']),
('Pro', 'For serious learners', 99000, 990000, ARRAY['Unlimited challenges', 'Premium feedback', 'All challenge types', 'Priority support']),
('Teams', 'For organizations', 299000, 2990000, ARRAY['All Pro features', 'Team analytics', 'Custom challenges', 'Dedicated account manager']);

-- Create subscriptions table
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id integer not null references public.subscription_plans(id) on delete restrict,
  status text not null check (status in ('active', 'inactive', 'cancelled')),
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  recurring boolean not null default true,
  payment_method text,
  payment_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id)
);

-- Add RLS policies
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);
```

### 2. MidTrans Edge Function

```typescript
// supabase/functions/midtrans-payment/index.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, period } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    
    // Get subscription plan
    const { data: plan } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (!plan) {
      return new Response(JSON.stringify({ error: 'Invalid plan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Calculate price based on period
    const price = period === 'monthly' ? plan.price_monthly : plan.price_yearly;
    
    // MidTrans API configuration
    const midtransServerKey = Deno.env.get('MIDTRANS_SERVER_KEY');
    const midtransUrl = Deno.env.get('MIDTRANS_URL') || 'https://app.sandbox.midtrans.com/snap/v1/transactions';
    
    // Create a unique order ID
    const orderId = `CPYT-${Date.now()}-${user.id.slice(0, 8)}`;
    
    // Create transaction payload
    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price
      },
      customer_details: {
        first_name: profile?.full_name || 'User',
        email: user.email
      },
      item_details: [{
        id: `plan-${planId}-${period}`,
        price: price,
        quantity: 1,
        name: `${plan.name} (${period === 'monthly' ? 'Monthly' : 'Yearly'})`
      }],
      callbacks: {
        finish: `${Deno.env.get('APP_URL')}/payment/success?order_id=${orderId}`,
        error: `${Deno.env.get('APP_URL')}/payment/error?order_id=${orderId}`,
        pending: `${Deno.env.get('APP_URL')}/payment/pending?order_id=${orderId}`
      }
    };
    
    // Call MidTrans API
    const response = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${midtransServerKey}:`)}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(transactionPayload)
    });
    
    const paymentData = await response.json();
    
    // Store the payment info
    await supabaseClient
      .from('payment_transactions')
      .insert({
        order_id: orderId,
        user_id: user.id,
        plan_id: planId,
        period: period,
        amount: price,
        status: 'pending',
        payment_token: paymentData.token,
        payment_url: paymentData.redirect_url
      });
    
    return new Response(JSON.stringify({
      success: true,
      payment_url: paymentData.redirect_url,
      token: paymentData.token,
      order_id: orderId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in midtrans-payment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### 3. MidTrans Webhook Handler

```typescript
// supabase/functions/midtrans-webhook/index.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    // Parse webhook payload
    const payload = await req.json();
    
    // Validate MidTrans signature
    const midtransServerKey = Deno.env.get('MIDTRANS_SERVER_KEY');
    const signatureKey = Deno.env.get('MIDTRANS_SIGNATURE_KEY');
    
    // Setup Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Get order details
    const orderId = payload.order_id;
    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;
    
    // Get payment transaction from database
    const { data: transaction } = await supabaseClient
      .from('payment_transactions')
      .select('*, plans:plan_id(*)')
      .eq('order_id', orderId)
      .single();
    
    if (!transaction) {
      return new Response(JSON.stringify({ error: 'Transaction not found' }), {
        status: 404,
      });
    }
    
    // Update transaction status
    await supabaseClient
      .from('payment_transactions')
      .update({
        status: transactionStatus,
        payment_type: payload.payment_type,
        transaction_time: payload.transaction_time,
        transaction_id: payload.transaction_id,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);
    
    // If payment is successful
    if (
      (transactionStatus === 'capture' && fraudStatus === 'accept') ||
      transactionStatus === 'settlement'
    ) {
      // Calculate subscription period
      const startDate = new Date();
      const endDate = new Date();
      
      if (transaction.period === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      // Check if user already has a subscription
      const { data: existingSubscription } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .eq('user_id', transaction.user_id)
        .single();
      
      if (existingSubscription) {
        // Update existing subscription
        await supabaseClient
          .from('subscriptions')
          .update({
            plan_id: transaction.plan_id,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            payment_method: payload.payment_type,
            payment_id: payload.transaction_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id);
      } else {
        // Create new subscription
        await supabaseClient
          .from('subscriptions')
          .insert({
            user_id: transaction.user_id,
            plan_id: transaction.plan_id,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            recurring: true,
            payment_method: payload.payment_type,
            payment_id: payload.transaction_id
          });
      }
    }
    
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error in midtrans-webhook function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
```

### 4. Frontend Implementation for Payments

Create a new `Subscription` page that:

1. Shows current subscription status
2. Displays available plans
3. Handles the payment flow

The implementation would look something like:

```typescript
// src/pages/Subscription.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Plan {
  id: number;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
}

const Subscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans
        const { data: plansData, error: plansError } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price_monthly', { ascending: true });
        
        if (plansError) throw plansError;
        setPlans(plansData || []);
        
        // Fetch current subscription
        if (user) {
          const { data: subscription, error: subscriptionError } = await supabase
            .from('subscriptions')
            .select('*, plan:plan_id(*)')
            .eq('user_id', user.id)
            .single();
          
          if (subscriptionError && subscriptionError.code !== 'PGRST116') throw subscriptionError;
          setCurrentSubscription(subscription);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const handleSubscribe = async (planId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setProcessingPlanId(planId);
    
    try {
      const { data, error } = await supabase.functions.invoke('midtrans-payment', {
        body: { planId, period }
      });
      
      if (error) throw error;
      
      // Redirect to MidTrans payment page
      window.location.href = data.payment_url;
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
      setProcessingPlanId(null);
    }
  };
  
  const currentPlanId = currentSubscription?.plan_id || 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscription Plans</h1>
        
        <Tabs defaultValue="monthly" className="mb-8">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger 
                value="monthly" 
                onClick={() => setPeriod('monthly')}
              >
                Monthly Billing
              </TabsTrigger>
              <TabsTrigger 
                value="yearly" 
                onClick={() => setPeriod('yearly')}
              >
                Yearly Billing <Badge className="ml-2 bg-brand-400">Save 20%</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="monthly" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`overflow-hidden hover:shadow-md transition-shadow flex flex-col ${
                    currentPlanId === plan.id ? 'border-brand-400 shadow-sm' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    {currentPlanId === plan.id && (
                      <Badge className="w-fit mb-2 bg-brand-400">Current Plan</Badge>
                    )}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-gray-500">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{formatCurrency(plan.price_monthly)}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${currentPlanId === plan.id ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-brand-400 hover:bg-brand-500'}`}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={currentPlanId === plan.id || processingPlanId === plan.id}
                    >
                      {processingPlanId === plan.id ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⏳</span> Processing...
                        </span>
                      ) : currentPlanId === plan.id ? (
                        'Current Plan'
                      ) : (
                        <span className="flex items-center">
                          <CreditCard size={16} className="mr-2" />
                          Subscribe
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`overflow-hidden hover:shadow-md transition-shadow flex flex-col ${
                    currentPlanId === plan.id ? 'border-brand-400 shadow-sm' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    {currentPlanId === plan.id && (
                      <Badge className="w-fit mb-2 bg-brand-400">Current Plan</Badge>
                    )}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-gray-500">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{formatCurrency(plan.price_yearly / 12)}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                      <div className="text-sm text-gray-500">
                        Billed as {formatCurrency(plan.price_yearly)} yearly
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${currentPlanId === plan.id ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-brand-400 hover:bg-brand-500'}`}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={currentPlanId === plan.id || processingPlanId === plan.id}
                    >
                      {processingPlanId === plan.id ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⏳</span> Processing...
                        </span>
                      ) : currentPlanId === plan.id ? (
                        'Current Plan'
                      ) : (
                        <span className="flex items-center">
                          <CreditCard size={16} className="mr-2" />
                          Subscribe
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
```
