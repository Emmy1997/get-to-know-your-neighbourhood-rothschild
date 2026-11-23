// מקבל אירועים ב-POST וכותב כל אירוע כשורה בגיליון.
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp", "u", "event", "details"]);
  }
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) { d = { event: "parse_error", details: e.postData.contents }; }
  sheet.appendRow([d.timestamp || new Date().toISOString(), d.u || "", d.event || "", JSON.stringify(d.details || {})]);
  return ContentService.createTextOutput("ok");
}
