import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Settings as SettingsIcon, User, Bell, Shield, Zap, Globe, Landmark, Loader2, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  const { currency } = useCurrency();
  const { user, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();

  // Profile form
  const [name, setName] = useState(profile?.full_name || "");
  const [email] = useState(user?.email || "");
  const [company, setCompany] = useState(profile?.business_name || "");

  useEffect(() => {
    if (profile) {
      setName(profile.full_name);
      setCompany(profile.business_name);
    }
  }, [profile]);

  // Password change
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Bank details
  const { data: bankDetails } = useQuery({
    queryKey: ["bank-details", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("bank_details")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    if (bankDetails) {
      setBankName(bankDetails.bank_name || "");
      setAccountNumber(bankDetails.account_number || "");
      setAccountName(bankDetails.account_name || "");
    }
  }, [bankDetails]);

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase.from("profiles").update({
        full_name: name.trim(),
        business_name: company.trim(),
      }).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      refreshProfile();
      toast.success("Profile saved successfully!");
    },
    onError: () => toast.error("Failed to save profile"),
  });

  const saveBankMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase.from("bank_details").upsert({
        user_id: user.id,
        bank_name: bankName.trim(),
        account_number: accountNumber.trim(),
        account_name: accountName.trim(),
      }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-details", user?.id] });
      toast.success("Bank details saved!");
    },
    onError: () => toast.error("Failed to save bank details"),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      setPasswordOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update password"),
  });

  const handleSave = () => {
    saveProfileMutation.mutate();
    if (bankName || accountNumber || accountName) {
      saveBankMutation.mutate();
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="glass-strong border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Profile</CardTitle>
            </div>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled className="opacity-60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="glass-strong border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Bank Details</CardTitle>
            </div>
            <CardDescription>Used for affiliate earnings withdrawal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" placeholder="e.g., GTBank, Access Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="0123456789" maxLength={10} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="Full name on account" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional / Currency */}
        <Card className="glass-strong border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Regional</CardTitle>
            </div>
            <CardDescription>Set your preferred currency for all modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currency</p>
                <p className="text-sm text-muted-foreground">
                  {currency === "NGN"
                    ? "Nigerian Naira (₦) — for businesses in Nigeria"
                    : "US Dollar ($) — for international businesses"}
                </p>
              </div>
              <CurrencySelector />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-strong border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about bookings and insights</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Inventory Restock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when stock is running low</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Budget Alerts</p>
                <p className="text-sm text-muted-foreground">Warnings about spending thresholds</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* AI Preferences */}
        <Card className="glass-strong border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Preferences</CardTitle>
            </div>
            <CardDescription>Customize AI behavior across modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Smart Suggestions</p>
                <p className="text-sm text-muted-foreground">Allow AI to proactively offer recommendations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Predictive Analytics</p>
                <p className="text-sm text-muted-foreground">Enable AI-powered forecasting</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass-strong border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Security</CardTitle>
            </div>
            <CardDescription>Protect your account and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)}>
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="hero"
            onClick={handleSave}
            disabled={saveProfileMutation.isPending || saveBankMutation.isPending}
          >
            {(saveProfileMutation.isPending || saveBankMutation.isPending) && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your new password below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              variant="hero"
              className="w-full"
              onClick={() => changePasswordMutation.mutate()}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
