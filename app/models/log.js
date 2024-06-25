define([
  "jquery",
  "underscore",
  "backbone",
  "aq_utils",
  "i18n!:common",
], function ($, _, Backbone, aq_utils, CommonStrings) {
  var model = Backbone.Model.extend({
    initialize: function () {
      this.localeDate = new Date();
      this.localeTimeZoneMinutes = this.localeDate.getTimezoneOffset();
    },

    description: function () {
      if (
        typeof this.get("event_description") !== "undefined" &&
        this.get("event_description") !== null
      ) {
        return this.get("event_description").split("_").join(" ");
      } else {
        return "";
      }
    },

    monthStrings: [
      CommonStrings.t("common:jan"),
      CommonStrings.t("common:feb"),
      CommonStrings.t("common:mar"),
      CommonStrings.t("common:apr"),
      CommonStrings.t("common:may"),
      CommonStrings.t("common:jun"),
      CommonStrings.t("common:jul"),
      CommonStrings.t("common:aug"),
      CommonStrings.t("common:sep"),
      CommonStrings.t("common:oct"),
      CommonStrings.t("common:nov"),
      CommonStrings.t("common:dec"),
    ],

    day: [
      CommonStrings.t("common:sun"),
      CommonStrings.t("common:mon"),
      CommonStrings.t("common:tue"),
      CommonStrings.t("common:wed"),
      CommonStrings.t("common:thu"),
      CommonStrings.t("common:fri"),
      CommonStrings.t("common:sat"),
    ],

    getMonth: function (utc) {
      if (utc) {
        return this.getUtcMonth(utc);
      } else {
        //				log("month :", new Date(this.get('timestamp') * 1000).getMonth(),  new Date(this.get('timestamp') * 1000).getUTCMonth());
        return new Date(this.get("timestamp") * 1000).getMonth();
      }
    },

    getYear: function (utc) {
      if (utc) {
        return this.getUtcYear(utc);
      } else {
        //				log("year : ", new Date(this.get('timestamp') * 1000).getFullYear());
        return new Date(this.get("timestamp") * 1000).getFullYear();
      }
    },

    getUtcYear: function (utc) {
      return new Date(
        (utc - this.localeTimeZoneMinutes * 60) * 1000
      ).getUTCFullYear();
    },

    getUtcMonth: function (utc) {
      //			log("getUtcMonth: ", utc);
      return new Date(
        (utc - this.localeTimeZoneMinutes * 60) * 1000
      ).getUTCMonth();
    },

    getUtcDate: function (utc) {
      return new Date(
        (utc - this.localeTimeZoneMinutes * 60) * 1000
      ).getUTCDate();
    },

    getUtcDay: function (utc) {
      var view = this;
      //			log("getUtcDay: ",utc, (this.localeTimeZoneMinutes*60), new Date((utc-(view.localeTimeZoneMinutes*60)) * 1000).getUTCDay(), this.day[new Date((utc-(view.localeTimeZoneMinutes*60)) * 1000).getUTCDay()]);
      return this.day[
        new Date((utc - this.localeTimeZoneMinutes * 60) * 1000).getUTCDay()
      ];
    },

    getUtcHour: function (utc) {
      return new Date(
        (utc - this.localeTimeZoneMinutes * 60) * 1000
      ).getUTCHours();
    },

    getUtcMinutes: function (utc) {
      return new Date(
        (utc - this.localeTimeZoneMinutes * 60) * 1000
      ).getUTCMinutes();
    },

    Severity: function () {
      return this.get("severity") || "critical";
    },

    SeverityLevel: function () {
      return aq_utils.GetSeverityLevel(this.get("severity"));
    },

    TestSeverity: function (severity) {
      return aq_utils.GetSeverityLevel(severity) == this.SeverityLevel();
    },
  });

  return model;
});
