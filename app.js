// ===== הגדרות =====
// הדביקו כאן את כתובת ה-Web App של Google Apps Script. ריק = רק console.log
var ENDPOINT_URL = "";
// ==================

var C = window.CONTENT;
var U = new URLSearchParams(location.search).get("u") || "anonymous";
var currentDoor = null;

function track(event, details) {
  var payload = { u: U, event: event, details: details || {}, timestamp: new Date().toISOString() };
  if (!ENDPOINT_URL) { console.log("[event]", payload); return; }
  try {
    fetch(ENDPOINT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload), keepalive: true
    }).catch(function (e) { console.warn(e); });
  } catch (e) { console.warn(e); }
}

function isFirstChoice() {
  try {
    if (sessionStorage.getItem("chosen")) return false;
    sessionStorage.setItem("chosen", "1");
  } catch (e) { if (window._chosen) return false; window._chosen = true; }
  return true;
}

function el(tag, attrs, children) {
  var n = document.createElement(tag);
  Object.keys(attrs || {}).forEach(function (k) {
    if (k === "text") n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]);
  });
  (children || []).forEach(function (c) { n.appendChild(c); });
  return n;
}
function btn(text, cls, onclick) {
  var b = el("button", { type: "button", class: cls, text: text });
  b.addEventListener("click", onclick);
  return b;
}
function backBtn(from) {
  return btn(C.back, "btn ghost", function () { track("back_clicked", { from: from }); show("landing"); });
}

var app = document.getElementById("app");
var screens = {};

function buildLanding() {
  var L = C.landing, s = el("section", { class: "screen" });
  s.appendChild(el("h1", { text: L.title }));
  s.appendChild(el("div", { class: "card" }, [
    el("div", { class: "label", text: L.didYouKnow.label }),
    el("div", { class: "placeholder", text: L.didYouKnow.imageText }),
    el("p", { text: L.didYouKnow.text })
  ]));
  L.choices.forEach(function (c) {
    var b = el("button", { type: "button", class: "choice" }, [el("b", { text: c.title }), el("span", { text: c.teaser })]);
    b.addEventListener("click", function () {
      track("choice_clicked", { choice: c.id, is_first_choice: isFirstChoice() });
      if (c.id === "history") show("history");
      else { currentDoor = c.id; show("door"); }
    });
    s.appendChild(b);
  });
  return s;
}

function buildHistory() {
  var H = C.history, s = el("section", { class: "screen" });
  s.appendChild(el("h2", { text: H.title }));
  s.appendChild(el("div", { class: "placeholder", text: H.imageText }));
  s.appendChild(el("p", { class: "draft", text: H.draftMark }));
  H.paragraphs.forEach(function (p) { s.appendChild(el("p", { text: p })); });
  s.appendChild(el("p", { class: "punch", text: H.punchline }));

  var more = el("div", { hidden: "" });
  var contact = el("input", { type: "text", placeholder: H.contactPlaceholder });
  var moreThanks = el("p", { class: "thanks", text: H.wantMoreThanks });
  more.appendChild(moreThanks);
  more.appendChild(contact);
  more.appendChild(btn(H.contactSend, "btn", function () {
    track("fake_door_submitted", { door: "more_streets", for_whom: null, contact: contact.value.trim() });
    contact.value = ""; moreThanks.textContent = C.fakeDoor.thanks;
  }));
  var moreBtn = btn(H.wantMoreButton, "btn", function () {
    track("want_more_clicked", {});
    more.hidden = false; moreBtn.hidden = true;
  });
  s.appendChild(moreBtn);
  s.appendChild(more);

  s.appendChild(el("label", { text: H.questionLabel }));
  var q = el("textarea", { placeholder: H.questionPlaceholder });
  var qThanks = el("p", { class: "thanks", hidden: "", text: H.questionThanks });
  s.appendChild(q);
  s.appendChild(btn(H.questionSend, "btn", function () {
    if (!q.value.trim()) return;
    track("open_question_submitted", { text: q.value.trim() });
    q.value = ""; qThanks.hidden = false;
  }));
  s.appendChild(qThanks);
  s.appendChild(backBtn("history"));
  return s;
}

function buildDoor() {
  var D = C.fakeDoor, s = el("section", { class: "screen" });
  s.appendChild(el("h2", { text: D.heading }));
  s.appendChild(el("p", { text: D.sub }));
  var aud = el("div", { class: "opts" });
  D.audienceOptions.forEach(function (o) {
    aud.appendChild(el("label", {}, [el("input", { type: "radio", name: "aud", value: o }), document.createTextNode(o)]));
  });
  s.appendChild(el("div", { id: "audWrap" }, [el("p", { text: D.audienceLabel }), aud]));
  var contact = el("input", { type: "text", placeholder: D.contactPlaceholder });
  var thanks = el("p", { class: "thanks", hidden: "", text: D.thanks });
  s.appendChild(contact);
  s.appendChild(btn(D.send, "btn", function () {
    var sel = s.querySelector("input[name=aud]:checked");
    track("fake_door_submitted", {
      door: currentDoor,
      for_whom: currentDoor === "kids" && sel ? sel.value : null,
      contact: contact.value.trim()
    });
    contact.value = ""; thanks.hidden = false;
  }));
  s.appendChild(thanks);
  s.appendChild(backBtn("door"));
  s._enter = function () {
    s.querySelector("#audWrap").hidden = currentDoor !== "kids";
    thanks.hidden = true;
    var c = s.querySelector("input[name=aud]:checked"); if (c) c.checked = false;
  };
  return s;
}

function show(name) {
  Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
  if (screens[name]._enter) screens[name]._enter();
  window.scrollTo(0, 0);
  track("page_view", { screen: name === "door" ? "door_" + currentDoor : name });
}

screens.landing = buildLanding();
screens.history = buildHistory();
screens.door = buildDoor();
Object.keys(screens).forEach(function (k) { app.appendChild(screens[k]); });
show("landing");
