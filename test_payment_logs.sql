-- Teste simples para verificar se conseguimos inserir em payment_logs
INSERT INTO public.payment_logs (
  booking_id,
  status,
  payment_intent_id,
  stripe_response,
  created_at
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'test',
  'pi_test_123',
  '{"test": true}',
  NOW()
);

-- Verificar se inseriu
SELECT * FROM public.payment_logs WHERE status = 'test';
