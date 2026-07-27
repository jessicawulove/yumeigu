import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { smtpHost, smtpPort, smtpUser, smtpPassword, fromName, fromEmail } = body;

    if (!smtpHost || !smtpUser || !smtpPassword) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 使用环境变量中的 Supabase 配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 检查是否已有配置
    const { data: existing } = await supabase
      .from('email_config')
      .select('id')
      .limit(1);

    let result;
    if (existing && existing.length > 0) {
      // 更新现有配置
      result = await supabase
        .from('email_config')
        .update({
          smtp_host: smtpHost,
          smtp_port: smtpPort || 587,
          smtp_user: smtpUser,
          smtp_password: smtpPassword, // 实际项目中应该加密存储
          from_name: fromName,
          from_email: fromEmail,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);
    } else {
      // 插入新配置
      result = await supabase
        .from('email_config')
        .insert({
          smtp_host: smtpHost,
          smtp_port: smtpPort || 587,
          smtp_user: smtpUser,
          smtp_password: smtpPassword, // 实际项目中应该加密存储
          from_name: fromName,
          from_email: fromEmail,
        });
    }

    if (result.error) {
      console.error('保存邮件配置失败:', result.error);
      return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存邮件配置错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('email_config')
      .select('smtp_host, smtp_port, smtp_user, from_name, from_email, is_active')
      .limit(1);

    if (error) {
      console.error('获取邮件配置失败:', error);
      return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }

    // 不返回密码，只显示 ****
    const config = data && data.length > 0 ? data[0] : null;
    
    return NextResponse.json({ 
      config: config ? {
        ...config,
        smtp_password: '****', // 隐藏密码
      } : null 
    });
  } catch (error) {
    console.error('获取邮件配置错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
