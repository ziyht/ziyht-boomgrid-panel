System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, BoomPatternData, BoomPatternDatas;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
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
            BoomPatternDatas = (function () {
                function BoomPatternDatas() {
                    this.patterns = {};
                }
                BoomPatternDatas.prototype.registerPatterns = function (default_, customs) {
                    var _this = this;
                    this.patterns = {};
                    default_.id = -1;
                    this.registerPattern(default_);
                    var id = 0;
                    lodash_1.default.each(customs, function (pt) {
                        pt.id = id;
                        _this.registerPattern(pt);
                        id += 1;
                    });
                };
                BoomPatternDatas.prototype.registerPattern = function (pattern) {
                    var data = this.patterns[pattern.id];
                    if (data === undefined) {
                        data = new BoomPatternData(pattern);
                        this.patterns[pattern.id] = data;
                    }
                    return data;
                };
                BoomPatternDatas.prototype.getPattern = function (idx) {
                    return this.patterns[idx].pattern;
                };
                BoomPatternDatas.prototype.getFixedRows = function () {
                    var ret = [];
                    lodash_1.default.each(this.patterns, function (data) {
                        lodash_1.default.each(data.pattern.fixed_rows, function (row) {
                            if (row.name !== "") {
                                ret.push(row.name);
                            }
                        });
                    });
                    ret = lodash_1.default.uniq(ret, function (item) { return item; });
                    return ret;
                };
                BoomPatternDatas.prototype.getFixedCols = function () {
                    var ret = [];
                    lodash_1.default.each(this.patterns, function (data) {
                        var pattern = data.pattern;
                        if (pattern.col_name_as_fixed_row === true) {
                            if (pattern.col_name !== "") {
                                ret.push(pattern.col_name);
                            }
                        }
                        lodash_1.default.each(pattern.fixed_cols, function (col) {
                            if (col.name !== "") {
                                ret.push(col.name);
                            }
                        });
                    });
                    ret = lodash_1.default.uniq(ret, function (item) { return item; });
                    return ret;
                };
                return BoomPatternDatas;
            }());
            exports_1("BoomPatternDatas", BoomPatternDatas);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVBhdHRlcm5EYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9ib29tL0Jvb21QYXR0ZXJuRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztZQU1BO2dCQUdJLHlCQUFZLE9BQW9CO29CQUZ6QixXQUFNLEdBQWlCLEVBQUUsQ0FBQztvQkFHN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQzNCLENBQUM7Z0JBRU0sbUNBQVMsR0FBaEIsVUFBaUIsTUFBa0I7b0JBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QixDQUFDO2dCQUNMLHNCQUFDO1lBQUQsQ0FBQyxBQVZELElBVUM7O1lBRUQ7Z0JBQUE7b0JBQ1csYUFBUSxHQUFxQyxFQUFFLENBQUM7Z0JBc0QzRCxDQUFDO2dCQXJEVSwyQ0FBZ0IsR0FBdkIsVUFBd0IsUUFBcUIsRUFBRSxPQUFzQjtvQkFBckUsaUJBVUM7b0JBVEcsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7b0JBQ25CLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQy9CLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDWCxnQkFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxFQUFlO3dCQUM5QixFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzt3QkFDWCxLQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUN6QixFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNWLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBQ00sMENBQWUsR0FBdEIsVUFBdUIsT0FBb0I7b0JBQ3ZDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNyQyxJQUFLLElBQUksS0FBSyxTQUFTLEVBQUU7d0JBQ3JCLElBQUksR0FBRyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO3FCQUNwQztvQkFDRCxPQUFPLElBQUksQ0FBQztnQkFDaEIsQ0FBQztnQkFDTSxxQ0FBVSxHQUFqQixVQUFrQixHQUFXO29CQUN6QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN0QyxDQUFDO2dCQUNNLHVDQUFZLEdBQW5CO29CQUNJLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztvQkFDdkIsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLElBQXFCO3dCQUN4QyxnQkFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFDLEdBQWtCOzRCQUMvQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxFQUFDO2dDQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs2QkFDdEI7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsR0FBRyxHQUFHLGdCQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztvQkFDaEMsT0FBTyxHQUFHLENBQUM7Z0JBQ2YsQ0FBQztnQkFFTSx1Q0FBWSxHQUFuQjtvQkFDSSxJQUFJLEdBQUcsR0FBYSxFQUFFLENBQUM7b0JBQ3ZCLGdCQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxJQUFxQjt3QkFDeEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzt3QkFDM0IsSUFBSSxPQUFPLENBQUMscUJBQXFCLEtBQUssSUFBSSxFQUFDOzRCQUN2QyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssRUFBRSxFQUFDO2dDQUN4QixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs2QkFDOUI7eUJBQ0o7d0JBQ0QsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFDLEdBQWtCOzRCQUMxQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxFQUFDO2dDQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs2QkFDdEI7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsR0FBRyxHQUFHLGdCQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztvQkFDaEMsT0FBTyxHQUFHLENBQUM7Z0JBQ2YsQ0FBQztnQkFDTCx1QkFBQztZQUFELENBQUMsQUF2REQsSUF1REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBJQm9vbVBhdHRlcm5EYXRhIH0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7IEJvb21TZXJpZXMgfSBmcm9tIFwiLi9Cb29tU2VyaWVzXCI7XG5pbXBvcnQgeyBCb29tUGF0dGVybiB9IGZyb20gXCIuL0Jvb21QYXR0ZXJuXCI7XG5pbXBvcnQgeyBJQm9vbUZpeGVkUm93LCBJQm9vbUZpeGVkQ29sIH0gZnJvbSBcIi4vQm9vbS5pbnRlcmZhY2VcIjtcblxuY2xhc3MgQm9vbVBhdHRlcm5EYXRhIGltcGxlbWVudHMgSUJvb21QYXR0ZXJuRGF0YSB7XG4gICAgcHVibGljIHNlcmllczogQm9vbVNlcmllc1tdID0gW107XG4gICAgcHVibGljIHBhdHRlcm46IEJvb21QYXR0ZXJuO1xuICAgIGNvbnN0cnVjdG9yKHBhdHRlcm46IEJvb21QYXR0ZXJuKSB7XG4gICAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFNlcmllcyhzZXJpZXM6IEJvb21TZXJpZXMpIHtcbiAgICAgICAgdGhpcy5zZXJpZXMucHVzaChzZXJpZXMpO1xuICAgIH1cbn1cblxuY2xhc3MgQm9vbVBhdHRlcm5EYXRhcyB7XG4gICAgcHVibGljIHBhdHRlcm5zOiB7W2tleTogbnVtYmVyXTogQm9vbVBhdHRlcm5EYXRhfSA9IHt9O1xuICAgIHB1YmxpYyByZWdpc3RlclBhdHRlcm5zKGRlZmF1bHRfOiBCb29tUGF0dGVybiwgY3VzdG9tczogQm9vbVBhdHRlcm5bXSl7XG4gICAgICAgIHRoaXMucGF0dGVybnMgPSB7fTtcbiAgICAgICAgZGVmYXVsdF8uaWQgPSAtMTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclBhdHRlcm4oZGVmYXVsdF8pO1xuICAgICAgICBsZXQgaWQgPSAwO1xuICAgICAgICBfLmVhY2goY3VzdG9tcywgKHB0OiBCb29tUGF0dGVybikgPT4ge1xuICAgICAgICAgIHB0LmlkID0gaWQ7XG4gICAgICAgICAgdGhpcy5yZWdpc3RlclBhdHRlcm4ocHQpO1xuICAgICAgICAgIGlkICs9IDE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgcmVnaXN0ZXJQYXR0ZXJuKHBhdHRlcm46IEJvb21QYXR0ZXJuKTogQm9vbVBhdHRlcm5EYXRhIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLnBhdHRlcm5zW3BhdHRlcm4uaWRdO1xuICAgICAgICBpZiAoIGRhdGEgPT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgZGF0YSA9IG5ldyBCb29tUGF0dGVybkRhdGEocGF0dGVybik7XG4gICAgICAgICAgICB0aGlzLnBhdHRlcm5zW3BhdHRlcm4uaWRdID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgcHVibGljIGdldFBhdHRlcm4oaWR4OiBudW1iZXIpOiBCb29tUGF0dGVybntcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0dGVybnNbaWR4XS5wYXR0ZXJuO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0Rml4ZWRSb3dzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgXy5lYWNoKHRoaXMucGF0dGVybnMsIChkYXRhOiBCb29tUGF0dGVybkRhdGEpID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChkYXRhLnBhdHRlcm4uZml4ZWRfcm93cywgKHJvdzogSUJvb21GaXhlZFJvdykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyb3cubmFtZSAhPT0gXCJcIil7XG4gICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKHJvdy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldCA9IF8udW5pcShyZXQsIGl0ZW0gPT4gaXRlbSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZpeGVkQ29scygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGxldCByZXQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgIF8uZWFjaCh0aGlzLnBhdHRlcm5zLCAoZGF0YTogQm9vbVBhdHRlcm5EYXRhKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0dGVybiA9IGRhdGEucGF0dGVybjtcbiAgICAgICAgICAgIGlmIChwYXR0ZXJuLmNvbF9uYW1lX2FzX2ZpeGVkX3JvdyA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4uY29sX25hbWUgIT09IFwiXCIpe1xuICAgICAgICAgICAgICAgICAgICByZXQucHVzaChwYXR0ZXJuLmNvbF9uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfLmVhY2gocGF0dGVybi5maXhlZF9jb2xzLCAoY29sOiBJQm9vbUZpeGVkQ29sKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbC5uYW1lICE9PSBcIlwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goY29sLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0ID0gXy51bmlxKHJldCwgaXRlbSA9PiBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgQm9vbVBhdHRlcm5EYXRhLFxuICAgIEJvb21QYXR0ZXJuRGF0YXNcbn07XG4iXX0=