-- RPC function to adjust inventory safely
CREATE OR REPLACE FUNCTION public.adjust_inventory(
  p_store_id UUID,
  p_variant_id UUID,
  p_amount INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_new_quantity INTEGER;
BEGIN
  -- 1. Try to Update
  UPDATE public.inventory
  SET quantity = quantity + p_amount,
      updated_at = NOW()
  WHERE store_id = p_store_id AND variant_id = p_variant_id
  RETURNING quantity INTO v_new_quantity;

  -- 2. If not found, insert (if amount is positive)
  IF NOT FOUND THEN
    IF p_amount >= 0 THEN
      INSERT INTO public.inventory (store_id, variant_id, quantity)
      VALUES (p_store_id, p_variant_id, p_amount)
      RETURNING quantity INTO v_new_quantity;
    ELSE
      RAISE EXCEPTION 'Negative adjustment on non-existent inventory';
    END IF;
  END IF;

  RETURN jsonb_build_object('success', true, 'new_quantity', v_new_quantity);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
