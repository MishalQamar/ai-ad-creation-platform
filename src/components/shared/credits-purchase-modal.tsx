'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { PRICING_PLANS } from '@/lib/constants';
import { PricingCard } from '@/components/landing/pricing-card';

interface CreditsPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditsPurchaseModal = ({
  open,
  onOpenChange,
}: CreditsPurchaseModalProps) => {
  const plans = PRICING_PLANS.filter(
    (plan) => plan.productId !== 'starter'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Upgrade for more credits
          </DialogTitle>
          <DialogDescription>
            Choose a plan to unlock more AI generations
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {plans.map((plan) => (
            <PricingCard key={plan.productId} plan={plan} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
