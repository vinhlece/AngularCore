const fs = require('fs');
const uuid = require('uuid/v4');
const db = require('../backend/db-sample');

function updateWidgetId(db) {
  const widgets = db.widgets;
  const tabs = db.tabs;
  widgets.forEach((widget) => {
    const newId = uuid();
    const oldId = widget.id;
    widget.id = newId;
    tabs.forEach((tab) => {
      tab.placeholders.forEach((placeholder) => {
        if (placeholder.widgetId === oldId) {
          placeholder.widgetId = newId;
        }
      });
    });
  });
}

function updateTabId(db) {
  const tabs = db.tabs;
  tabs.forEach((tab) => {
    tab.id = uuid();
  });
}

function updateDashboardId(db) {
  const dashboards = db.dashboards;
  const tabs = db.tabs;
  dashboards.forEach((dashboard) => {
    const newId = uuid();
    const oldId = dashboard.id;
    dashboard.id = newId;
    tabs.forEach((tab) => {
      if (tab.dashboardId === oldId) {
        tab.dashboardId = newId;
      }
    });
  });
}

function updatePlaceholders(db) {
  const tabs = db.tabs;
  tabs.forEach((tab) => {
    const placeholders = tab.placeholders;
    placeholders.forEach((placeholder) => {
      placeholder.tabId = tab.id;
    });
  });
}

function updateId() {
  updateWidgetId(db);
  updateTabId(db);
  updateDashboardId(db);
}

function writeDb(db) {
  fs.writeFile('../backend/db-sample.json', JSON.stringify(db, null, 2));
}

function updateDbSample() {
  updateId(db);
  writeDb(db)
}

// updateDbSample();
