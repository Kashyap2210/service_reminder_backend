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
      font-family: 'DM Sans', Arial, sans-serif;
      background-color: #0d0d0d;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background-color: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { color: #6ee7b7; font-size: 1.75rem; font-weight: 600; margin: 0; }
    .content { padding: 30px 20px; }
    .section-title {
      color: #6ee7b7;
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .info-card {
      background-color: #111111;
      border-left: 4px solid #6ee7b7;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .details-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #c4c4c4;
      padding: 8px 0;
    }
    .details-item .label { font-weight: 600; color: #888888; }
    .details-item .value { color: #c4c4c4; }
    .form-group { margin-bottom: 18px; }
    .form-group label {
      display: block;
      font-size: 0.875rem;
      color: #888888;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .input-field {
      width: 100%;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 10px;
      font-size: 0.875rem;
      color: #c4c4c4;
      background: #111111;
      outline: none;
    }
    .input-field:focus { border-color: #6ee7b7; }
    .input-field::placeholder { color: #555; }
    textarea.input-field { resize: vertical; }
    .submit-button {
      width: 100%;
      background-color: #6ee7b7;
      color: #0d0d0d;
      padding: 12px;
      border-radius: 8px;
      border: none;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
    }
    .submit-button:hover { opacity: 0.9; }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #2a2a2a;
      font-size: 0.75rem;
      color: #888888;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#x1F4C5; Book Appointment</h1>
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
      <p>&copy; 2026 Service Reminder App. All rights reserved.</p>
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
      font-family: 'DM Sans', Arial, sans-serif;
      background-color: #0d0d0d;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background-color: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { color: #6ee7b7; font-size: 1.75rem; font-weight: 600; margin: 0; }
    .content { padding: 30px 20px; }
    .message {
      background-color: #111111;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      font-size: 0.875rem;
      color: #c4c4c4;
      line-height: 1.6;
    }
    .action-wrapper { text-align: center; margin-top: 20px; }
    .close-button {
      background-color: #6ee7b7;
      color: #0d0d0d;
      padding: 12px 30px;
      border-radius: 8px;
      border: none;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
    }
    .close-button:hover { opacity: 0.9; }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #2a2a2a;
      font-size: 0.75rem;
      color: #888888;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#x2705; Appointment Booked</h1>
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
      <p>&copy; 2026 Service Reminder App. All rights reserved.</p>
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
      font-family: 'DM Sans', Arial, sans-serif;
      background-color: #0d0d0d;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background-color: #1a1a1a;
      border-bottom: 1px solid #2a2a2a;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { color: #f87171; font-size: 1.75rem; font-weight: 600; margin: 0; }
    .content { padding: 30px 20px; }
    .message {
      background-color: #1a1a1a;
      border: 1px solid #f87171;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      font-size: 0.875rem;
      color: #f87171;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #2a2a2a;
      font-size: 0.75rem;
      color: #888888;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#x274C; Booking Failed</h1>
    </div>
    <div class="content">
      <div class="message">${pageData.message}</div>
    </div>
    <div class="footer">
      <p>&copy; 2026 Service Reminder App. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
}
