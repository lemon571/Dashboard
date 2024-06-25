define(["jquery", "underscore", "backbone","collection/audit-log"],
    function ($, _, Backbone, AuditLogCollection) {

        var model = Backbone.Model.extend({
            url: "/api/logs/audit",
            parse: function(response, options)
            {
                this.set("entries", new AuditLogCollection(response.entries))
                this.set("audit_count", response.audit_count);
            }
        });
        

        return model;

    });