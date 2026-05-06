export interface IBookAppointmentFromReminderMailPageData {
  vendorId: number;
  recurringItemId: number;
  userId: number;
  vendorName: string;
  recurringItemName: string;
}

export function bookAppointmentFromReminderMail(
  pageData: IBookAppointmentFromReminderMailPageData,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Appointment</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 30px 20px; }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #667eea;
      margin: 24px 0 10px 0;
    }
    .info-card {
      background-color: #f9f9f9;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .details-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #555;
      margin: 8px 0;
    }
    .details-item .label {
      font-weight: 600;
      color: #333;
    }
    .details-item .value { color: #444; }
    .form-group { margin-bottom: 18px; }
    .form-group label {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .input-field {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      font-size: 14px;
      color: #333;
      background: #fff;
    }
    .submit-button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 Book Appointment</h1>
    </div>
    <div class="content">
      <div class="section-title">Appointment Info</div>
      <div class="info-card">
        <div class="details-item">
          <span class="label">Vendor</span>
          <span class="value">${pageData.vendorName}</span>
        </div>
        <div class="details-item">
          <span class="label">Service</span>
          <span class="value">${pageData.recurringItemName}</span>
        </div>
      </div>
      <form action="/api/v1/appointment/book" method="POST" enctype="application/x-www-form-urlencoded">
        <input type="hidden" name="vendorId" value="${pageData.vendorId}" />
        <input type="hidden" name="recurringItemId" value="${pageData.recurringItemId}" />
        <input type="hidden" name="userId" value="${pageData.userId}" />
        <div class="form-group">
          <label for="appointmentDate">Appointment Date</label>
          <input id="appointmentDate" class="input-field" type="date" name="appointmentDate" required />
        </div>
        <div class="form-group">
          <label for="checkPoints">Checkpoints (optional)</label>
          <textarea id="checkPoints" class="input-field" name="checkPoints" rows="4" maxlength="1024"></textarea>
        </div>
        <button type="submit" class="submit-button">Book Appointment</button>
      </form>
    </div>
    <div class="footer">
      <p>© 2026 Service Reminder App. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
}

export function bookAppointmentSuccessPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Booked</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 30px 20px; }
    .message {
      background-color: #fffbea;
      border: 1px solid #ffe082;
      border-radius: 4px;
      padding: 12px 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
      line-height: 1.6;
    }
    .action-wrapper { text-align: center; margin-top: 20px; }
    .close-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 14px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Appointment Booked</h1>
    </div>
    <div class="content">
      <div class="message">
        Your appointment has been confirmed. You will receive a confirmation email shortly.
      </div>
      <div class="action-wrapper">
        <button type="button" class="close-button" onclick="window.close()">Close</button>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 Service Reminder App. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
}

export interface IBookAppointmentErrorPageData {
  message: string;
}

export function bookAppointmentErrorPage(
  pageData: IBookAppointmentErrorPageData,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Failed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 30px 20px; }
    .message {
      background-color: #fffbea;
      border: 1px solid #ffe082;
      border-radius: 4px;
      padding: 12px 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Booking Failed</h1>
    </div>
    <div class="content">
      <div class="message">${pageData.message}</div>
    </div>
    <div class="footer">
      <p>© 2026 Service Reminder App. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
}
