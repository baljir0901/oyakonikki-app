
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FamilyInvitationRequest {
  invitationId: string;
  inviteeEmail: string;
  inviterName: string;
  inviterRole: string;
  invitationCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invitationId, inviteeEmail, inviterName, inviterRole, invitationCode }: FamilyInvitationRequest = await req.json();

    console.log('Sending family invitation email (TEST MODE - ALL EMAILS ALLOWED):', {
      invitationId,
      inviteeEmail,
      inviterName,
      inviterRole,
      invitationCode
    });

    const roleText = inviterRole === 'parent' ? '保護者' : 'お子様';
    const appUrl = 'https://preview--oyakoni-diary-bridge.lovable.app';

    // For testing - always send email without any restrictions
    const emailResponse = await resend.emails.send({
      from: "親子日記 <onboarding@resend.dev>",
      to: [inviteeEmail],
      subject: `${roleText}からの家族招待 (テスト版)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">家族招待 (テスト版)</h1>
          
          <p>こんにちは！</p>
          
          <p>${inviterName}さんから親子日記アプリへの招待が届きました。</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">招待コード</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px;">${invitationCode}</p>
          </div>
          
          <p>以下のリンクをクリックして、アプリにログインし、招待を承認してください：</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">アプリを開く</a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            ※ このメールはテスト版です。実際のサービスではありません。
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            親子日記アプリ (テスト版)
          </p>
        </div>
      `,
    });

    console.log("Family invitation email sent successfully (TEST MODE):", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResponse,
      message: "Email sent in test mode - all emails allowed"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending family invitation email (TEST MODE):", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Error in test mode"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
