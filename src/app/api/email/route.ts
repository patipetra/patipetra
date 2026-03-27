import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL     = 'info@patipetra.com';
const ADMIN_EMAIL    = 'info@patipetra.com';

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: `Patıpetra <${FROM_EMAIL}>`, to, subject, html }),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (type === 'vet_application') {
      // Admin'e bildirim
      await sendEmail(
        ADMIN_EMAIL,
        `🩺 Yeni Veteriner Başvurusu: ${data.fullName}`,
        `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2F2622;padding:20px;border-radius:12px;margin-bottom:20px">
            <h1 style="color:#E8B86D;font-size:24px;margin:0">🩺 Yeni Veteriner Başvurusu</h1>
          </div>
          <div style="background:#F7F2EA;padding:20px;border-radius:12px;margin-bottom:16px">
            <h2 style="color:#2F2622;margin:0 0 16px">${data.fullName}</h2>
            <table style="width:100%;border-collapse:collapse">
              ${[
                ['Klinik',    data.clinicName],
                ['Şehir',     `${data.city} / ${data.district||''}`],
                ['Telefon',   data.phone],
                ['E-posta',   data.email],
                ['T.C. No',   data.tcNo],
                ['Vergi No',  data.taxNo||'-'],
                ['Eğitim',    data.education],
                ['Deneyim',   `${data.experience} yıl`],
                ['Plan',      data.planType==='yearly'?'Yıllık':'Aylık'],
                ['Uzmanlıklar', (data.specs||[]).join(', ')],
              ].map(([k,v]) => `
                <tr>
                  <td style="padding:8px;border-bottom:1px solid #E3D9C6;color:#7A7368;font-weight:bold;width:130px">${k}</td>
                  <td style="padding:8px;border-bottom:1px solid #E3D9C6;color:#2F2622">${v}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          ${data.bio ? `<div style="background:#fff;border:1px solid #E3D9C6;padding:16px;border-radius:12px;margin-bottom:16px"><strong>Hakkında:</strong><p style="color:#5C4A32;margin:8px 0 0">${data.bio}</p></div>` : ''}
          <a href="https://patipetra.com/admin" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
            Admin Paneline Git →
          </a>
        </div>
        `
      );

      // Veterinere otomatik onay bekliyor maili
      await sendEmail(
        data.email,
        'Patıpetra Veteriner Başvurunuz Alındı 🩺',
        `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2F2622;padding:20px;border-radius:12px;margin-bottom:20px">
            <h1 style="color:#E8B86D;font-size:24px;margin:0">Patıpetra 🐾</h1>
          </div>
          <h2 style="color:#2F2622">Merhaba ${data.fullName},</h2>
          <p style="color:#5C4A32;line-height:1.8">Veteriner başvurunuz başarıyla alındı. Ekibimiz başvurunuzu en kısa sürede inceleyecek.</p>
          <div style="background:#F7F2EA;padding:20px;border-radius:12px;margin:20px 0">
            <h3 style="color:#2F2622;margin:0 0 16px">Sonraki Adımlar:</h3>
            ${[
              ['1','İnceleme','Başvurunuz 2 iş günü içinde incelenir.'],
              ['2','Canlı Görüşme','Uygun görüldüğünüzde görüntülü görüşme için davet edilirsiniz.'],
              ['3','Sözleşme','Dijital sözleşme e-posta ile gönderilir.'],
              ['4','Ödeme & Aktivasyon','Ödeme sonrası profiliniz yayına girer.'],
            ].map(([n,t,d])=>`
              <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
                <div style="background:#C9832E;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;text-align:center;line-height:24px">${n}</div>
                <div><strong style="color:#2F2622">${t}</strong><p style="color:#7A7368;margin:4px 0 0;font-size:14px">${d}</p></div>
              </div>
            `).join('')}
          </div>
          <p style="color:#7A7368;font-size:14px">Sorularınız için <a href="mailto:info@patipetra.com" style="color:#C9832E">info@patipetra.com</a> adresine yazabilirsiniz.</p>
          <p style="color:#9A9188;font-size:12px;margin-top:20px">Patıpetra — Türkiye'nin Pet Yaşam Platformu</p>
        </div>
        `
      );
    }

    else if (type === 'vet_contract') {
      // Veterinere sözleşme maili
      await sendEmail(
        data.vetEmail,
        'Patıpetra Veteriner Sözleşmesi 📋',
        `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2F2622;padding:20px;border-radius:12px;margin-bottom:20px">
            <h1 style="color:#E8B86D;font-size:24px;margin:0">Patıpetra 🐾</h1>
          </div>
          <h2 style="color:#2F2622">Merhaba ${data.vetName},</h2>
          <p style="color:#5C4A32;line-height:1.8">Başvurunuz onaylandı! Aşağıda sözleşme detaylarınızı bulabilirsiniz.</p>
          <div style="background:#F7F2EA;padding:20px;border-radius:12px;margin:20px 0;border-left:4px solid #C9832E">
            <h3 style="color:#2F2622;margin:0 0 16px">📋 Sözleşme Detayları</h3>
            <table style="width:100%;border-collapse:collapse">
              ${[
                ['Veteriner',      data.vetName],
                ['Klinik',         data.clinicName],
                ['Plan',           data.planType==='yearly'?'Yıllık':'Aylık'],
                ['Aylık Ücret',    `₺${data.monthlyFee}`],
                ['Yıllık Ücret',   `₺${data.yearlyFee}`],
                ['Başlangıç',      data.startDate],
                ['Bitiş',          data.endDate||'Belirsiz'],
              ].map(([k,v])=>`
                <tr>
                  <td style="padding:8px;border-bottom:1px solid #E3D9C6;color:#7A7368;font-weight:bold;width:130px">${k}</td>
                  <td style="padding:8px;border-bottom:1px solid #E3D9C6;color:#2F2622">${v}</td>
                </tr>
              `).join('')}
            </table>
            ${data.notes ? `<p style="color:#5C4A32;margin:16px 0 0"><strong>Notlar:</strong> ${data.notes}</p>` : ''}
          </div>
          <div style="background:#fff3cd;border:1px solid #ffc107;padding:16px;border-radius:12px;margin-bottom:20px">
            <p style="color:#856404;margin:0">⚠️ Sözleşmeyi onaylamak için lütfen <strong>info@patipetra.com</strong> adresine "ONAYLIYORUM - ${data.vetName}" yazarak yanıtlayın.</p>
          </div>
          <p style="color:#7A7368;font-size:14px">Sorularınız için <a href="mailto:info@patipetra.com" style="color:#C9832E">info@patipetra.com</a></p>
          <p style="color:#9A9188;font-size:12px">Patıpetra — Türkiye'nin Pet Yaşam Platformu</p>
        </div>
        `
      );
    }

    else if (type === 'vet_approved') {
      // Veterinere onay maili
      await sendEmail(
        data.vetEmail,
        '🎉 Patıpetra Veteriner Profiliniz Yayında!',
        `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2F2622;padding:20px;border-radius:12px;margin-bottom:20px">
            <h1 style="color:#E8B86D;font-size:24px;margin:0">Patıpetra 🐾</h1>
          </div>
          <h2 style="color:#2F2622">Tebrikler, ${data.vetName}! 🎉</h2>
          <p style="color:#5C4A32;line-height:1.8">Veteriner profiliniz onaylandı ve Patıpetra'da yayına girdi!</p>
          <div style="background:#F7F2EA;padding:20px;border-radius:12px;margin:20px 0">
            <h3 style="color:#2F2622;margin:0 0 12px">Artık yapabilecekleriniz:</h3>
            ${[
              '✅ Pet sahiplerinin sorularını yanıtlayabilirsiniz',
              '📅 Randevu talepleri alabilirsiniz',
              '⭐ Müşteri yorumları toplayabilirsiniz',
              '🩺 Veteriner panelinizi kullanabilirsiniz',
            ].map(f=>`<p style="color:#5C4A32;margin:8px 0">${f}</p>`).join('')}
          </div>
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">
            Veteriner Panelinize Gidin →
          </a>
          <br/><br/>
          <a href="https://patipetra.com/veterinerler/${data.vetSlug}" style="display:inline-block;background:#5C4A32;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
            Profilinizi Görüntüleyin →
          </a>
          <p style="color:#9A9188;font-size:12px;margin-top:20px">Patıpetra — Türkiye'nin Pet Yaşam Platformu</p>
        </div>
        `
      );
    }

    else if (type === 'vet_meeting') {
      // Görüşme daveti maili
      await sendEmail(
        data.vetEmail,
        '📅 Patıpetra — Görüntülü Görüşme Daveti',
        `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2F2622;padding:20px;border-radius:12px;margin-bottom:20px">
            <h1 style="color:#E8B86D;font-size:24px;margin:0">Patıpetra 🐾</h1>
          </div>
          <h2 style="color:#2F2622">Merhaba ${data.vetName},</h2>
          <p style="color:#5C4A32;line-height:1.8">Başvurunuzu inceledik. Sizi daha yakından tanımak için görüntülü görüşme yapmak istiyoruz.</p>
          <div style="background:#F7F2EA;padding:20px;border-radius:12px;margin:20px 0;border-left:4px solid #C9832E">
            <h3 style="color:#2F2622;margin:0 0 12px">📅 Görüşme Bilgileri</h3>
            <p style="color:#5C4A32;font-size:18px;font-weight:bold;margin:0">${new Date(data.meetingDate).toLocaleString('tr-TR')}</p>
            ${data.adminNotes ? `<p style="color:#7A7368;margin:12px 0 0">${data.adminNotes}</p>` : ''}
          </div>
          <p style="color:#5C4A32">Görüşme için hazır olup olmadığınızı <a href="mailto:info@patipetra.com" style="color:#C9832E">info@patipetra.com</a> adresine bildirin.</p>
          <p style="color:#9A9188;font-size:12px;margin-top:20px">Patıpetra — Türkiye'nin Pet Yaşam Platformu</p>
        </div>
        `
      );
    }

    else if (type === 'question_answered') {
      if (!data.userEmail) {
        return NextResponse.json({ success: true });
      }
      await sendEmail(
        data.userEmail,
        `💬 Sorunuz Yanıtlandı — ${data.vetName}`,
        `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2F2622;padding:20px;border-radius:12px;margin-bottom:20px">
            <h1 style="color:#E8B86D;font-size:24px;margin:0">Patıpetra 🐾</h1>
          </div>
          <h2 style="color:#2F2622">Merhaba ${data.userName},</h2>
          <p style="color:#5C4A32;line-height:1.8">Sorunuz <strong>${data.vetName}</strong> tarafından yanıtlandı.</p>
          <div style="background:#F7F2EA;padding:16px;border-radius:12px;margin:16px 0">
            <div style="color:#9A9188;font-size:12px;margin-bottom:8px">Sorunuz:</div>
            <p style="color:#2F2622;font-weight:bold;margin:0">${data.question}</p>
          </div>
          <div style="background:#fff;border:2px solid #C9832E;padding:16px;border-radius:12px;margin:16px 0">
            <div style="color:#C9832E;font-size:12px;font-weight:bold;margin-bottom:8px">🩺 ${data.vetName} yanıtladı:</div>
            <p style="color:#5C4A32;line-height:1.8;margin:0">${data.answer}</p>
          </div>
          <a href="https://patipetra.com/veterinerler/${data.vetSlug}" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
            Veteriner Profiline Git →
          </a>
          <p style="color:#9A9188;font-size:12px;margin-top:20px">Patıpetra — Türkiye'nin Pet Yaşam Platformu</p>
        </div>
        `
      );
    }

    return NextResponse.json({ success: true });
  } catch(err: any) {
    console.error('Email error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
