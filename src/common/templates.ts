// =========================================================
// All HTML email templates for Finest Cruise Moments
// Each function accepts dynamic values and returns an HTML string
// =========================================================

const baseLayout = (content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Finest Cruise Moments</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 24px 24px;border-bottom:1px solid #e0e0e0;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:14px;letter-spacing:4px;text-transform:uppercase;color:#555;">
                FINEST CRUISE
              </h1>
              <h2 style="margin:4px 0 0;font-family:Georgia,serif;font-size:32px;letter-spacing:2px;color:#1a1a1a;">
                MOMENTS
              </h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px;background:#f9f9f9;border-top:1px solid #e0e0e0;">
              <p style="margin:0;font-size:12px;color:#999;">
                © ${new Date().getFullYear()} Finest Cruise Moments. All rights reserved.
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#999;">
                If you did not request this email, please ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const ctaButton = (url: string, label: string): string => `
  <p style="text-align:center;margin:32px 0;">
    <a href="${url}"
       style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 32px;
              text-decoration:none;font-size:14px;letter-spacing:1px;border-radius:2px;">
      ${label}
    </a>
  </p>
  <p style="text-align:center;font-size:12px;color:#999;margin-top:8px;">
    Or copy this link into your browser:<br/>
    <a href="${url}" style="color:#555;word-break:break-all;">${url}</a>
  </p>
`;

// ── Email verification ──────────────────────────────────────
export const emailVerificationTemplate = (
  firstname: string,
  verifyUrl: string,
): string =>
  baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">
      Your registration – confirm now
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      Hello <strong>${firstname}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      Thank you for registering with Finest Cruise Moments. To complete your
      registration and activate your account, please click the button below:
    </p>
    ${ctaButton(verifyUrl, 'Confirm registration')}
    <p style="margin:24px 0 0;font-size:13px;color:#888;line-height:1.6;">
      This link is valid for <strong>24 hours</strong>. After that you will need
      to register again.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#444;">
      Kind regards,<br/>Your Finest Cruise Moments Team
    </p>
  `);

// ── Password reset ──────────────────────────────────────────
export const passwordResetTemplate = (
  firstname: string,
  resetUrl: string,
): string =>
  baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">
      Reset your password
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      Hello <strong>${firstname}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      We received a request to reset the password for your account.
      Click the button below — this link is valid for <strong>1 hour</strong>:
    </p>
    ${ctaButton(resetUrl, 'Reset password')}
    <p style="margin:24px 0 0;font-size:13px;color:#888;line-height:1.6;">
      If you did not request a password reset, you can safely ignore this email.
      Your password will not change.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#444;">
      Kind regards,<br/>Your Finest Cruise Moments Team
    </p>
  `);

// ── Welcome (post verification) ─────────────────────────────
export const welcomeTemplate = (
  firstname: string,
  loginUrl: string,
): string =>
  baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">
      Welcome aboard, ${firstname}!
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      Your email address has been verified and your account is now active.
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      Discover exclusive cruise offers from Sea Cloud and many more — 
      log in to start exploring:
    </p>
    ${ctaButton(loginUrl, 'Log in to your account')}
    <p style="margin:16px 0 0;font-size:14px;color:#444;">
      Kind regards,<br/>Your Finest Cruise Moments Team
    </p>
  `);

// ── Password changed confirmation ───────────────────────────
export const passwordChangedTemplate = (firstname: string): string =>
  baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">
      Your password has been changed
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      Hello <strong>${firstname}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      This is a confirmation that the password for your Finest Cruise Moments
      account was successfully changed.
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.6;">
      If you did not make this change, please contact us immediately at
      <a href="mailto:beratung@finestcruisemoments.de" style="color:#1a1a1a;">
        beratung@finestcruisemoments.de
      </a>.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#444;">
      Kind regards,<br/>Your Finest Cruise Moments Team
    </p>
  `);

