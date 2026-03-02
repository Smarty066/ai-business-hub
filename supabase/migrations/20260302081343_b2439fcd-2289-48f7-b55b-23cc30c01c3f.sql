
-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  service text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  queue_position integer DEFAULT 0,
  estimated_wait integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Transactions table for Budget
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'expense',
  category text DEFAULT '',
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own transactions" ON public.transactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Customers table for CRM
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  channel text DEFAULT 'whatsapp',
  status text DEFAULT 'new',
  last_contact date DEFAULT CURRENT_DATE,
  next_follow_up date,
  notes text DEFAULT '',
  total_spent numeric DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own customers" ON public.customers
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Bank details for affiliate withdrawals
CREATE TABLE public.bank_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  bank_name text NOT NULL DEFAULT '',
  account_number text NOT NULL DEFAULT '',
  account_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own bank details" ON public.bank_details
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_bank_details_updated_at
  BEFORE UPDATE ON public.bank_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
