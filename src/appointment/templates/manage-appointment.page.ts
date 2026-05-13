// import { AppointmentType, DateCodeUtils } from 'service_reminder_common';

// export function manageAppointmentPage(data: {
//   appointmentId: number;
//   userId: number;
//   vendorId: number;
//   recurringItemId: number;
//   appointmentDate: number;
//   appointmentType: string;
//   appointmentStatus: string;
//   checkPoints: string | null;
//   vendors: Array<{ id: number; name: string }>;
// }): string {
//   const appointmentDateDisplay = new DateCodeUtils(
//     data.appointmentDate,
//   ).toLongDateString();
//   const rawDate = String(data.appointmentDate).padStart(8, '0');
//   const appointmentDateInput = `${rawDate.slice(0, 4)}-${rawDate.slice(
//     4,
//     6,
//   )}-${rawDate.slice(6, 8)}`;
//   const appointmentVendor =
//     data.vendors.find((vendor) => vendor.id === data.vendorId)?.name ||
//     'Unknown';
//   const terminalStatuses = ['CANCELLED', 'COMPLETED', 'NO_SHOW'];
//   const isTerminalStatus = terminalStatuses.includes(data.appointmentStatus);
//   const appointmentTypes = Object.values(AppointmentType).filter(
//     (value) => typeof value === 'string',
//   ) as string[];

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Manage Appointment</title>
//   <style>
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     body {
//       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//       background-color: #f5f5f5;
//       padding: 20px;
//     }
//     .container {
//       max-width: 600px;
//       margin: 0 auto;
//       background-color: #ffffff;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//       overflow: hidden;
//     }
//     .header {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//       padding: 30px 20px;
//       text-align: center;
//     }
//     .header h1 {
//       font-size: 28px;
//       margin-bottom: 5px;
//     }
//     .content {
//       padding: 30px 20px;
//     }
//     .section-title {
//       font-size: 15px;
//       font-weight: 700;
//       color: #667eea;
//       margin: 24px 0 10px 0;
//     }
//     .info-card {
//       background-color: #f9f9f9;
//       border-left: 4px solid #667eea;
//       border-radius: 4px;
//       padding: 15px;
//       margin-bottom: 20px;
//     }
//     .detail-row {
//       display: flex;
//       justify-content: space-between;
//       margin: 10px 0;
//       font-size: 14px;
//       color: #555;
//     }
//     .detail-label {
//       font-weight: 600;
//       color: #333;
//     }
//     .detail-value {
//       color: #444;
//       text-align: right;
//       max-width: 60%;
//     }
//     .button,
//     .action-button {
//       display: inline-block;
//       background-color: #667eea;
//       color: white;
//       padding: 12px 20px;
//       text-decoration: none;
//       border-radius: 4px;
//       margin: 5px 5px 0 0;
//       font-weight: 600;
//       border: none;
//       cursor: pointer;
//     }
//     .button:hover,
//     .action-button:hover {
//       background-color: #5568d3;
//     }
//     .action-button:disabled {
//       opacity: 0.6;
//       cursor: not-allowed;
//     }
//     .banner {
//       background-color: #eef2f7;
//       border: 1px solid #d8dbe6;
//       border-radius: 6px;
//       padding: 15px;
//       margin-bottom: 20px;
//       color: #333;
//       font-size: 14px;
//       line-height: 1.6;
//     }
//     .form-group {
//       margin-bottom: 18px;
//     }
//     .form-group label {
//       display: block;
//       font-size: 14px;
//       color: #333;
//       margin-bottom: 8px;
//       font-weight: 600;
//     }
//     .input-field,
//     .select-field,
//     textarea {
//       width: 100%;
//       border: 1px solid #ddd;
//       border-radius: 4px;
//       padding: 10px;
//       font-size: 14px;
//       color: #333;
//       background: #fff;
//     }
//     textarea {
//       resize: vertical;
//     }
//     .hidden {
//       display: none;
//     }
//     .message {
//       border-radius: 6px;
//       padding: 14px 16px;
//       margin-bottom: 20px;
//       font-size: 14px;
//     }
//     .success {
//       background-color: #e6f4ea;
//       border: 1px solid #a3d9a5;
//       color: #22543d;
//     }
//     .error {
//       background-color: #fff1f0;
//       border: 1px solid #f5c2c7;
//       color: #842029;
//     }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h1>Manage Appointment</h1>
//     </div>
//     <div class="content">
//       ${isTerminalStatus ? `<div class="banner">This appointment is ${data.appointmentStatus} and cannot be modified.</div>` : ''}
//       <div class="section-title">Appointment Details</div>
//       <div class="info-card">
//         <div class="detail-row">
//           <span class="detail-label">Date</span>
//           <span class="detail-value">${appointmentDateDisplay}</span>
//         </div>
//         <div class="detail-row">
//           <span class="detail-label">Type</span>
//           <span class="detail-value">${data.appointmentType}</span>
//         </div>
//         <div class="detail-row">
//           <span class="detail-label">Status</span>
//           <span class="detail-value">${data.appointmentStatus}</span>
//         </div>
//         <div class="detail-row">
//           <span class="detail-label">Vendor</span>
//           <span class="detail-value">${appointmentVendor}</span>
//         </div>
//         <div class="detail-row">
//           <span class="detail-label">Checkpoints</span>
//           <span class="detail-value">${data.checkPoints ? data.checkPoints : 'None'}</span>
//         </div>
//       </div>

//       <div id="messageContainer"></div>

//       ${isTerminalStatus ? '' : `
//       <div id="action-buttons">
//         <button type="button" class="action-button" id="editButton">Edit</button>
//         <button type="button" class="action-button" id="cancelButton">Cancel</button>
//         <button type="button" class="action-button" id="completeButton">Mark Complete</button>
//         <button type="button" class="action-button" id="startServiceButton">Start Service</button>
//       </div>

//       <div id="editForm" class="hidden">
//         <div class="section-title">Edit Appointment</div>
//         <div class="form-group">
//           <label for="vendorSelect">Vendor</label>
//           <select id="vendorSelect" class="select-field">
//             ${data.vendors
//               .map(
//                 (vendor) =>
//                   `<option value="${vendor.id}" ${vendor.id === data.vendorId ? 'selected' : ''}>${vendor.name}</option>`,
//               )
//               .join('')}
//           </select>
//         </div>
//         <div class="form-group">
//           <label for="appointmentTypeSelect">Appointment Type</label>
//           <select id="appointmentTypeSelect" class="select-field">
//             ${appointmentTypes
//               .map(
//                 (type) =>
//                   `<option value="${type}" ${type === data.appointmentType ? 'selected' : ''}>${type}</option>`,
//               )
//               .join('')}
//           </select>
//         </div>
//         <div class="form-group">
//           <label for="checkPointsInput">Checkpoints</label>
//           <textarea id="checkPointsInput" class="input-field" rows="4">${
//             data.checkPoints ? data.checkPoints : ''
//           }</textarea>
//         </div>
//         <div class="form-group">
//           <label for="appointmentDateInput">Appointment Date</label>
//           <input id="appointmentDateInput" class="input-field" type="date" value="${appointmentDateInput}" />
//         </div>
//         <button type="button" class="action-button" id="saveButton">Save Changes</button>
//       </div>
//       `}
//     </div>
//   </div>

//   <script>
//     const appointmentId = ${data.appointmentId};
//     const originalAppointmentDate = ${data.appointmentDate};
//     const isTerminal = ${isTerminalStatus};

//     function createBanner(message, type) {
//       const banner = document.createElement('div');
//       banner.className = 'message ' + type;
//       banner.textContent = message;
//       return banner;
//     }

//     function showMessage(message, type) {
//       const container = document.getElementById('messageContainer');
//       container.innerHTML = '';
//       container.appendChild(createBanner(message, type));
//     }

//     function disableActions() {
//       document.querySelectorAll('.action-button').forEach((button) => {
//         button.disabled = true;
//       });
//     }

//     async function patchAppointment(body) {
//       try {
//         const response = await fetch(`/appointment/${appointmentId}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(body),
//         });
//         if (!response.ok) {
//           const payload = await response.json().catch(() => null);
//           const message = payload?.message || 'Unable to update appointment.';
//           throw new Error(message);
//         }
//         showMessage('Appointment updated successfully.', 'success');
//         disableActions();
//       } catch (error) {
//         showMessage(error.message || 'Unable to update appointment.', 'error');
//       }
//     }

//     if (!isTerminal) {
//       document.getElementById('editButton').addEventListener('click', () => {
//         const editForm = document.getElementById('editForm');
//         editForm.classList.toggle('hidden');
//       });

//       document.getElementById('cancelButton').addEventListener('click', async () => {
//         await patchAppointment({ action: 'CANCEL' });
//       });

//       document.getElementById('completeButton').addEventListener('click', async () => {
//         await patchAppointment({ action: 'COMPLETE' });
//       });

//       document.getElementById('startServiceButton').addEventListener('click', () => {
//         const url = `/appointment/book-page?vendorId=${data.vendorId}&recurringItemId=${data.recurringItemId}&userId=${data.userId}&appointmentDate=${data.appointmentDate}`;
//         window.open(url, '_blank');
//       });

//       document.getElementById('saveButton').addEventListener('click', async () => {
//         const vendorId = Number(document.getElementById('vendorSelect').value);
//         const appointmentType = document.getElementById('appointmentTypeSelect').value;
//         const checkPoints = document.getElementById('checkPointsInput').value || null;
//         const appointmentDateValue = document.getElementById('appointmentDateInput').value.replace(/-/g, '');
//         const appointmentDate = Number(appointmentDateValue);
//         const action = appointmentDate !== originalAppointmentDate ? 'RE_SCHEDULE' : 'EDIT';

//         await patchAppointment({
//           action,
//           vendorId,
//           appointmentType,
//           checkPoints,
//           appointmentDate,
//         });
//       });
//     }
//   </script>
// </body>
// </html>`;
// }