// ── Booking confirmation invoice ────────────────────────────
export const bookingConfirmationTemplate = (data: {
  inquiry_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  cruise_name: string;
  cruise_code: string | null;
  ship_name: string | null;
  company_name: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  departure_port: string | null;
  destination_port: string | null;
  number_of_adults: number;
  number_of_children: number;
  price_per_person: number | null;
  total_amount: number | null;
  currency: string;
  passengers: Array<{
    firstname: string;
    lastname: string;
    birth_date: string | null;
    nationality: string | null;
    gender: string | null;
  }>;
}): string => {
  const fmt = (n: number | null, cur: string) =>
    n !== null
      ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: cur }).format(n)
      : 'On request';

  const fmtDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const passengerRows = data.passengers
    .map(
      (p, i) => `
      <tr style="border-bottom:1px solid #e8e0d4;">
        <td style="padding:10px 0;font-size:13px;color:#555;width:140px;">Traveler ${i + 1}</td>
        <td style="padding:10px 0;font-size:13px;color:#1a2744;font-weight:600;">
          ${p.gender === 'male' ? 'Mr.' : p.gender === 'female' ? 'Ms.' : ''}
          ${p.firstname} ${p.lastname}
        </td>
        <td style="padding:10px 0;font-size:13px;color:#555;">
          ${p.birth_date ? fmtDate(p.birth_date) : '—'}
        </td>
        <td style="padding:10px 0;font-size:13px;color:#555;">${p.nationality ?? '—'}</td>
      </tr>`,
    )
    .join('');

  const totalPassengers = data.number_of_adults + data.number_of_children;
  const priceRows = data.passengers
    .map(
      (p) => `
      <tr style="border-bottom:1px solid #e8e0d4;">
        <td style="padding:9px 0;font-size:13px;color:#1a2744;">${p.firstname} ${p.lastname}</td>
        <td style="padding:9px 0;font-size:13px;color:#555;">cruise</td>
        <td style="padding:9px 0;font-size:13px;color:#1a2744;text-align:right;font-weight:600;">
          ${fmt(data.price_per_person, data.currency)}
        </td>
      </tr>`,
    )
    .join('');

  return baseLayout(`
    <!-- Reference number banner -->
    <div style="background:#1a2744;color:#c8a96e;padding:16px 24px;border-radius:6px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6);">Booking Reference</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:700;letter-spacing:3px;color:#c8a96e;">
        ${data.inquiry_number}
      </p>
    </div>

    <h2 style="margin:0 0 6px;font-size:20px;color:#1a2744;">Your booking is confirmed!</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
      Dear <strong>${data.customer_name}</strong>,<br/>
      We have received your binding booking request. Thank you!<br/>
      We will send you an automated email confirming receipt within the next few minutes.
    </p>

    <!-- Cruise details box -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="background:#f9f6f0;border:1px solid #e8e0d4;border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c8a96e;">Your Cruise</p>
          <p style="margin:0 0 2px;font-size:16px;font-weight:700;color:#1a2744;">${data.cruise_name}</p>
          ${data.cruise_code ? `<p style="margin:0 0 12px;font-size:12px;color:#888;">Cruise No. ${data.cruise_code}</p>` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
            <tr>
              <td style="padding:5px 0;color:#555;width:140px;">Shipping company</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">${data.company_name ?? '—'}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#555;">Ship</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">${data.ship_name ?? '—'}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#555;">Departure</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">${fmtDate(data.start_date)}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#555;">Return</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">${fmtDate(data.end_date)}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#555;">Duration</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">
                ${data.duration_days ? `${data.duration_days} days` : '—'}
              </td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#555;">Port of departure</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">${data.departure_port ?? '—'}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#555;">Final port</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">${data.destination_port ?? '—'}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;color:#555;">Travelers</td>
              <td style="padding:5px 0;color:#1a2744;font-weight:600;">
                ${totalPassengers} person${totalPassengers > 1 ? 's' : ''}
                (${data.number_of_adults} adult${data.number_of_adults !== 1 ? 's' : ''}
                ${data.number_of_children > 0 ? `, ${data.number_of_children} child${data.number_of_children !== 1 ? 'ren' : ''}` : ''})
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Travel applicant -->
    <h3 style="margin:0 0 12px;font-size:14px;color:#1a2744;text-transform:uppercase;letter-spacing:1px;">
      Travel Applicant
    </h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;font-size:13px;">
      <tr style="border-bottom:1px solid #e8e0d4;">
        <td style="padding:9px 0;color:#555;width:140px;">Name</td>
        <td style="padding:9px 0;color:#1a2744;font-weight:600;">${data.customer_name}</td>
      </tr>
      <tr style="border-bottom:1px solid #e8e0d4;">
        <td style="padding:9px 0;color:#555;">E-mail</td>
        <td style="padding:9px 0;color:#1a2744;">${data.customer_email}</td>
      </tr>
      ${data.customer_phone ? `
      <tr style="border-bottom:1px solid #e8e0d4;">
        <td style="padding:9px 0;color:#555;">Phone</td>
        <td style="padding:9px 0;color:#1a2744;">${data.customer_phone}</td>
      </tr>` : ''}
    </table>

    <!-- Tour participants -->
    <h3 style="margin:0 0 12px;font-size:14px;color:#1a2744;text-transform:uppercase;letter-spacing:1px;">
      Tour Participants
    </h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;font-size:13px;">
      <tr style="border-bottom:2px solid #c8a96e;">
        <th style="padding:8px 0;text-align:left;color:#888;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:1px;">
          Traveler
        </th>
        <th style="padding:8px 0;text-align:left;color:#888;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:1px;">
          Name
        </th>
        <th style="padding:8px 0;text-align:left;color:#888;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:1px;">
          Date of birth
        </th>
        <th style="padding:8px 0;text-align:left;color:#888;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:1px;">
          Nationality
        </th>
      </tr>
      ${passengerRows}
    </table>

    <!-- Price calculation -->
    <h3 style="margin:0 0 12px;font-size:14px;color:#1a2744;text-transform:uppercase;letter-spacing:1px;">
      Price Calculation
    </h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      ${priceRows}
      <tr style="border-top:2px solid #1a2744;">
        <td style="padding:12px 0;font-size:15px;font-weight:700;color:#1a2744;" colspan="2">Total price</td>
        <td style="padding:12px 0;font-size:15px;font-weight:700;color:#1a2744;text-align:right;">
          ${fmt(data.total_amount, data.currency)}
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 8px;font-size:13px;color:#888;line-height:1.6;border-top:1px solid #e8e0d4;padding-top:20px;">
      If you have any questions, please contact us during our service hours.<br/>
      Please always quote your reference number: <strong>${data.inquiry_number}</strong>
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#444;">
      Sincerely,<br/><strong>Your Finest Cruise Moments Team</strong>
    </p>
  `);
};
