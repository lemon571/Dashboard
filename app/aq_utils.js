define(
    {
        byteSize: function(str) {
            return (new TextEncoder().encode(str)).length;
        },

        isValidIPv4: function(address) {
            rx = new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/);
            return rx.test(address);
        },

        isValidIPv6: function(address) {
            rx = new RegExp(/^((([0-9a-f]{1,4}:){1,6}:)|(([0-9a-f]{1,4}:){7}))([0-9a-f]{1,4})$/, "i");
            return rx.test(address);
        },

        isValidDomain: function (address) {
            rx = new RegExp(/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)*([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.?)$/, "i");
            return rx.test(address);
        },

        isValidServerAddress: function(address) {
            return this.isValidIPv4(address) || this.isValidIPv6(address) || this.isValidDomain(address);
        },

        isValidDNComponent: function(name) {
            if (name.startsWith(' ') || name.endsWith(' ') || this.byteSize(name) > 64)
                return false;

            const forbiddenSymbols = ",\\#+<>;\"=*()";
            for (var i = 0; i < name.length; ++i)
            {
                if (forbiddenSymbols.includes(name.charAt(i)))
                    return false;
            }

            return true;
        },

        GetSeverityLevel: function(severity)
        {
          const SEVERITY_LEVEL = {
            "emerg" :   0,
            "alert" :   0,
            "crit" :    0,
            "critical": 0,
            "err" :     0,
            "error" :   0,
            "warning" : 1,
            "warn" :    1,
            "notice" :  2,
            "info" :    2,
            "debug" :   2,
            "ok":       2
          };

          if(severity == undefined || severity == "")
            return SEVERITY_LEVEL["critical"];

          return (severity.toLowerCase() in SEVERITY_LEVEL)
            ? SEVERITY_LEVEL[severity.toLowerCase()]
            : SEVERITY_LEVEL["critical"];
        }
    }
);
