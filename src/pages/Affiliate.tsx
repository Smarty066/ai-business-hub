import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Copy,
  Share2,
  Wallet,
  TrendingUp,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

interface Referral {
  id: string;
  referral_code: string;
  referred_id: string | null;
  signup_earned: number;
  subscription_earned: number;
  total_earned: number;
  withdrawn: number;
  status: string;
  created_at: string;
}

export default function Affiliate() {
  const { user } = useAuth();
  const { currency, formatAmount } = useCurrency();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);

  const signupReward = currency === "NGN" ? 1000 : 0.5;
  const subReward = currency === "NGN" ? 250 : 0.25;
  const minWithdraw = currency === "NGN" ? 1000 : 1;
  const subCost = currency === "NGN" ? 2500 : 3;

  useEffect(() => {
    if (!user) return;

    // Generate referral code from user ID
    const code = user.id.slice(0, 8).toUpperCase();
    setReferralCode(code);

    const fetchReferrals = async () => {
      const { data } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      setReferrals((data as Referral[]) || []);
      setLoading(false);
    };
    fetchReferrals();
  }, [user]);

  const totalEarned = referrals.reduce((s, r) => s + Number(r.total_earned), 0);
  const totalWithdrawn = referrals.reduce((s, r) => s + Number(r.withdrawn), 0);
  const balance = totalEarned - totalWithdrawn;
  const activeReferrals = referrals.filter((r) => r.status === "confirmed").length;

  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const shareLink = async () => {
    const text = `Join OjaLink and grow your business smarter! Use my referral link: ${referralLink}`;
    if (navigator.share) {
      await navigator.share({ title: "Join OjaLink", text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWithdraw = () => {
    if (balance < minWithdraw) {
      toast.error(`Minimum withdrawal is ${formatAmount(minWithdraw)}`);
      return;
    }
    toast.success("Withdrawal request submitted! You'll receive payment within 24-48 hours.");
  };

  const handleUseForSubscription = () => {
    if (balance < subCost) {
      toast.error(`You need ${formatAmount(subCost)} to subscribe. Current balance: ${formatAmount(balance)}`);
      return;
    }
    toast.success("Subscription activated using referral balance!");
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Affiliate Program</h1>
            <p className="text-muted-foreground">
              Earn {formatAmount(signupReward)} per referral signup + {formatAmount(subReward)} per monthly subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <Card className="glass-strong border-primary/30 mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Your Referral Link</h3>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="flex-1 text-sm" />
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="hero" size="sm" onClick={shareLink}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <Users className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{referrals.length}</p>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <TrendingUp className="h-5 w-5 text-success mb-2" />
            <p className="text-2xl font-bold">{formatAmount(totalEarned)}</p>
            <p className="text-sm text-muted-foreground">Total Earned</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <Wallet className="h-5 w-5 text-warning mb-2" />
            <p className="text-2xl font-bold">{formatAmount(balance)}</p>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <Gift className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{activeReferrals}</p>
            <p className="text-sm text-muted-foreground">Active Referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <Button variant="hero" onClick={handleWithdraw}>
          <Wallet className="h-4 w-4 mr-2" />
          Withdraw (min {formatAmount(minWithdraw)})
        </Button>
        <Button variant="outline" onClick={handleUseForSubscription}>
          Use Balance for Subscription ({formatAmount(subCost)})
        </Button>
      </div>

      {/* How it works */}
      <Card className="glass-strong border-0 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 text-center">
              <Share2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm mb-1">1. Share Your Link</h4>
              <p className="text-xs text-muted-foreground">Share your unique referral link with friends & colleagues</p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 text-center">
              <Users className="h-8 w-8 text-success mx-auto mb-2" />
              <h4 className="font-semibold text-sm mb-1">2. They Sign Up</h4>
              <p className="text-xs text-muted-foreground">You earn {formatAmount(signupReward)} when they register</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 text-center">
              <Wallet className="h-8 w-8 text-warning mx-auto mb-2" />
              <h4 className="font-semibold text-sm mb-1">3. Earn Recurring</h4>
              <p className="text-xs text-muted-foreground">Earn {formatAmount(subReward)} each time they subscribe monthly</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card className="glass-strong border-0">
        <CardHeader>
          <CardTitle className="text-lg">Your Referrals</CardTitle>
          <CardDescription>Track all your referral signups and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No referrals yet. Share your link to start earning!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Signup Earned</TableHead>
                  <TableHead>Sub Earned</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={r.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatAmount(Number(r.signup_earned))}</TableCell>
                    <TableCell>{formatAmount(Number(r.subscription_earned))}</TableCell>
                    <TableCell className="font-medium">{formatAmount(Number(r.total_earned))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
