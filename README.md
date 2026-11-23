# רוטשילד – MVP לניסוי 48 שעות

אתר סטטי (HTML/CSS/JS). כל הטקסטים ב-`content.js`. עובדות מסומנות [לבדוק].

## בדיקה מקומית
```bash
cd rothschild-mvp && python3 -m http.server 8000
```
פתחו `http://localhost:8000/?u=dana`. כל עוד `ENDPOINT_URL` ב-`app.js` ריק, האירועים מודפסים ל-console (F12).

## חיבור ל-Google Sheet
1. צרו Google Sheet חדש.
2. תפריט **תוספים ← Apps Script** (Extensions ← Apps Script).
3. מחקו את הקוד והדביקו את התוכן של `apps-script.gs`. שמרו.
4. **Deploy ← New deployment** ← סוג **Web app**.
5. Execute as: **Me**. Who has access: **Anyone**. לחצו Deploy ואשרו הרשאות.
6. העתיקו את כתובת ה-Web app (נגמרת ב-`/exec`) והדביקו ב-`ENDPOINT_URL` בראש `app.js`.
7. אחרי שינוי בקוד ה-Script צריך Deploy ← Manage deployments ← New version.

עמודות בגיליון: timestamp, u, event, details (JSON).

## פריסה
**GitHub Pages:** העלו את הקבצים ל-repo ← Settings ← Pages ← Branch: main, root. הכתובת: `https://USER.github.io/REPO/`.

**Netlify:** היכנסו ל-app.netlify.com/drop וגררו את התיקייה. מקבלים כתובת מיד.

## 10 קישורים אישיים
הוסיפו `?u=שם` לכתובת, שם שונה לכל אדם (אותיות לועזיות, בלי רווחים):
```
https://YOUR-SITE/?u=dana
https://YOUR-SITE/?u=yossi
https://YOUR-SITE/?u=noa
...
```
בלי `u` נרשם `anonymous`.

## אירועים
`page_view`, `choice_clicked` (choice, is_first_choice), `want_more_clicked`, `open_question_submitted`, `fake_door_submitted` (door: kids/food/more_streets, for_whom, contact), `back_clicked`.
