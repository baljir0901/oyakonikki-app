
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Crown, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentSettingsProps {
  onBack: () => void;
}

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const PaymentSettings = ({ onBack }: PaymentSettingsProps) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ subscribed: false });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    setChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("認証が必要です");
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setSubscriptionData(data);
      
      toast({
        title: "サブスクリプション状態を更新しました",
        description: data.subscribed ? `${data.subscription_tier}プランが有効です` : "サブスクリプションはありません",
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "エラー",
        description: "サブスクリプション状態の確認に失敗しました",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("認証が必要です");
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      toast({
        title: "決済ページに移動します",
        description: "テスト環境での決済シミュレーションです",
      });

      // Simulate redirect to checkout
      setTimeout(() => {
        toast({
          title: "決済完了（テスト）",
          description: "テスト決済が完了しました。サブスクリプションが有効になりました。",
        });
        checkSubscriptionStatus();
      }, 2000);
      
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "エラー",
        description: "決済の開始に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerPortal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("認証が必要です");
      }

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      toast({
        title: "カスタマーポータル（テスト）",
        description: "テスト環境では実際のポータルページは表示されません",
      });
      
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "エラー",
        description: "カスタマーポータルの表示に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">支払い設定</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            現在のプラン
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {subscriptionData.subscribed ? subscriptionData.subscription_tier : "無料プラン"}
                </span>
                {subscriptionData.subscribed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    有効
                  </Badge>
                )}
              </div>
              {subscriptionData.subscription_end && (
                <p className="text-sm text-gray-500">
                  次回更新日: {new Date(subscriptionData.subscription_end).toLocaleDateString('ja-JP')}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkSubscriptionStatus}
              disabled={checking}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
              更新
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            プラン管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">プレミアムプラン</h3>
                  <p className="text-sm text-gray-500">月額 ¥799</p>
                  <p className="text-xs text-gray-400 mt-1">
                    • 無制限の日記作成<br/>
                    • 高度な分析機能<br/>
                    • データのバックアップ
                  </p>
                </div>
                {!subscriptionData.subscribed ? (
                  <Button onClick={handleCheckout} disabled={loading}>
                    {loading ? "処理中..." : "申し込む"}
                  </Button>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    現在のプラン
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {subscriptionData.subscribed && (
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={handleCustomerPortal} className="w-full">
                サブスクリプション管理
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                支払い方法の変更、プランの変更、キャンセルなど
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">テスト環境について</h3>
        <p className="text-sm text-blue-700">
          現在はテスト環境で動作しています。実際の決済は行われません。
          メールアドレスに「premium」や「test」が含まれている場合、
          自動的にプレミアムプランのシミュレーションが有効になります。
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          戻る
        </Button>
      </div>
    </div>
  );
};
