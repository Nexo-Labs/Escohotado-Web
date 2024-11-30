'use client';

import { useState } from "react";
import { ToggleButtonGroup } from "../common/toggle_button_group/toggle_button_group";
import { SubscriptionCard } from "./subscription_card";
import { Interval, IntervalOptions } from "hegel";
import { SubscriptionButton } from "./subscription_button";
import "hegel";

interface Price {
    id: string;
    currency: string;
    unitAmount: number;
    stripeID: string;
    interval?: Interval | null;
}
interface Product {
    id: string;
    name: string;
    features?:
    | {
        title?: string | null;
        id?: string | null;
    }[]
    | null;
    metadata?: any;
    prices?: (string | Price)[] | null;
}

export interface Subscription {
    id: string;
    stripeID: string;
    stripePriceID: string;
    cancelAtPeriodEnd?: boolean | null;
    canceledAt?: string | null;
}

export enum SubscriptionButtonActionType {
    cancel = 'cancel',
    renew = 'renew',
    change = 'change',
    select = 'select'
}

interface Props {
    products: Product[];
    subscription?: Subscription;
    options: IntervalOptions[];
}

export const SubscriptionsGroupCard = ({
    products,
    subscription,
    options,
}: Props): JSX.Element => {
    const [selected, setSelected] = useState(options[0]!.id);

    return (
        <>
            <ToggleButtonGroup options={options} selected={selected!} setOption={setSelected as () => void} />
            <div className="h-96 justify-start items-start gap-7 inline-flex">
                {products
                    .mapNotNull((product) => {
                        const price = getPriceByProduct(product, selected);
                        return price ? { product, price } : null;
                    })
                    .map(({ product, price }) => (
                        <SubscriptionCard
                            key={product.id}
                            title={product.name}
                            price={`${price.unitAmount / 100} ${price.currency}`}
                            features={product.features?.mapNotNull((feature) => feature.title) ?? []}
                            mainCard={product.metadata?.prominent === 'true'}
                        >
                            <SubscriptionButton
                                href={subscriptionButtonHref(
                                    calculateButtonActionType(price.stripeID, subscription),
                                    price.stripeID,
                                    subscription?.stripeID
                                )}
                                subscription={subscription}
                                currentPriceId={price.stripeID}
                            />
                        </SubscriptionCard>
                    ))}
            </div>
        </>
    );
};

const subscriptionButtonHref: (action: SubscriptionButtonActionType, priceId: string, subscriptionId?: string) => string = (action, priceId, subscriptionId) => {
    if (action === 'cancel') return `/stripe/update?subscriptionId=${subscriptionId}&cancelAtPeriodEnd=true`
    else if (action === 'renew') return `/stripe/update?subscriptionId=${subscriptionId}`
    else if (action === 'change') return `/stripe/portal?updateSubscriptionId=${subscriptionId}`
    else if (action === 'select') return `/stripe/checkout?priceId=${priceId}`
    return ''
}
const getPriceByProduct = (product: Product, interval: Interval): Price | null => {
    const price = product.prices?.find((price) => typeof price !== 'string' && price.interval === interval) as Price | undefined;
    if (!price) return null;
    return price;
}

export const calculateButtonActionType = (currentPriceId: string, subscription?: Subscription): SubscriptionButtonActionType => {
    if (subscription && subscription.stripePriceID === currentPriceId) {
        if (subscription.cancelAtPeriodEnd) {
            return SubscriptionButtonActionType.renew;
        } else {
            return SubscriptionButtonActionType.cancel;
        }
    } else if (subscription && subscription.stripePriceID !== currentPriceId) {
        return SubscriptionButtonActionType.change;
    } else {
        return SubscriptionButtonActionType.select;
    }
}