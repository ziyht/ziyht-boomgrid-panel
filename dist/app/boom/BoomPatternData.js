System.register([], function (exports_1, context_1) {
    "use strict";
    var BoomPatternData;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            BoomPatternData = (function () {
                function BoomPatternData(pattern) {
                    this.series = [];
                    this.pattern = pattern;
                }
                BoomPatternData.prototype.addSeries = function (series) {
                    this.series.push(series);
                };
                return BoomPatternData;
            }());
            exports_1("BoomPatternData", BoomPatternData);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVBhdHRlcm5EYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9ib29tL0Jvb21QYXR0ZXJuRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O1lBS0E7Z0JBR0kseUJBQVksT0FBb0I7b0JBRnpCLFdBQU0sR0FBaUIsRUFBRSxDQUFDO29CQUc3QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztnQkFDM0IsQ0FBQztnQkFFTSxtQ0FBUyxHQUFoQixVQUFpQixNQUFrQjtvQkFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ0wsc0JBQUM7WUFBRCxDQUFDLEFBVkQsSUFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IElCb29tUGF0dGVybkRhdGEgfSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHsgQm9vbVNlcmllcyB9IGZyb20gXCIuL0Jvb21TZXJpZXNcIjtcbmltcG9ydCB7IEJvb21QYXR0ZXJuIH0gZnJvbSBcIi4vQm9vbVBhdHRlcm5cIjtcblxuY2xhc3MgQm9vbVBhdHRlcm5EYXRhIGltcGxlbWVudHMgSUJvb21QYXR0ZXJuRGF0YSB7XG4gICAgcHVibGljIHNlcmllczogQm9vbVNlcmllc1tdID0gW107XG4gICAgcHVibGljIHBhdHRlcm46IEJvb21QYXR0ZXJuO1xuICAgIGNvbnN0cnVjdG9yKHBhdHRlcm46IEJvb21QYXR0ZXJuKSB7XG4gICAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFNlcmllcyhzZXJpZXM6IEJvb21TZXJpZXMpIHtcbiAgICAgICAgdGhpcy5zZXJpZXMucHVzaChzZXJpZXMpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBCb29tUGF0dGVybkRhdGEsXG59O1xuIl19