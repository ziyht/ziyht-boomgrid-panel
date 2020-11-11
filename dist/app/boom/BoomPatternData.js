System.register(["lodash", "app/core/time_series2", "./BoomSeries"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, time_series2_1, BoomSeries_1, BoomPatternData;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (BoomSeries_1_1) {
                BoomSeries_1 = BoomSeries_1_1;
            }
        ],
        execute: function () {
            BoomPatternData = (function () {
                function BoomPatternData(pattern, ctrl) {
                    this.boomSeries = [];
                    this.joinSeries = [];
                    this.joinMetas = [];
                    this.joinMetasDiscarded = [];
                    this.joinMetasMains = [];
                    this.joinMetasToJoins = {};
                    this.joinbyOptions = [{ 'value': '-1', 'text': '-1' }];
                    this.joinSampleValues = "";
                    this.inputs = [];
                    this.pattern = pattern;
                    this.ctrl = ctrl;
                    this.panel = ctrl.panel;
                }
                BoomPatternData.prototype.addInput = function (input) {
                    this.inputs.push(input);
                };
                BoomPatternData.prototype.joinData = function () {
                    var _this = this;
                    var joinMetas = [];
                    var mincnt = 100;
                    var minmeta;
                    lodash_1.default.each(this.inputs, function (input) {
                        var series = new time_series2_1.default({
                            alias: input.target,
                            datapoints: input.datapoints || []
                        });
                        series.flotpairs = series.getFlotPairs("connected");
                        var jmeta = {
                            alias: series.alias,
                            dataPoints: series.dataPoints,
                            err: "",
                            key: "",
                            splits: series.alias.split(_this.pattern.delimiter || "."),
                            stats: series.stats,
                            value: _this._getValueForMeta(series),
                        };
                        jmeta.splits.push(jmeta.value);
                        joinMetas.push(jmeta);
                        if (mincnt > jmeta.splits.length) {
                            mincnt = jmeta.splits.length;
                            minmeta = jmeta;
                        }
                    });
                    this.joinMetas = joinMetas;
                    this.joinbyOptions.splice(0, this.joinbyOptions.length, { 'value': '-1', 'text': 'off' });
                    if (minmeta !== undefined) {
                        for (var i = 0; i < mincnt; i++) {
                            this.joinbyOptions.push({ 'value': '' + i, 'text': '' + i + '(' + minmeta.splits[i] + ')' });
                        }
                    }
                    var main = "";
                    var join = "";
                    var joinby = -1;
                    if (this.pattern.data_joins !== undefined) {
                        main = this.pattern.data_joins.main;
                        join = this.pattern.data_joins.join;
                        joinby = Number(this.pattern.data_joins.joinby);
                    }
                    if (isNaN(joinby)) {
                        joinby = -1;
                    }
                    if (joinby >= mincnt) {
                        console.log("joinby '" + joinby + "' exceeded min cnt '" + mincnt + "' of all metrics splits");
                        joinby = -1;
                    }
                    var mains = [];
                    var tojoins = {};
                    var discarded = [];
                    var joinArrs = [];
                    if (main === "" || join === "" || joinby < 0) {
                        lodash_1.default.each(this.joinMetas, function (meta) {
                            joinArrs.push([meta]);
                        });
                    }
                    else {
                        lodash_1.default.each(this.joinMetas, function (meta) {
                            meta.key = meta.splits[joinby];
                            if (meta.alias.match(main)) {
                                mains.push(meta);
                            }
                            else if (meta.alias.match(join)) {
                                if (tojoins[meta.key] !== undefined) {
                                    meta.err = "key " + meta.key + "already exist in tojoins";
                                }
                                else {
                                    tojoins[meta.key] = meta;
                                }
                            }
                            else {
                                meta.err = "alias not match '" + main + "' and '" + join + "'";
                            }
                            if (meta.err !== "") {
                                discarded.push(meta);
                            }
                        });
                        lodash_1.default.each(mains, function (meta1) {
                            var meta2 = tojoins[meta1.key];
                            if (meta2 === undefined) {
                                meta1.err = "can not found match metric for key '" + meta1.key + "' in tojoins";
                                discarded.push(meta1);
                                return;
                            }
                            joinArrs.push([meta1, meta2]);
                        });
                    }
                    this.joinMetasMains = mains;
                    this.joinMetasToJoins = tojoins;
                    this.joinMetasDiscarded = discarded;
                    lodash_1.default.each(joinArrs, function (arr) {
                        if (arr.length === 1) {
                            var jmeta = arr[0];
                            var jseries = {
                                alias: jmeta.alias,
                                metas: arr,
                                splits: jmeta.splits,
                            };
                            _this.joinSeries.push(jseries);
                        }
                        else {
                            var jmeta = arr[0];
                            var jseries = {
                                alias: jmeta.alias,
                                metas: arr,
                                splits: arr[0].splits.concat(arr[1].splits),
                            };
                            _this.joinSeries.push(jseries);
                        }
                    });
                    if (this.joinSeries.length > 0) {
                        this.joinSampleValues.slice(0, this.joinSampleValues.length);
                        var wrapper = this.panel.row_col_wrapper || '_';
                        var splits = this.joinSeries[0].splits;
                        var vals = [];
                        for (var i = 0; i < splits.length; i++) {
                            vals.push(wrapper + i + wrapper + ":" + splits[i]);
                        }
                        this.joinSampleValues = vals.join(", ");
                    }
                };
                BoomPatternData.prototype.genBoomSeries = function () {
                    var _this = this;
                    this.boomSeries = this.joinSeries.map(function (input) {
                        var seriesOptions = {
                            debug_mode: _this.panel.debug_mode,
                            row_col_wrapper: _this.panel.row_col_wrapper || "_"
                        };
                        return new BoomSeries_1.BoomSeries(input, _this.panel, _this.pattern, seriesOptions, _this.ctrl.templateSrv, _this.ctrl.timeSrv);
                    });
                };
                BoomPatternData.prototype._getValueForMeta = function (tSeries) {
                    var value = null;
                    if (tSeries.stats) {
                        if (this.pattern.valueName === "last_time") {
                            if (lodash_1.default.last(tSeries.datapoints)) {
                                value = lodash_1.default.last(tSeries.datapoints)[1];
                            }
                        }
                        else if (this.pattern.valueName === "last_time_nonnull") {
                            var non_null_data = tSeries.datapoints.filter(function (s) { return s[0]; });
                            if (lodash_1.default.last(non_null_data) && lodash_1.default.last(non_null_data)[1]) {
                                value = lodash_1.default.last(non_null_data)[1];
                            }
                        }
                        else {
                            value = tSeries.stats[this.pattern.valueName];
                        }
                    }
                    return value;
                };
                return BoomPatternData;
            }());
            exports_1("BoomPatternData", BoomPatternData);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVBhdHRlcm5EYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9ib29tL0Jvb21QYXR0ZXJuRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQWFJLHlCQUFZLE9BQW9CLEVBQUUsSUFBUztvQkFacEMsZUFBVSxHQUFpQixFQUFFLENBQUM7b0JBQzlCLGVBQVUsR0FBc0IsRUFBRSxDQUFDO29CQUNuQyxjQUFTLEdBQW9CLEVBQUUsQ0FBQztvQkFDaEMsdUJBQWtCLEdBQW9CLEVBQUUsQ0FBQztvQkFDekMsbUJBQWMsR0FBd0IsRUFBRSxDQUFDO29CQUN6QyxxQkFBZ0IsR0FBbUMsRUFBRSxDQUFDO29CQUN0RCxrQkFBYSxHQUFTLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO29CQUN0RCxxQkFBZ0IsR0FBRyxFQUFFLENBQUM7b0JBQ3RCLFdBQU0sR0FBVSxFQUFFLENBQUM7b0JBS3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO29CQUN2QixJQUFJLENBQUMsSUFBSSxHQUFNLElBQUksQ0FBQztvQkFDcEIsSUFBSSxDQUFDLEtBQUssR0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUM5QixDQUFDO2dCQUVNLGtDQUFRLEdBQWYsVUFBZ0IsS0FBVTtvQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7Z0JBRU0sa0NBQVEsR0FBZjtvQkFBQSxpQkFxSUM7b0JBbElHLElBQUksU0FBUyxHQUFvQixFQUFFLENBQUM7b0JBQ3BDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDakIsSUFBSSxPQUFrQyxDQUFDO29CQUN2QyxnQkFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUEsS0FBSzt3QkFDckIsSUFBSSxNQUFNLEdBQU8sSUFBSSxzQkFBVSxDQUFDOzRCQUM1QixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU07NEJBQ25CLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUU7eUJBQ3JDLENBQUMsQ0FBQzt3QkFDSCxNQUFNLENBQUMsU0FBUyxHQUFVLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBRTNELElBQUksS0FBSyxHQUFrQjs0QkFDdkIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLOzRCQUNuQixVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7NEJBQzdCLEdBQUcsRUFBRSxFQUFFOzRCQUNQLEdBQUcsRUFBRSxFQUFFOzRCQUNQLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUM7NEJBQ3pELEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzs0QkFDbkIsS0FBSyxFQUFFLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7eUJBQ3ZDLENBQUM7d0JBQ0YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMvQixTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN0QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQzs0QkFDN0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzRCQUM3QixPQUFPLEdBQUcsS0FBSyxDQUFDO3lCQUNuQjtvQkFFTCxDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztvQkFDeEYsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFDO3dCQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDOzRCQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEdBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxPQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBQyxDQUFDLENBQUM7eUJBQy9GO3FCQUNKO29CQUdELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDZCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFDO3dCQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNwQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNwQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNuRDtvQkFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQzt3QkFDZCxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ2Y7b0JBQ0QsSUFBSSxNQUFNLElBQUksTUFBTSxFQUFDO3dCQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsc0JBQXNCLEdBQUcsTUFBTSxHQUFHLHlCQUF5QixDQUFDLENBQUM7d0JBQy9GLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDZjtvQkFHRCxJQUFJLEtBQUssR0FBb0IsRUFBRSxDQUFDO29CQUNoQyxJQUFJLE9BQU8sR0FBbUMsRUFBRSxDQUFDO29CQUNqRCxJQUFJLFNBQVMsR0FBb0IsRUFBRSxDQUFDO29CQUNwQyxJQUFJLFFBQVEsR0FBc0IsRUFBRSxDQUFDO29CQUNyQyxJQUFJLElBQUksS0FBSyxFQUFFLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUMxQyxnQkFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsSUFBSTs0QkFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQzFCLENBQUMsQ0FBQyxDQUFDO3FCQUNOO3lCQUFNO3dCQUNILGdCQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQyxJQUFtQjs0QkFDdkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDO2dDQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzZCQUNwQjtpQ0FBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDO2dDQUM5QixJQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFHO29DQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLDBCQUEwQixDQUFDO2lDQUM3RDtxQ0FBTTtvQ0FDSCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQ0FDNUI7NkJBQ0o7aUNBQU07Z0NBQ0gsSUFBSSxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsU0FBUyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7NkJBQ2xFOzRCQUVELElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUM7Z0NBQ2hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NkJBQ3hCO3dCQUNMLENBQUMsQ0FBQyxDQUFDO3dCQUVILGdCQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQW9COzRCQUMvQixJQUFJLEtBQUssR0FBa0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFFOUMsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFDO2dDQUNwQixLQUFLLENBQUMsR0FBRyxHQUFHLHNDQUFzQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsY0FBYyxDQUFDO2dDQUNoRixTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUN0QixPQUFPOzZCQUNWOzRCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsQ0FBQyxDQUFDLENBQUM7cUJBQ047b0JBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7b0JBQzVCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7b0JBR3BDLGdCQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEdBQW9CO3dCQUNsQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFDOzRCQUNqQixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ25CLElBQUksT0FBTyxHQUFvQjtnQ0FDM0IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO2dDQUNsQixLQUFLLEVBQUUsR0FBRztnQ0FDVixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07NkJBQ3ZCLENBQUM7NEJBQ0YsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBRWpDOzZCQUFNOzRCQUNILElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkIsSUFBSSxPQUFPLEdBQW9CO2dDQUMzQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7Z0NBQ2xCLEtBQUssRUFBRSxHQUFHO2dDQUNWLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDOzZCQUM5QyxDQUFDOzRCQUNGLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUVqQztvQkFDTCxDQUFDLENBQUMsQ0FBQztvQkFFSCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQzt3QkFDM0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUM3RCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFBSSxHQUFHLENBQUM7d0JBQ2hELElBQUksTUFBTSxHQUFhLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUNqRCxJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7d0JBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDOzRCQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDdEQ7d0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzNDO2dCQUNMLENBQUM7Z0JBRU0sdUNBQWEsR0FBcEI7b0JBQUEsaUJBU0M7b0JBUEcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7d0JBQ3ZDLElBQUksYUFBYSxHQUFHOzRCQUNsQixVQUFVLEVBQVEsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVOzRCQUN2QyxlQUFlLEVBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksR0FBRzt5QkFDcEQsQ0FBQzt3QkFDRixPQUFPLElBQUksdUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNwSCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2dCQUVPLDBDQUFnQixHQUF4QixVQUF5QixPQUFZO29CQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2pCLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTt3QkFDZixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTs0QkFDeEMsSUFBSSxnQkFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0NBQzVCLEtBQUssR0FBRyxnQkFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ3pDO3lCQUNKOzZCQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssbUJBQW1CLEVBQUU7NEJBQ3ZELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFKLENBQUksQ0FBQyxDQUFDOzRCQUN6RCxJQUFJLGdCQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGdCQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUNuRCxLQUFLLEdBQUcsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ3BDO3lCQUNKOzZCQUFNOzRCQUNILEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7eUJBQ2pEO3FCQUNKO29CQUNELE9BQU8sS0FBSyxDQUFDO2dCQUNqQixDQUFDO2dCQUNMLHNCQUFDO1lBQUQsQ0FBQyxBQTNMRCxJQTJMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gXCJhcHAvY29yZS90aW1lX3NlcmllczJcIjtcbmltcG9ydCB7IElCb29tUGF0dGVybkRhdGEgfSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHsgQm9vbVNlcmllcyB9IGZyb20gXCIuL0Jvb21TZXJpZXNcIjtcbmltcG9ydCB7IEJvb21QYXR0ZXJuIH0gZnJvbSBcIi4vQm9vbVBhdHRlcm5cIjtcbmltcG9ydCB7IElCb29tSm9pbk1ldGEsIElCb29tSm9pblNlcmllcyB9IGZyb20gXCIuL0Jvb20uaW50ZXJmYWNlXCI7XG5cblxuY2xhc3MgQm9vbVBhdHRlcm5EYXRhIGltcGxlbWVudHMgSUJvb21QYXR0ZXJuRGF0YSB7XG4gICAgcHVibGljIGJvb21TZXJpZXM6IEJvb21TZXJpZXNbXSA9IFtdO1xuICAgIHB1YmxpYyBqb2luU2VyaWVzOiBJQm9vbUpvaW5TZXJpZXNbXSA9IFtdO1xuICAgIHB1YmxpYyBqb2luTWV0YXM6IElCb29tSm9pbk1ldGFbXSA9IFtdO1xuICAgIHB1YmxpYyBqb2luTWV0YXNEaXNjYXJkZWQ6IElCb29tSm9pbk1ldGFbXSA9IFtdO1xuICAgIHB1YmxpYyBqb2luTWV0YXNNYWluczogICAgIElCb29tSm9pbk1ldGFbXSA9IFtdO1xuICAgIHB1YmxpYyBqb2luTWV0YXNUb0pvaW5zOiB7W2tleTogc3RyaW5nXTogSUJvb21Kb2luTWV0YX0gPSB7fTtcbiAgICBwdWJsaWMgam9pbmJ5T3B0aW9uczoge31bXSA9IFt7J3ZhbHVlJzogJy0xJywgJ3RleHQnOiAnLTEnfV07XG4gICAgcHVibGljIGpvaW5TYW1wbGVWYWx1ZXMgPSBcIlwiO1xuICAgIHB1YmxpYyBpbnB1dHM6IGFueVtdID0gW107XG4gICAgcHVibGljIHBhdHRlcm46IEJvb21QYXR0ZXJuO1xuICAgIHB1YmxpYyBjdHJsOiBhbnk7XG4gICAgcHVibGljIHBhbmVsOiBhbnk7XG4gICAgY29uc3RydWN0b3IocGF0dGVybjogQm9vbVBhdHRlcm4sIGN0cmw6IGFueSkge1xuICAgICAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgICAgICB0aGlzLmN0cmwgICAgPSBjdHJsO1xuICAgICAgICB0aGlzLnBhbmVsICAgPSBjdHJsLnBhbmVsO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRJbnB1dChpbnB1dDogYW55KXtcbiAgICAgICAgdGhpcy5pbnB1dHMucHVzaChpbnB1dCk7XG4gICAgfVxuXG4gICAgcHVibGljIGpvaW5EYXRhKCl7XG5cbiAgICAgICAgLy8gcHJlcGFyZSBqb2luIG1ldGFzXG4gICAgICAgIGxldCBqb2luTWV0YXM6IElCb29tSm9pbk1ldGFbXSA9IFtdO1xuICAgICAgICBsZXQgbWluY250ID0gMTAwO1xuICAgICAgICBsZXQgbWlubWV0YTogSUJvb21Kb2luTWV0YSB8IHVuZGVmaW5lZDtcbiAgICAgICAgXy5lYWNoKHRoaXMuaW5wdXRzLCBpbnB1dCA9PiB7XG4gICAgICAgICAgICBsZXQgc2VyaWVzICAgICA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgICAgICAgICAgICBhbGlhczogaW5wdXQudGFyZ2V0LFxuICAgICAgICAgICAgICAgIGRhdGFwb2ludHM6IGlucHV0LmRhdGFwb2ludHMgfHwgW11cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2VyaWVzLmZsb3RwYWlycyAgICAgICAgPSBzZXJpZXMuZ2V0RmxvdFBhaXJzKFwiY29ubmVjdGVkXCIpO1xuXG4gICAgICAgICAgICBsZXQgam1ldGE6IElCb29tSm9pbk1ldGEgPSB7XG4gICAgICAgICAgICAgICAgYWxpYXM6IHNlcmllcy5hbGlhcyxcbiAgICAgICAgICAgICAgICBkYXRhUG9pbnRzOiBzZXJpZXMuZGF0YVBvaW50cyxcbiAgICAgICAgICAgICAgICBlcnI6IFwiXCIsXG4gICAgICAgICAgICAgICAga2V5OiBcIlwiLFxuICAgICAgICAgICAgICAgIHNwbGl0czogc2VyaWVzLmFsaWFzLnNwbGl0KHRoaXMucGF0dGVybi5kZWxpbWl0ZXIgfHwgXCIuXCIpLFxuICAgICAgICAgICAgICAgIHN0YXRzOiBzZXJpZXMuc3RhdHMsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX2dldFZhbHVlRm9yTWV0YShzZXJpZXMpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGptZXRhLnNwbGl0cy5wdXNoKGptZXRhLnZhbHVlKTtcbiAgICAgICAgICAgIGpvaW5NZXRhcy5wdXNoKGptZXRhKTtcbiAgICAgICAgICAgIGlmIChtaW5jbnQgPiBqbWV0YS5zcGxpdHMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBtaW5jbnQgPSBqbWV0YS5zcGxpdHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIG1pbm1ldGEgPSBqbWV0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGptZXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuam9pbk1ldGFzID0gam9pbk1ldGFzO1xuICAgICAgICB0aGlzLmpvaW5ieU9wdGlvbnMuc3BsaWNlKDAsIHRoaXMuam9pbmJ5T3B0aW9ucy5sZW5ndGgsIHsndmFsdWUnOiAnLTEnLCAndGV4dCc6ICdvZmYnfSk7XG4gICAgICAgIGlmIChtaW5tZXRhICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaW5jbnQ7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5qb2luYnlPcHRpb25zLnB1c2goeyAndmFsdWUnOiAnJyArIGksICd0ZXh0JzogJycrIGkgKyAnKCcgKyBtaW5tZXRhIS5zcGxpdHNbaV0gKyAnKSd9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkYXRlIGNvbmZpZ1xuICAgICAgICBsZXQgbWFpbiA9IFwiXCI7XG4gICAgICAgIGxldCBqb2luID0gXCJcIjtcbiAgICAgICAgbGV0IGpvaW5ieSA9IC0xO1xuICAgICAgICBpZiAodGhpcy5wYXR0ZXJuLmRhdGFfam9pbnMgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBtYWluID0gdGhpcy5wYXR0ZXJuLmRhdGFfam9pbnMubWFpbjtcbiAgICAgICAgICAgIGpvaW4gPSB0aGlzLnBhdHRlcm4uZGF0YV9qb2lucy5qb2luO1xuICAgICAgICAgICAgam9pbmJ5ID0gTnVtYmVyKHRoaXMucGF0dGVybi5kYXRhX2pvaW5zLmpvaW5ieSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTmFOKGpvaW5ieSkpe1xuICAgICAgICAgICAgam9pbmJ5ID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGpvaW5ieSA+PSBtaW5jbnQpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJqb2luYnkgJ1wiICsgam9pbmJ5ICsgXCInIGV4Y2VlZGVkIG1pbiBjbnQgJ1wiICsgbWluY250ICsgXCInIG9mIGFsbCBtZXRyaWNzIHNwbGl0c1wiKTtcbiAgICAgICAgICAgIGpvaW5ieSA9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xhc3NpZnkgbm93XG4gICAgICAgIGxldCBtYWluczogSUJvb21Kb2luTWV0YVtdID0gW107XG4gICAgICAgIGxldCB0b2pvaW5zOiB7W2tleTogc3RyaW5nXTogSUJvb21Kb2luTWV0YX0gPSB7fTtcbiAgICAgICAgbGV0IGRpc2NhcmRlZDogSUJvb21Kb2luTWV0YVtdID0gW107XG4gICAgICAgIGxldCBqb2luQXJyczogSUJvb21Kb2luTWV0YVtdW10gPSBbXTtcbiAgICAgICAgaWYgKG1haW4gPT09IFwiXCIgfHwgam9pbiA9PT0gXCJcIiB8fCBqb2luYnkgPCAwKSB7XG4gICAgICAgICAgICBfLmVhY2godGhpcy5qb2luTWV0YXMsIG1ldGEgPT4ge1xuICAgICAgICAgICAgICAgIGpvaW5BcnJzLnB1c2goW21ldGFdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMuam9pbk1ldGFzLCAobWV0YTogSUJvb21Kb2luTWV0YSkgPT4ge1xuICAgICAgICAgICAgICAgIG1ldGEua2V5ID0gbWV0YS5zcGxpdHNbam9pbmJ5XTtcbiAgICAgICAgICAgICAgICBpZiAobWV0YS5hbGlhcy5tYXRjaChtYWluKSl7XG4gICAgICAgICAgICAgICAgICAgIG1haW5zLnB1c2gobWV0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhLmFsaWFzLm1hdGNoKGpvaW4pKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0b2pvaW5zW21ldGEua2V5XSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5lcnIgPSBcImtleSBcIiArIG1ldGEua2V5ICsgXCJhbHJlYWR5IGV4aXN0IGluIHRvam9pbnNcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvam9pbnNbbWV0YS5rZXldID0gbWV0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEuZXJyID0gXCJhbGlhcyBub3QgbWF0Y2ggJ1wiICsgbWFpbiArIFwiJyBhbmQgJ1wiICsgam9pbiArIFwiJ1wiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtZXRhLmVyciAhPT0gXCJcIil7XG4gICAgICAgICAgICAgICAgICAgIGRpc2NhcmRlZC5wdXNoKG1ldGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmVhY2gobWFpbnMsIChtZXRhMTogSUJvb21Kb2luTWV0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhMjogSUJvb21Kb2luTWV0YSA9IHRvam9pbnNbbWV0YTEua2V5XTtcblxuICAgICAgICAgICAgICAgIGlmIChtZXRhMiA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTEuZXJyID0gXCJjYW4gbm90IGZvdW5kIG1hdGNoIG1ldHJpYyBmb3Iga2V5ICdcIiArIG1ldGExLmtleSArIFwiJyBpbiB0b2pvaW5zXCI7XG4gICAgICAgICAgICAgICAgICAgIGRpc2NhcmRlZC5wdXNoKG1ldGExKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGpvaW5BcnJzLnB1c2goW21ldGExLCBtZXRhMl0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5qb2luTWV0YXNNYWlucyA9IG1haW5zO1xuICAgICAgICB0aGlzLmpvaW5NZXRhc1RvSm9pbnMgPSB0b2pvaW5zO1xuICAgICAgICB0aGlzLmpvaW5NZXRhc0Rpc2NhcmRlZCA9IGRpc2NhcmRlZDtcblxuICAgICAgICAvLyBqb2luIGRhdGFcbiAgICAgICAgXy5lYWNoKGpvaW5BcnJzLCAoYXJyOiBJQm9vbUpvaW5NZXRhW10pID0+IHtcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgam1ldGEgPSBhcnJbMF07XG4gICAgICAgICAgICAgICAgbGV0IGpzZXJpZXM6IElCb29tSm9pblNlcmllcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpYXM6IGptZXRhLmFsaWFzLFxuICAgICAgICAgICAgICAgICAgICBtZXRhczogYXJyLFxuICAgICAgICAgICAgICAgICAgICBzcGxpdHM6IGptZXRhLnNwbGl0cyxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuam9pblNlcmllcy5wdXNoKGpzZXJpZXMpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGpzZXJpZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgam1ldGEgPSBhcnJbMF07XG4gICAgICAgICAgICAgICAgbGV0IGpzZXJpZXM6IElCb29tSm9pblNlcmllcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWxpYXM6IGptZXRhLmFsaWFzLFxuICAgICAgICAgICAgICAgICAgICBtZXRhczogYXJyLFxuICAgICAgICAgICAgICAgICAgICBzcGxpdHM6IGFyclswXS5zcGxpdHMuY29uY2F0KGFyclsxXS5zcGxpdHMpLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5qb2luU2VyaWVzLnB1c2goanNlcmllcyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coanNlcmllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmpvaW5TZXJpZXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICB0aGlzLmpvaW5TYW1wbGVWYWx1ZXMuc2xpY2UoMCwgdGhpcy5qb2luU2FtcGxlVmFsdWVzLmxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgd3JhcHBlciA9IHRoaXMucGFuZWwucm93X2NvbF93cmFwcGVyIHx8ICdfJztcbiAgICAgICAgICAgIGxldCBzcGxpdHM6IHN0cmluZ1tdID0gdGhpcy5qb2luU2VyaWVzWzBdLnNwbGl0cztcbiAgICAgICAgICAgIGxldCB2YWxzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHZhbHMucHVzaCh3cmFwcGVyICsgaSArIHdyYXBwZXIgKyBcIjpcIiArIHNwbGl0c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmpvaW5TYW1wbGVWYWx1ZXMgPSB2YWxzLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZW5Cb29tU2VyaWVzKCl7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgICAgICAgdGhpcy5ib29tU2VyaWVzID0gdGhpcy5qb2luU2VyaWVzLm1hcChpbnB1dCA9PiB7XG4gICAgICAgICAgICBsZXQgc2VyaWVzT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgZGVidWdfbW9kZTogICAgICAgdGhpcy5wYW5lbC5kZWJ1Z19tb2RlLFxuICAgICAgICAgICAgICByb3dfY29sX3dyYXBwZXI6ICB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlciB8fCBcIl9cIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQm9vbVNlcmllcyhpbnB1dCwgdGhpcy5wYW5lbCwgdGhpcy5wYXR0ZXJuLCBzZXJpZXNPcHRpb25zLCB0aGlzLmN0cmwudGVtcGxhdGVTcnYsIHRoaXMuY3RybC50aW1lU3J2KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0VmFsdWVGb3JNZXRhKHRTZXJpZXM6IGFueSk6IGFueXtcbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKHRTZXJpZXMuc3RhdHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhdHRlcm4udmFsdWVOYW1lID09PSBcImxhc3RfdGltZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8ubGFzdCh0U2VyaWVzLmRhdGFwb2ludHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXy5sYXN0KHRTZXJpZXMuZGF0YXBvaW50cylbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhdHRlcm4udmFsdWVOYW1lID09PSBcImxhc3RfdGltZV9ub25udWxsXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgbm9uX251bGxfZGF0YSA9IHRTZXJpZXMuZGF0YXBvaW50cy5maWx0ZXIocyA9PiBzWzBdKTtcbiAgICAgICAgICAgICAgICBpZiAoXy5sYXN0KG5vbl9udWxsX2RhdGEpICYmIF8ubGFzdChub25fbnVsbF9kYXRhKVsxXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IF8ubGFzdChub25fbnVsbF9kYXRhKVsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdFNlcmllcy5zdGF0c1t0aGlzLnBhdHRlcm4udmFsdWVOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIEJvb21QYXR0ZXJuRGF0YSxcbn07XG4iXX0=