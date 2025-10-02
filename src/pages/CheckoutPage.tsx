import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  clientSecret: string;
  bookingIds: string[];
  isRecurring?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  bookingIds,
  isRecurring = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage(
            language === "en" ? "Payment succeeded!" : "Pagamento bem-sucedido!"
          );
          break;
        case "processing":
          setMessage(
            language === "en"
              ? "Your payment is processing."
              : "Seu pagamento está sendo processado."
          );
          break;
        case "requires_payment_method":
          setMessage(
            language === "en"
              ? "Your payment was not successful, please try again."
              : "Seu pagamento não foi bem-sucedido, tente novamente."
          );
          break;
        default:
          setMessage(
            language === "en" ? "Something went wrong." : "Algo deu errado."
          );
          break;
      }
    });
  }, [stripe, clientSecret, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL after successful payment
        return_url: `${
          window.location.origin
        }/booking-success?booking_ids=${bookingIds.join(
          ","
        )}&recurring=${isRecurring}`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred");
      } else {
        setMessage(
          language === "en"
            ? "An unexpected error occurred."
            : "Ocorreu um erro inesperado."
        );
      }

      toast({
        title: language === "en" ? "Payment Error" : "Erro de Pagamento",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {language === "en"
              ? "Complete Your Payment"
              : "Complete Seu Pagamento"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
            <Button
              disabled={isLoading || !stripe || !elements}
              id="submit"
              className="w-full mt-6"
              type="submit"
            >
              <span id="button-text">
                {isLoading ? (
                  <div className="spinner" id="spinner">
                    {language === "en" ? "Processing..." : "Processando..."}
                  </div>
                ) : language === "en" ? (
                  "Pay Now"
                ) : (
                  "Pagar Agora"
                )}
              </span>
            </Button>

            {/* Show any error or success messages */}
            {message && (
              <div id="payment-message" className="mt-4 text-center text-sm">
                {message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useAuthStore();

  const clientSecret = searchParams.get("client_secret");
  const bookingIds = searchParams.get("booking_ids")?.split(",") || [];
  const isRecurring = searchParams.get("recurring") === "true";

  useEffect(() => {
    if (!clientSecret) {
      navigate("/booking");
    }
  }, [clientSecret, navigate]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {language === "en"
              ? "Invalid Payment Session"
              : "Sessão de Pagamento Inválida"}
          </h2>
          <p>
            {language === "en"
              ? "Redirecting to booking page..."
              : "Redirecionando para a página de reserva..."}
          </p>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: "stripe" as const,
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {language === "en" ? "Secure Checkout" : "Checkout Seguro"}
        </h1>

        {stripePromise && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              clientSecret={clientSecret}
              bookingIds={bookingIds}
              isRecurring={isRecurring}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
