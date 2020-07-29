System.register(["./BoomUtils", "./BoomTimeBasedThreshold", "./BoomPattern", "./BoomSeries", "./BoomRender", "./BoomPatternData"], function (exports_1, context_1) {
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
                    "getItemBasedOnThreshold": BoomUtils_1_1["getItemBasedOnThreshold"],
                    "boomSortFunc": BoomUtils_1_1["boomSortFunc"]
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
            function (BoomRender_1_1) {
                exports_1({
                    "BoomRender": BoomRender_1_1["BoomRender"]
                });
            },
            function (BoomPatternData_1_1) {
                exports_1({
                    "BoomPatternData": BoomPatternData_1_1["BoomPatternData"]
                });
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2Jvb20vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7IElCb29tUGF0dGVybiwgSUJvb21QYXR0ZXJuRGF0YSwgSUJvb21TZXJpZXMsIElCb29tVGltZUJhc2VkVGhyZXNob2xkLCBJQm9vbUZpbHRlcmVkVGhyZXNob2xkLCBJQm9vbVJlbmRlcmluZ09wdGlvbnMsIElCb29tVGFibGUsIElCb29tSFRNTCwgSUJvb21DZWxsRGV0YWlscywgSUJvb21UYWJsZVRyYW5zZm9ybWF0aW9uT3B0aW9ucywgSUJvb21UYWJsZVN0eWxlcyB9IGZyb20gXCIuL0Jvb20uaW50ZXJmYWNlXCI7XG5leHBvcnQgeyBJQm9vbUpvaW4sIElCb29tSm9pblNlcmllcyB9IGZyb20gXCIuL0Jvb20uaW50ZXJmYWNlXCI7XG5leHBvcnQgeyBub3JtYWxpemVDb2xvciwgcmVwbGFjZVRva2VucywgZ2V0QWN0dWFsTmFtZVdpdGhvdXRUb2tlbnMsIGdldERlY2ltYWxzRm9yVmFsdWUsIGdldEl0ZW1CYXNlZE9uVGhyZXNob2xkLCBib29tU29ydEZ1bmMgfSBmcm9tIFwiLi9Cb29tVXRpbHNcIjtcbmV4cG9ydCB7IEJvb21UaW1lQmFzZWRUaHJlc2hvbGQsIEJvb21GaWx0ZXJlZFRocmVzaG9sZCB9IGZyb20gXCIuL0Jvb21UaW1lQmFzZWRUaHJlc2hvbGRcIjtcbmV4cG9ydCB7IEJvb21QYXR0ZXJuIH0gZnJvbSBcIi4vQm9vbVBhdHRlcm5cIjtcbmV4cG9ydCB7IEJvb21TZXJpZXMgfSBmcm9tIFwiLi9Cb29tU2VyaWVzXCI7XG5leHBvcnQgeyBCb29tUmVuZGVyIH0gZnJvbSBcIi4vQm9vbVJlbmRlclwiO1xuZXhwb3J0IHsgQm9vbVBhdHRlcm5EYXRhIH0gZnJvbSBcIi4vQm9vbVBhdHRlcm5EYXRhXCI7XG4iXX0=