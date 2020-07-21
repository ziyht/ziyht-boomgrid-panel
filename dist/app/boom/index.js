System.register(["./BoomUtils", "./BoomTimeBasedThreshold", "./BoomPattern", "./BoomSeries", "./BoomOutput"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (BoomUtils_1_1) {
                exports_1({
                    "normalizeColor": BoomUtils_1_1["normalizeColor"],
                    "replaceTokens": BoomUtils_1_1["replaceTokens"],
                    "getActualNameWithoutTokens": BoomUtils_1_1["getActualNameWithoutTokens"],
                    "getDecimalsForValue": BoomUtils_1_1["getDecimalsForValue"],
                    "getItemBasedOnThreshold": BoomUtils_1_1["getItemBasedOnThreshold"]
                });
            },
            function (BoomTimeBasedThreshold_1_1) {
                exports_1({
                    "BoomTimeBasedThreshold": BoomTimeBasedThreshold_1_1["BoomTimeBasedThreshold"],
                    "BoomFilteredThreshold": BoomTimeBasedThreshold_1_1["BoomFilteredThreshold"]
                });
            },
            function (BoomPattern_1_1) {
                exports_1({
                    "BoomPattern": BoomPattern_1_1["BoomPattern"]
                });
            },
            function (BoomSeries_1_1) {
                exports_1({
                    "BoomSeries": BoomSeries_1_1["BoomSeries"]
                });
            },
            function (BoomOutput_1_1) {
                exports_1({
                    "BoomOutput": BoomOutput_1_1["BoomOutput"]
                });
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2Jvb20vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7IElCb29tUGF0dGVybiwgSUJvb21QYXR0ZXJuRGF0YSwgSUJvb21TZXJpZXMsIElCb29tVGltZUJhc2VkVGhyZXNob2xkLCBJQm9vbUZpbHRlcmVkVGhyZXNob2xkLCBJQm9vbVJlbmRlcmluZ09wdGlvbnMsIElCb29tVGFibGUsIElCb29tSFRNTCwgSUJvb21DZWxsRGV0YWlscywgSUJvb21UYWJsZVRyYW5zZm9ybWF0aW9uT3B0aW9ucyB9IGZyb20gXCIuL0Jvb20uaW50ZXJmYWNlXCI7XG5leHBvcnQgeyBub3JtYWxpemVDb2xvciwgcmVwbGFjZVRva2VucywgZ2V0QWN0dWFsTmFtZVdpdGhvdXRUb2tlbnMsIGdldERlY2ltYWxzRm9yVmFsdWUsIGdldEl0ZW1CYXNlZE9uVGhyZXNob2xkIH0gZnJvbSBcIi4vQm9vbVV0aWxzXCI7XG5leHBvcnQgeyBCb29tVGltZUJhc2VkVGhyZXNob2xkLCBCb29tRmlsdGVyZWRUaHJlc2hvbGQgfSBmcm9tIFwiLi9Cb29tVGltZUJhc2VkVGhyZXNob2xkXCI7XG5leHBvcnQgeyBCb29tUGF0dGVybiB9IGZyb20gXCIuL0Jvb21QYXR0ZXJuXCI7XG5leHBvcnQgeyBCb29tU2VyaWVzIH0gZnJvbSBcIi4vQm9vbVNlcmllc1wiO1xuZXhwb3J0IHsgQm9vbU91dHB1dCB9IGZyb20gXCIuL0Jvb21PdXRwdXRcIjtcbiJdfQ==