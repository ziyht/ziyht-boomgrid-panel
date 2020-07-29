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
                    this.joinMetasMains = {};
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
                    var mains = {};
                    var tojoins = {};
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
                                if (mains[meta.key] !== undefined) {
                                    meta.err = "key " + meta.key + "already exist in mains";
                                }
                                else {
                                    mains[meta.key] = meta;
                                }
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
                                _this.joinMetasDiscarded.push(meta);
                            }
                        });
                        lodash_1.default.each(mains, function (meta1) {
                            var meta2 = tojoins[meta1.key];
                            if (meta2 === undefined) {
                                meta1.err = "can not found match metric for key '" + meta1.key + "' in tojoins";
                                _this.joinMetasDiscarded.push(meta1);
                                return;
                            }
                            joinArrs.push([meta1, meta2]);
                        });
                    }
                    this.joinMetasMains = mains;
                    this.joinMetasToJoins = tojoins;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVBhdHRlcm5EYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9ib29tL0Jvb21QYXR0ZXJuRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQVFBO2dCQWFJLHlCQUFZLE9BQW9CLEVBQUUsSUFBUztvQkFacEMsZUFBVSxHQUFpQixFQUFFLENBQUM7b0JBQzlCLGVBQVUsR0FBc0IsRUFBRSxDQUFDO29CQUNuQyxjQUFTLEdBQW9CLEVBQUUsQ0FBQztvQkFDaEMsdUJBQWtCLEdBQW9CLEVBQUUsQ0FBQztvQkFDekMsbUJBQWMsR0FBcUMsRUFBRSxDQUFDO29CQUN0RCxxQkFBZ0IsR0FBbUMsRUFBRSxDQUFDO29CQUN0RCxrQkFBYSxHQUFTLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO29CQUN0RCxxQkFBZ0IsR0FBRyxFQUFFLENBQUM7b0JBQ3RCLFdBQU0sR0FBVSxFQUFFLENBQUM7b0JBS3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO29CQUN2QixJQUFJLENBQUMsSUFBSSxHQUFNLElBQUksQ0FBQztvQkFDcEIsSUFBSSxDQUFDLEtBQUssR0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUM5QixDQUFDO2dCQUVNLGtDQUFRLEdBQWYsVUFBZ0IsS0FBVTtvQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7Z0JBRU0sa0NBQVEsR0FBZjtvQkFBQSxpQkFvSUM7b0JBaklHLElBQUksU0FBUyxHQUFvQixFQUFFLENBQUM7b0JBQ3BDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDakIsSUFBSSxPQUFrQyxDQUFDO29CQUN2QyxnQkFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUEsS0FBSzt3QkFDckIsSUFBSSxNQUFNLEdBQU8sSUFBSSxzQkFBVSxDQUFDOzRCQUM1QixLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU07NEJBQ25CLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUU7eUJBQ3JDLENBQUMsQ0FBQzt3QkFDSCxNQUFNLENBQUMsU0FBUyxHQUFVLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBRTNELElBQUksS0FBSyxHQUFrQjs0QkFDdkIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLOzRCQUNuQixVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7NEJBQzdCLEdBQUcsRUFBRSxFQUFFOzRCQUNQLEdBQUcsRUFBRSxFQUFFOzRCQUNQLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUM7NEJBQ3pELEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzs0QkFDbkIsS0FBSyxFQUFFLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7eUJBQ3ZDLENBQUM7d0JBQ0YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMvQixTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN0QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQzs0QkFDN0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzRCQUM3QixPQUFPLEdBQUcsS0FBSyxDQUFDO3lCQUNuQjtvQkFFTCxDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztvQkFDeEYsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFDO3dCQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDOzRCQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEdBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxPQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBQyxDQUFDLENBQUM7eUJBQy9GO3FCQUNKO29CQUdELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDZCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFDO3dCQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNwQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNwQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNuRDtvQkFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQzt3QkFDZCxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ2Y7b0JBQ0QsSUFBSSxNQUFNLElBQUksTUFBTSxFQUFDO3dCQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsc0JBQXNCLEdBQUcsTUFBTSxHQUFHLHlCQUF5QixDQUFDLENBQUM7d0JBQy9GLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDZjtvQkFHRCxJQUFJLEtBQUssR0FBbUMsRUFBRSxDQUFDO29CQUMvQyxJQUFJLE9BQU8sR0FBbUMsRUFBRSxDQUFDO29CQUNqRCxJQUFJLFFBQVEsR0FBc0IsRUFBRSxDQUFDO29CQUNyQyxJQUFJLElBQUksS0FBSyxFQUFFLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUMxQyxnQkFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsSUFBSTs0QkFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQzFCLENBQUMsQ0FBQyxDQUFDO3FCQUNOO3lCQUFNO3dCQUNILGdCQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQyxJQUFtQjs0QkFDdkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDO2dDQUN2QixJQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFHO29DQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLHdCQUF3QixDQUFDO2lDQUMzRDtxQ0FBTTtvQ0FDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQ0FDMUI7NkJBQ0o7aUNBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQztnQ0FDOUIsSUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRztvQ0FDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRywwQkFBMEIsQ0FBQztpQ0FDN0Q7cUNBQU07b0NBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7aUNBQzVCOzZCQUNKO2lDQUFNO2dDQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsbUJBQW1CLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO2dDQUMvRCxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzZCQUN0Qzt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxnQkFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBQyxLQUFvQjs0QkFDL0IsSUFBSSxLQUFLLEdBQWtCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBRTlDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBQztnQ0FDcEIsS0FBSyxDQUFDLEdBQUcsR0FBRyxzQ0FBc0MsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLGNBQWMsQ0FBQztnQ0FDaEYsS0FBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQ0FDcEMsT0FBTzs2QkFDVjs0QkFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLENBQUMsQ0FBQyxDQUFDO3FCQUNOO29CQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO29CQUM1QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO29CQUdoQyxnQkFBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFvQjt3QkFDbEMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQzs0QkFDakIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNuQixJQUFJLE9BQU8sR0FBb0I7Z0NBQzNCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztnQ0FDbEIsS0FBSyxFQUFFLEdBQUc7Z0NBQ1YsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNOzZCQUN2QixDQUFDOzRCQUNGLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUVqQzs2QkFBTTs0QkFDSCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ25CLElBQUksT0FBTyxHQUFvQjtnQ0FDM0IsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO2dDQUNsQixLQUFLLEVBQUUsR0FBRztnQ0FDVixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs2QkFDOUMsQ0FBQzs0QkFDRixLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFFakM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7d0JBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDN0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksR0FBRyxDQUFDO3dCQUNoRCxJQUFJLE1BQU0sR0FBYSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFDakQsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO3dCQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQzs0QkFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3REO3dCQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMzQztnQkFDTCxDQUFDO2dCQUVNLHVDQUFhLEdBQXBCO29CQUFBLGlCQVNDO29CQVBHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO3dCQUN2QyxJQUFJLGFBQWEsR0FBRzs0QkFDbEIsVUFBVSxFQUFRLEtBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTs0QkFDdkMsZUFBZSxFQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxJQUFJLEdBQUc7eUJBQ3BELENBQUM7d0JBQ0YsT0FBTyxJQUFJLHVCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDcEgsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFFTywwQ0FBZ0IsR0FBeEIsVUFBeUIsT0FBWTtvQkFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7d0JBQ2YsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7NEJBQ3hDLElBQUksZ0JBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dDQUM1QixLQUFLLEdBQUcsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN6Qzt5QkFDSjs2QkFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLG1CQUFtQixFQUFFOzRCQUN2RCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBSixDQUFJLENBQUMsQ0FBQzs0QkFDekQsSUFBSSxnQkFBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxnQkFBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FDbkQsS0FBSyxHQUFHLGdCQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUNwQzt5QkFDSjs2QkFBTTs0QkFDSCxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3lCQUNqRDtxQkFDSjtvQkFDRCxPQUFPLEtBQUssQ0FBQztnQkFDakIsQ0FBQztnQkFDTCxzQkFBQztZQUFELENBQUMsQUExTEQsSUEwTEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgVGltZVNlcmllcyBmcm9tIFwiYXBwL2NvcmUvdGltZV9zZXJpZXMyXCI7XG5pbXBvcnQgeyBJQm9vbVBhdHRlcm5EYXRhIH0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7IEJvb21TZXJpZXMgfSBmcm9tIFwiLi9Cb29tU2VyaWVzXCI7XG5pbXBvcnQgeyBCb29tUGF0dGVybiB9IGZyb20gXCIuL0Jvb21QYXR0ZXJuXCI7XG5pbXBvcnQgeyBJQm9vbUpvaW5NZXRhLCBJQm9vbUpvaW5TZXJpZXMgfSBmcm9tIFwiLi9Cb29tLmludGVyZmFjZVwiO1xuXG5cbmNsYXNzIEJvb21QYXR0ZXJuRGF0YSBpbXBsZW1lbnRzIElCb29tUGF0dGVybkRhdGEge1xuICAgIHB1YmxpYyBib29tU2VyaWVzOiBCb29tU2VyaWVzW10gPSBbXTtcbiAgICBwdWJsaWMgam9pblNlcmllczogSUJvb21Kb2luU2VyaWVzW10gPSBbXTtcbiAgICBwdWJsaWMgam9pbk1ldGFzOiBJQm9vbUpvaW5NZXRhW10gPSBbXTtcbiAgICBwdWJsaWMgam9pbk1ldGFzRGlzY2FyZGVkOiBJQm9vbUpvaW5NZXRhW10gPSBbXTtcbiAgICBwdWJsaWMgam9pbk1ldGFzTWFpbnM6ICAge1trZXk6IHN0cmluZ106IElCb29tSm9pbk1ldGF9ID0ge307XG4gICAgcHVibGljIGpvaW5NZXRhc1RvSm9pbnM6IHtba2V5OiBzdHJpbmddOiBJQm9vbUpvaW5NZXRhfSA9IHt9O1xuICAgIHB1YmxpYyBqb2luYnlPcHRpb25zOiB7fVtdID0gW3sndmFsdWUnOiAnLTEnLCAndGV4dCc6ICctMSd9XTtcbiAgICBwdWJsaWMgam9pblNhbXBsZVZhbHVlcyA9IFwiXCI7XG4gICAgcHVibGljIGlucHV0czogYW55W10gPSBbXTtcbiAgICBwdWJsaWMgcGF0dGVybjogQm9vbVBhdHRlcm47XG4gICAgcHVibGljIGN0cmw6IGFueTtcbiAgICBwdWJsaWMgcGFuZWw6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwYXR0ZXJuOiBCb29tUGF0dGVybiwgY3RybDogYW55KSB7XG4gICAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gICAgICAgIHRoaXMuY3RybCAgICA9IGN0cmw7XG4gICAgICAgIHRoaXMucGFuZWwgICA9IGN0cmwucGFuZWw7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZElucHV0KGlucHV0OiBhbnkpe1xuICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgam9pbkRhdGEoKXtcblxuICAgICAgICAvLyBwcmVwYXJlIGpvaW4gbWV0YXNcbiAgICAgICAgbGV0IGpvaW5NZXRhczogSUJvb21Kb2luTWV0YVtdID0gW107XG4gICAgICAgIGxldCBtaW5jbnQgPSAxMDA7XG4gICAgICAgIGxldCBtaW5tZXRhOiBJQm9vbUpvaW5NZXRhIHwgdW5kZWZpbmVkO1xuICAgICAgICBfLmVhY2godGhpcy5pbnB1dHMsIGlucHV0ID0+IHtcbiAgICAgICAgICAgIGxldCBzZXJpZXMgICAgID0gbmV3IFRpbWVTZXJpZXMoe1xuICAgICAgICAgICAgICAgIGFsaWFzOiBpbnB1dC50YXJnZXQsXG4gICAgICAgICAgICAgICAgZGF0YXBvaW50czogaW5wdXQuZGF0YXBvaW50cyB8fCBbXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXJpZXMuZmxvdHBhaXJzICAgICAgICA9IHNlcmllcy5nZXRGbG90UGFpcnMoXCJjb25uZWN0ZWRcIik7XG5cbiAgICAgICAgICAgIGxldCBqbWV0YTogSUJvb21Kb2luTWV0YSA9IHtcbiAgICAgICAgICAgICAgICBhbGlhczogc2VyaWVzLmFsaWFzLFxuICAgICAgICAgICAgICAgIGRhdGFQb2ludHM6IHNlcmllcy5kYXRhUG9pbnRzLFxuICAgICAgICAgICAgICAgIGVycjogXCJcIixcbiAgICAgICAgICAgICAgICBrZXk6IFwiXCIsXG4gICAgICAgICAgICAgICAgc3BsaXRzOiBzZXJpZXMuYWxpYXMuc3BsaXQodGhpcy5wYXR0ZXJuLmRlbGltaXRlciB8fCBcIi5cIiksXG4gICAgICAgICAgICAgICAgc3RhdHM6IHNlcmllcy5zdGF0cyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5fZ2V0VmFsdWVGb3JNZXRhKHNlcmllcyksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgam1ldGEuc3BsaXRzLnB1c2goam1ldGEudmFsdWUpO1xuICAgICAgICAgICAgam9pbk1ldGFzLnB1c2goam1ldGEpO1xuICAgICAgICAgICAgaWYgKG1pbmNudCA+IGptZXRhLnNwbGl0cy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIG1pbmNudCA9IGptZXRhLnNwbGl0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbWlubWV0YSA9IGptZXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coam1ldGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5qb2luTWV0YXMgPSBqb2luTWV0YXM7XG4gICAgICAgIHRoaXMuam9pbmJ5T3B0aW9ucy5zcGxpY2UoMCwgdGhpcy5qb2luYnlPcHRpb25zLmxlbmd0aCwgeyd2YWx1ZSc6ICctMScsICd0ZXh0JzogJ29mZid9KTtcbiAgICAgICAgaWYgKG1pbm1ldGEgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbmNudDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmpvaW5ieU9wdGlvbnMucHVzaCh7ICd2YWx1ZSc6ICcnICsgaSwgJ3RleHQnOiAnJysgaSArICcoJyArIG1pbm1ldGEhLnNwbGl0c1tpXSArICcpJ30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWRhdGUgY29uZmlnXG4gICAgICAgIGxldCBtYWluID0gXCJcIjtcbiAgICAgICAgbGV0IGpvaW4gPSBcIlwiO1xuICAgICAgICBsZXQgam9pbmJ5ID0gLTE7XG4gICAgICAgIGlmICh0aGlzLnBhdHRlcm4uZGF0YV9qb2lucyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIG1haW4gPSB0aGlzLnBhdHRlcm4uZGF0YV9qb2lucy5tYWluO1xuICAgICAgICAgICAgam9pbiA9IHRoaXMucGF0dGVybi5kYXRhX2pvaW5zLmpvaW47XG4gICAgICAgICAgICBqb2luYnkgPSBOdW1iZXIodGhpcy5wYXR0ZXJuLmRhdGFfam9pbnMuam9pbmJ5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOYU4oam9pbmJ5KSl7XG4gICAgICAgICAgICBqb2luYnkgPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoam9pbmJ5ID49IG1pbmNudCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImpvaW5ieSAnXCIgKyBqb2luYnkgKyBcIicgZXhjZWVkZWQgbWluIGNudCAnXCIgKyBtaW5jbnQgKyBcIicgb2YgYWxsIG1ldHJpY3Mgc3BsaXRzXCIpO1xuICAgICAgICAgICAgam9pbmJ5ID0gLTE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGFzc2lmeSBub3dcbiAgICAgICAgbGV0IG1haW5zOiB7W2tleTogc3RyaW5nXTogSUJvb21Kb2luTWV0YX0gPSB7fTtcbiAgICAgICAgbGV0IHRvam9pbnM6IHtba2V5OiBzdHJpbmddOiBJQm9vbUpvaW5NZXRhfSA9IHt9O1xuICAgICAgICBsZXQgam9pbkFycnM6IElCb29tSm9pbk1ldGFbXVtdID0gW107XG4gICAgICAgIGlmIChtYWluID09PSBcIlwiIHx8IGpvaW4gPT09IFwiXCIgfHwgam9pbmJ5IDwgMCkge1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMuam9pbk1ldGFzLCBtZXRhID0+IHtcbiAgICAgICAgICAgICAgICBqb2luQXJycy5wdXNoKFttZXRhXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLmpvaW5NZXRhcywgKG1ldGE6IElCb29tSm9pbk1ldGEpID0+IHtcbiAgICAgICAgICAgICAgICBtZXRhLmtleSA9IG1ldGEuc3BsaXRzW2pvaW5ieV07XG4gICAgICAgICAgICAgICAgaWYgKG1ldGEuYWxpYXMubWF0Y2gobWFpbikpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoIG1haW5zW21ldGEua2V5XSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5lcnIgPSBcImtleSBcIiArIG1ldGEua2V5ICsgXCJhbHJlYWR5IGV4aXN0IGluIG1haW5zXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluc1ttZXRhLmtleV0gPSBtZXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhLmFsaWFzLm1hdGNoKGpvaW4pKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0b2pvaW5zW21ldGEua2V5XSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YS5lcnIgPSBcImtleSBcIiArIG1ldGEua2V5ICsgXCJhbHJlYWR5IGV4aXN0IGluIHRvam9pbnNcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvam9pbnNbbWV0YS5rZXldID0gbWV0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGEuZXJyID0gXCJhbGlhcyBub3QgbWF0Y2ggJ1wiICsgbWFpbiArIFwiJyBhbmQgJ1wiICsgam9pbiArIFwiJ1wiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmpvaW5NZXRhc0Rpc2NhcmRlZC5wdXNoKG1ldGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmVhY2gobWFpbnMsIChtZXRhMTogSUJvb21Kb2luTWV0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtZXRhMjogSUJvb21Kb2luTWV0YSA9IHRvam9pbnNbbWV0YTEua2V5XTtcblxuICAgICAgICAgICAgICAgIGlmIChtZXRhMiA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgbWV0YTEuZXJyID0gXCJjYW4gbm90IGZvdW5kIG1hdGNoIG1ldHJpYyBmb3Iga2V5ICdcIiArIG1ldGExLmtleSArIFwiJyBpbiB0b2pvaW5zXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuam9pbk1ldGFzRGlzY2FyZGVkLnB1c2gobWV0YTEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgam9pbkFycnMucHVzaChbbWV0YTEsIG1ldGEyXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmpvaW5NZXRhc01haW5zID0gbWFpbnM7XG4gICAgICAgIHRoaXMuam9pbk1ldGFzVG9Kb2lucyA9IHRvam9pbnM7XG5cbiAgICAgICAgLy8gam9pbiBkYXRhXG4gICAgICAgIF8uZWFjaChqb2luQXJycywgKGFycjogSUJvb21Kb2luTWV0YVtdKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMSl7XG4gICAgICAgICAgICAgICAgbGV0IGptZXRhID0gYXJyWzBdO1xuICAgICAgICAgICAgICAgIGxldCBqc2VyaWVzOiBJQm9vbUpvaW5TZXJpZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWFzOiBqbWV0YS5hbGlhcyxcbiAgICAgICAgICAgICAgICAgICAgbWV0YXM6IGFycixcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRzOiBqbWV0YS5zcGxpdHMsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmpvaW5TZXJpZXMucHVzaChqc2VyaWVzKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhqc2VyaWVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGptZXRhID0gYXJyWzBdO1xuICAgICAgICAgICAgICAgIGxldCBqc2VyaWVzOiBJQm9vbUpvaW5TZXJpZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGFsaWFzOiBqbWV0YS5hbGlhcyxcbiAgICAgICAgICAgICAgICAgICAgbWV0YXM6IGFycixcbiAgICAgICAgICAgICAgICAgICAgc3BsaXRzOiBhcnJbMF0uc3BsaXRzLmNvbmNhdChhcnJbMV0uc3BsaXRzKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuam9pblNlcmllcy5wdXNoKGpzZXJpZXMpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGpzZXJpZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5qb2luU2VyaWVzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgdGhpcy5qb2luU2FtcGxlVmFsdWVzLnNsaWNlKDAsIHRoaXMuam9pblNhbXBsZVZhbHVlcy5sZW5ndGgpO1xuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlciB8fCAnXyc7XG4gICAgICAgICAgICBsZXQgc3BsaXRzOiBzdHJpbmdbXSA9IHRoaXMuam9pblNlcmllc1swXS5zcGxpdHM7XG4gICAgICAgICAgICBsZXQgdmFsczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB2YWxzLnB1c2god3JhcHBlciArIGkgKyB3cmFwcGVyICsgXCI6XCIgKyBzcGxpdHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5qb2luU2FtcGxlVmFsdWVzID0gdmFscy5qb2luKFwiLCBcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2VuQm9vbVNlcmllcygpe1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgICAgIHRoaXMuYm9vbVNlcmllcyA9IHRoaXMuam9pblNlcmllcy5tYXAoaW5wdXQgPT4ge1xuICAgICAgICAgICAgbGV0IHNlcmllc09wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIGRlYnVnX21vZGU6ICAgICAgIHRoaXMucGFuZWwuZGVidWdfbW9kZSxcbiAgICAgICAgICAgICAgcm93X2NvbF93cmFwcGVyOiAgdGhpcy5wYW5lbC5yb3dfY29sX3dyYXBwZXIgfHwgXCJfXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJvb21TZXJpZXMoaW5wdXQsIHRoaXMucGFuZWwsIHRoaXMucGF0dGVybiwgc2VyaWVzT3B0aW9ucywgdGhpcy5jdHJsLnRlbXBsYXRlU3J2LCB0aGlzLmN0cmwudGltZVNydik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldFZhbHVlRm9yTWV0YSh0U2VyaWVzOiBhbnkpOiBhbnl7XG4gICAgICAgIGxldCB2YWx1ZSA9IG51bGw7XG4gICAgICAgIGlmICh0U2VyaWVzLnN0YXRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXR0ZXJuLnZhbHVlTmFtZSA9PT0gXCJsYXN0X3RpbWVcIikge1xuICAgICAgICAgICAgICAgIGlmIChfLmxhc3QodFNlcmllcy5kYXRhcG9pbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IF8ubGFzdCh0U2VyaWVzLmRhdGFwb2ludHMpWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXR0ZXJuLnZhbHVlTmFtZSA9PT0gXCJsYXN0X3RpbWVfbm9ubnVsbFwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5vbl9udWxsX2RhdGEgPSB0U2VyaWVzLmRhdGFwb2ludHMuZmlsdGVyKHMgPT4gc1swXSk7XG4gICAgICAgICAgICAgICAgaWYgKF8ubGFzdChub25fbnVsbF9kYXRhKSAmJiBfLmxhc3Qobm9uX251bGxfZGF0YSlbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBfLmxhc3Qobm9uX251bGxfZGF0YSlbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRTZXJpZXMuc3RhdHNbdGhpcy5wYXR0ZXJuLnZhbHVlTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBCb29tUGF0dGVybkRhdGEsXG59O1xuIl19