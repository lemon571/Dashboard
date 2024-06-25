define(["jquery", "underscore", "backbone", "models//brcm_pcie_switch_info"],

function($, _, Backbone, BRCMPCIeSwitchInfoModel) {

    var collection = Backbone.Collection.extend({

        url: function() {
            return "/api/settings/brcm_pcie_switch_management/brcm_pcie_switch_info"
        },

        model: BRCMPCIeSwitchInfoModel

    });

    return new collection();

});
