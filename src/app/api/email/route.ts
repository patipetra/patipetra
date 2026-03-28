import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL     = 'info@patipetra.com';
const ADMIN_EMAIL    = 'info@patipetra.com';

async function sendEmail(to: string, subject: string, html: string) {
  if (!to || !to.includes('@')) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Patipetra <${FROM_EMAIL}>`,
      to, subject, html,
    }),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (type === 'vet_application') {
      await sendEmail(ADMIN_EMAIL, `Yeni Veteriner Basvurusu: ${data.fullName}`,
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Veteriner Basvurusu</h2>
          <p><b>Ad:</b> ${data.fullName}</p>
          <p><b>Klinik:</b> ${data.clinicName}</p>
          <p><b>Sehir:</b> ${data.city}</p>
          <p><b>Telefon:</b> ${data.phone}</p>
          <p><b>E-posta:</b> ${data.email}</p>
          <p><b>Uzmanliklar:</b> ${(data.specs||[]).join(', ')}</p>
          <a href="https://patipetra.com/admin" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Admin Paneline Git</a>
        </div>`
      );
      await sendEmail(data.email, 'Patipetra Veteriner Basvurunuz Alindi',
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${data.fullName},</h2>
          <p>Basvurunuz alindi. 2 is gunu icinde incelenecek.</p>
        </div>`
      );
    }

    else if (type === 'vet_meeting') {
      await sendEmail(data.vetEmail, 'Patipetra - Goruntulusu Gorusme Daveti',
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${data.vetName},</h2>
          <p>Goruntulusu gorusme planlanmistir.</p>
          <p><b>Tarih:</b> ${new Date(data.meetingDate).toLocaleString('tr-TR')}</p>
          ${data.adminNotes ? `<p><b>Not:</b> ${data.adminNotes}</p>` : ''}
        </div>`
      );
    }

    else if (type === 'vet_contract') {
      await sendEmail(data.vetEmail, 'Patipetra Veteriner Sozlesmesi',
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${data.vetName},</h2>
          <p><b>Plan:</b> ${data.planType === 'yearly' ? 'Yillik' : 'Aylik'}</p>
          <p><b>Aylik Ucret:</b> ${data.monthlyFee} TL</p>
          <p><b>Yillik Ucret:</b> ${data.yearlyFee} TL</p>
          <p><b>Baslangic:</b> ${data.startDate}</p>
          ${data.notes ? `<p><b>Notlar:</b> ${data.notes}</p>` : ''}
          <p>Onaylamak icin info@patipetra.com adresine "ONAYLIYORUM - ${data.vetName}" yazin.</p>
        </div>`
      );
    }

    else if (type === 'vet_approved') {
      await sendEmail(data.vetEmail, 'Tebrikler! Patipetra Profiliniz Yayinda',
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Tebrikler ${data.vetName}!</h2>
          <p>Veteriner profiliniz onaylandi ve yayina girdi.</p>
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Veteriner Panelinize Gidin</a>
        </div>`
      );
    }

    else if (type === 'question_answered') {
      if (!data.userEmail) return NextResponse.json({ success: true });
      await sendEmail(data.userEmail, `Sorunuz Yanitlandi - ${data.vetName}`,
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${data.userName},</h2>
          <p>Sorunuz <b>${data.vetName}</b> tarafindan yanitlandi.</p>
          <div style="background:#F7F2EA;padding:16px;border-radius:8px;margin:16px 0">
            <p><b>Sorunuz:</b> ${data.question}</p>
          </div>
          <div style="background:#fff3e0;padding:16px;border-radius:8px;border-left:4px solid #C9832E">
            <p><b>Yanit:</b> ${data.answer}</p>
          </div>
          <a href="https://patipetra.com/veterinerler/${data.vetSlug}" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Veteriner Profiline Git</a>
        </div>`
      );
    }

    else if (type === 'vet_new_question') {
      await sendEmail(data.vetEmail, `Yeni Soru: ${data.userName}`,
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Soru Geldi!</h2>
          <p><b>${data.userName}</b> size bir soru sordu:</p>
          ${data.petInfo ? `<p><b>Pet:</b> ${data.petInfo}</p>` : ''}
          <div style="background:#F7F2EA;padding:16px;border-radius:8px;border-left:4px solid #C9832E">
            <p>${data.question}</p>
          </div>
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Veteriner Panelinde Yanitla</a>
        </div>`
      );
    }

    else if (type === 'vet_new_appointment') {
      await sendEmail(data.vetEmail, `Yeni Randevu Talebi: ${data.userName}`,
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Randevu Talebi!</h2>
          <p><b>${data.userName}</b> randevu talep etti.</p>
          <p><b>Tarih:</b> ${data.date} - ${data.time}</p>
          <p><b>Telefon:</b> ${data.userPhone}</p>
          ${data.petName ? `<p><b>Pet:</b> ${data.petName}</p>` : ''}
          ${data.note ? `<p><b>Not:</b> ${data.note}</p>` : ''}
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Randevuyu Onayla</a>
        </div>`
      );
    }

    else if (type === 'vet_new_message') {
      await sendEmail(data.vetEmail, `Yeni Mesaj: ${data.userName}`,
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Mesaj!</h2>
          <p><b>${data.userName}</b> size mesaj gonderdi:</p>
          <div style="background:#F7F2EA;padding:16px;border-radius:8px">
            <p>${data.message}</p>
          </div>
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Veteriner Panelinde Gor</a>
        </div>`
      );
    }

    else if (type === 'community_request') {
      await sendEmail(ADMIN_EMAIL, `Yeni Topluluk Basvurusu: ${data.communityName}`,
        `<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Topluluk Basvurusu</h2>
          <p><b>Topluluk Adi:</b> ${data.communityName}</p>
          <p><b>Aciklama:</b> ${data.description}</p>
          <p><b>Kategori:</b> ${data.category}</p>
          <p><b>Kurucu:</b> ${data.creatorName} (${data.creatorEmail})</p>
          <a href="https://patipetra.com/admin" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Admin Panelinde Incele</a>
        </div>`
      );
    }

    return NextResponse.json({ success: true });
  } catch(err: any) {
    console.error('Email error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
