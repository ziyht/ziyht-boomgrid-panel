System.register([], function (exports_1, context_1) {
    "use strict";
    var BoomTimeBasedThreshold, BoomFilteredThreshold;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            BoomTimeBasedThreshold = (function () {
                function BoomTimeBasedThreshold() {
                    this.enabledDays = "Sun,Mon,Tue,Wed,Thu,Fri,Sat";
                    this.from = "0000";
                    this.name = "Early morning of everyday";
                    this.threshold = "70,90";
                    this.to = "0530";
                }
                return BoomTimeBasedThreshold;
            }());
            exports_1("BoomTimeBasedThreshold", BoomTimeBasedThreshold);
            BoomFilteredThreshold = (function () {
                function BoomFilteredThreshold() {
                    this.match = ".*";
                    this.threshold = "70,90";
                }
                return BoomFilteredThreshold;
            }());
            exports_1("BoomFilteredThreshold", BoomFilteredThreshold);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVRpbWVCYXNlZFRocmVzaG9sZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvYm9vbS9Cb29tVGltZUJhc2VkVGhyZXNob2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFFQTtnQkFNSTtvQkFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLDZCQUE2QixDQUFDO29CQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDbkIsSUFBSSxDQUFDLElBQUksR0FBRywyQkFBMkIsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUNMLDZCQUFDO1lBQUQsQ0FBQyxBQWJELElBYUM7O1lBRUQ7Z0JBR0k7b0JBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO2dCQUM3QixDQUFDO2dCQUNMLDRCQUFDO1lBQUQsQ0FBQyxBQVBELElBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQm9vbVRpbWVCYXNlZFRocmVzaG9sZCwgSUJvb21GaWx0ZXJlZFRocmVzaG9sZCB9IGZyb20gXCIuL2luZGV4XCI7XG5cbmNsYXNzIEJvb21UaW1lQmFzZWRUaHJlc2hvbGQgaW1wbGVtZW50cyBJQm9vbVRpbWVCYXNlZFRocmVzaG9sZCB7XG4gICAgcHVibGljIGVuYWJsZWREYXlzOiBzdHJpbmc7XG4gICAgcHVibGljIGZyb206IHN0cmluZztcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB0aHJlc2hvbGQ6IHN0cmluZztcbiAgICBwdWJsaWMgdG86IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkRGF5cyA9IFwiU3VuLE1vbixUdWUsV2VkLFRodSxGcmksU2F0XCI7XG4gICAgICAgIHRoaXMuZnJvbSA9IFwiMDAwMFwiO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkVhcmx5IG1vcm5pbmcgb2YgZXZlcnlkYXlcIjtcbiAgICAgICAgdGhpcy50aHJlc2hvbGQgPSBcIjcwLDkwXCI7XG4gICAgICAgIHRoaXMudG8gPSBcIjA1MzBcIjtcbiAgICB9XG59XG5cbmNsYXNzIEJvb21GaWx0ZXJlZFRocmVzaG9sZCBpbXBsZW1lbnRzIElCb29tRmlsdGVyZWRUaHJlc2hvbGQge1xuICAgIHB1YmxpYyBtYXRjaDogc3RyaW5nO1xuICAgIHB1YmxpYyB0aHJlc2hvbGQ6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5tYXRjaCA9IFwiLipcIjtcbiAgICAgICAgdGhpcy50aHJlc2hvbGQgPSBcIjcwLDkwXCI7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIEJvb21UaW1lQmFzZWRUaHJlc2hvbGQsXG4gICAgQm9vbUZpbHRlcmVkVGhyZXNob2xkXG59O1xuIl19