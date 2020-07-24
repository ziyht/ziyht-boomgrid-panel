System.register(["lodash", "./boom/index", "./config"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, index_1, config_1, defaultPattern, seriesToTable, removeHiddenColFromTable, updateSortColIdxForTable;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            }
        ],
        execute: function () {
            defaultPattern = new index_1.BoomPattern({
                bgColors: "green|orange|red",
                bgColors_overrides: "0->green|2->red|1->yellow",
                clickable_cells_link: "",
                col_name: "Value",
                datas: [],
                decimals: 2,
                delimiter: ".",
                enable_filtered_thresholds: false,
                fixed_rows: [],
                format: "none",
                index: -1,
                name: "Default Pattern",
                null_color: "darkred",
                null_textcolor: "white",
                null_value: "No data",
                pattern: "*",
                row_name: "_series_",
                textColor: "red|orange|green",
                textColors_overrides: "0->red|2->green|1->yellow",
                thresholds: "70,90",
                time_based_thresholds: [],
                transform_values: "_value_|_value_|_value_",
                transform_values_overrides: "0->down|1->up",
                valueName: "avg",
            });
            exports_1("defaultPattern", defaultPattern);
            seriesToTable = function (inputdata, options, patternDatas) {
                var rows_found = lodash_1.default.uniq(lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.row_name; })).concat(patternDatas.getFixedRows()));
                var rows_without_token = lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.row_name_raw; }));
                var cols_found = lodash_1.default.uniq(lodash_1.default.uniq(lodash_1.default.map(inputdata, function (d) { return d.col_name; })).concat(patternDatas.getFixedCols()));
                var row_col_cells = [];
                cols_found = cols_found.sort();
                if (options.cols_sort_type === config_1.columnSortTypes[1]) {
                    cols_found = cols_found.reverse();
                }
                lodash_1.default.each(rows_found, function (row_name) {
                    var cols = [];
                    lodash_1.default.each(cols_found, function (col_name) {
                        var matched_items = lodash_1.default.filter(inputdata, function (o) {
                            return o.row_name === row_name && o.col_name === col_name && o.hidden === false;
                        });
                        if (!matched_items || matched_items.length === 0) {
                            var cell = {
                                "col_name": col_name,
                                "color_bg": options.non_matching_cells_color_bg,
                                "color_text": options.non_matching_cells_color_text,
                                "display_value": index_1.replaceTokens(options.non_matching_cells_text),
                                "hidden": false,
                                "items": [],
                                "link": "-",
                                "row_name": row_name,
                                "tooltip": "-",
                                "value": NaN,
                            };
                            cols.push(cell);
                        }
                        else if (matched_items && matched_items.length === 1) {
                            cols.push(matched_items[0].toBoomCellDetails());
                        }
                        else if (matched_items && matched_items.length > 1) {
                            var item = matched_items[0];
                            var cell_1 = {
                                "col_name": col_name,
                                "color_bg": "darkred",
                                "color_text": "white",
                                "display_value": "Duplicate matches",
                                "hidden": false,
                                "items": [],
                                "link": "-",
                                "row_name": row_name,
                                "tooltip": "",
                                "value": NaN,
                            };
                            var pattern = patternDatas.getPattern(item.pattern_id.valueOf());
                            var classify_1 = {};
                            var min_id_1 = item.color_bg_id;
                            var max_id_1 = item.color_bg_id;
                            var choosen_1 = item;
                            if (pattern.enable_multivalue_cells) {
                                lodash_1.default.each(matched_items, function (item) {
                                    cell_1.items.push(item.toBoomCellDetails());
                                    cell_1.tooltip += item.tooltip + '<br>';
                                    if (min_id_1 > item.color_bg_id) {
                                        min_id_1 = item.color_bg_id;
                                    }
                                    if (max_id_1 < item.color_bg_id) {
                                        max_id_1 = item.color_bg_id;
                                    }
                                    if (classify_1[item.color_bg_id.toString()] === undefined) {
                                        classify_1[item.color_bg_id.toString()] = [];
                                    }
                                    classify_1[item.color_bg_id.toString()].push(item);
                                });
                                if (pattern.multi_value_show_priority === config_1.multiValueShowPriorities[0]) {
                                    var items = classify_1[min_id_1.toString()];
                                    var value_1 = items[0].value;
                                    choosen_1 = items[0];
                                    lodash_1.default.each(classify_1[max_id_1.toString()], function (item) {
                                        if (value_1 > item.value) {
                                            choosen_1 = item;
                                            value_1 = item.value;
                                        }
                                    });
                                }
                                else {
                                    var items = classify_1[max_id_1.toString()];
                                    var value_2 = items[0].value;
                                    choosen_1 = items[0];
                                    lodash_1.default.each(classify_1[max_id_1.toString()], function (item) {
                                        if (value_2 < item.value) {
                                            choosen_1 = item;
                                            value_2 = item.value;
                                        }
                                    });
                                }
                                cell_1.color_bg = choosen_1.color_bg;
                                cell_1.color_text = choosen_1.color_text;
                                cell_1.display_value = choosen_1.display_value;
                                cell_1.link = choosen_1.link;
                                cell_1.value = choosen_1.value;
                                cell_1.hidden = choosen_1.hidden;
                            }
                            else {
                                var values_1 = [];
                                lodash_1.default.each(matched_items, function (item) {
                                    cell_1.items.push(item.toBoomCellDetails());
                                    cell_1.tooltip += item.tooltip + '<br>';
                                    values_1.push(item.value);
                                });
                                cell_1.display_value += ": " + values_1.join('|');
                            }
                            cols.push(cell_1);
                        }
                    });
                    row_col_cells.push(cols);
                });
                return {
                    cols_found: cols_found,
                    row_col_cells: row_col_cells,
                    rows_found: rows_found,
                    rows_without_token: rows_without_token,
                };
            };
            exports_1("seriesToTable", seriesToTable);
            removeHiddenColFromTable = function (boomtabledata, need_hiddens) {
                var cols_found = boomtabledata.cols_found;
                for (var _i = 0, need_hiddens_1 = need_hiddens; _i < need_hiddens_1.length; _i++) {
                    var col = need_hiddens_1[_i];
                    var idx = cols_found.indexOf(col);
                    if (idx !== -1) {
                        cols_found.splice(idx, 1);
                    }
                }
                boomtabledata.cols_found = cols_found;
            };
            exports_1("removeHiddenColFromTable", removeHiddenColFromTable);
            updateSortColIdxForTable = function (boomtabledata, sorting_props) {
                if (sorting_props.sort_column !== undefined && sorting_props.sort_column !== "") {
                    var idx = boomtabledata.cols_found.indexOf(sorting_props.sort_column);
                    if (idx !== -1) {
                        sorting_props.col_index = idx;
                        console.log("set sort col idx to " + idx);
                    }
                }
                if (sorting_props.col_index >= boomtabledata.cols_found.length) {
                    sorting_props.col_index = -1;
                }
            };
            exports_1("updateSortColIdxForTable", updateSortColIdxForTable);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFNTSxjQUFjLEdBQUcsSUFBSSxtQkFBVyxDQUFDO2dCQUNuQyxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixrQkFBa0IsRUFBRSwyQkFBMkI7Z0JBQy9DLG9CQUFvQixFQUFFLEVBQUU7Z0JBQ3hCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxRQUFRLEVBQUUsQ0FBQztnQkFDWCxTQUFTLEVBQUUsR0FBRztnQkFDZCwwQkFBMEIsRUFBRSxLQUFLO2dCQUNqQyxVQUFVLEVBQUUsRUFBRTtnQkFDZCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNULElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixjQUFjLEVBQUUsT0FBTztnQkFDdkIsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLE9BQU8sRUFBRSxHQUFHO2dCQUNaLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixvQkFBb0IsRUFBRSwyQkFBMkI7Z0JBQ2pELFVBQVUsRUFBRSxPQUFPO2dCQUNuQixxQkFBcUIsRUFBRSxFQUFFO2dCQUN6QixnQkFBZ0IsRUFBRSx5QkFBeUI7Z0JBQzNDLDBCQUEwQixFQUFFLGVBQWU7Z0JBQzNDLFNBQVMsRUFBRSxLQUFLO2FBQ25CLENBQUMsQ0FBQzs7WUFFRyxhQUFhLEdBQUcsVUFBVSxTQUF1QixFQUFFLE9BQXdDLEVBQUUsWUFBd0I7Z0JBQ3ZILElBQUksVUFBVSxHQUFHLGdCQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsUUFBUSxF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b0JBQXpCLElBQUksR0FBRyxxQkFBQTtvQkFDUixJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDWixVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDN0I7aUJBQ0o7Z0JBQ0QsYUFBYSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDMUMsQ0FBQyxDQUFDOztZQUVJLHdCQUF3QixHQUFHLFVBQVMsYUFBeUIsRUFBRSxhQUFrQjtnQkFFbkYsSUFBSSxhQUFhLENBQUMsV0FBVyxLQUFLLFNBQVMsSUFBSSxhQUFhLENBQUMsV0FBVyxLQUFLLEVBQUUsRUFBQztvQkFDNUUsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN0RSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQzt3QkFDWCxhQUFhLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQzt3QkFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FBQztxQkFDN0M7aUJBQ0o7Z0JBQ0QsSUFBSSxhQUFhLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO29CQUM1RCxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNoQztZQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IEJvb21TZXJpZXMsIElCb29tQ2VsbERldGFpbHMsIElCb29tVGFibGUsIElCb29tVGFibGVUcmFuc2Zvcm1hdGlvbk9wdGlvbnMgfSBmcm9tIFwiLi9ib29tL2luZGV4XCI7XG5pbXBvcnQgeyBCb29tUGF0dGVybiwgcmVwbGFjZVRva2VucyB9IGZyb20gJy4vYm9vbS9pbmRleCc7XG5pbXBvcnQgeyBtdWx0aVZhbHVlU2hvd1ByaW9yaXRpZXMsIGNvbHVtblNvcnRUeXBlcyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IEJvb21Ecml2ZXIgfSBmcm9tICcuL2Jvb20vQm9vbURyaXZlcic7XG5cbmNvbnN0IGRlZmF1bHRQYXR0ZXJuID0gbmV3IEJvb21QYXR0ZXJuKHtcbiAgICBiZ0NvbG9yczogXCJncmVlbnxvcmFuZ2V8cmVkXCIsXG4gICAgYmdDb2xvcnNfb3ZlcnJpZGVzOiBcIjAtPmdyZWVufDItPnJlZHwxLT55ZWxsb3dcIixcbiAgICBjbGlja2FibGVfY2VsbHNfbGluazogXCJcIixcbiAgICBjb2xfbmFtZTogXCJWYWx1ZVwiLFxuICAgIGRhdGFzOiBbXSxcbiAgICBkZWNpbWFsczogMixcbiAgICBkZWxpbWl0ZXI6IFwiLlwiLFxuICAgIGVuYWJsZV9maWx0ZXJlZF90aHJlc2hvbGRzOiBmYWxzZSxcbiAgICBmaXhlZF9yb3dzOiBbXSxcbiAgICBmb3JtYXQ6IFwibm9uZVwiLFxuICAgIGluZGV4OiAtMSxcbiAgICBuYW1lOiBcIkRlZmF1bHQgUGF0dGVyblwiLFxuICAgIG51bGxfY29sb3I6IFwiZGFya3JlZFwiLFxuICAgIG51bGxfdGV4dGNvbG9yOiBcIndoaXRlXCIsXG4gICAgbnVsbF92YWx1ZTogXCJObyBkYXRhXCIsXG4gICAgcGF0dGVybjogXCIqXCIsXG4gICAgcm93X25hbWU6IFwiX3Nlcmllc19cIixcbiAgICB0ZXh0Q29sb3I6IFwicmVkfG9yYW5nZXxncmVlblwiLFxuICAgIHRleHRDb2xvcnNfb3ZlcnJpZGVzOiBcIjAtPnJlZHwyLT5ncmVlbnwxLT55ZWxsb3dcIixcbiAgICB0aHJlc2hvbGRzOiBcIjcwLDkwXCIsXG4gICAgdGltZV9iYXNlZF90aHJlc2hvbGRzOiBbXSxcbiAgICB0cmFuc2Zvcm1fdmFsdWVzOiBcIl92YWx1ZV98X3ZhbHVlX3xfdmFsdWVfXCIsXG4gICAgdHJhbnNmb3JtX3ZhbHVlc19vdmVycmlkZXM6IFwiMC0+ZG93bnwxLT51cFwiLFxuICAgIHZhbHVlTmFtZTogXCJhdmdcIixcbn0pO1xuXG5jb25zdCBzZXJpZXNUb1RhYmxlID0gZnVuY3Rpb24gKGlucHV0ZGF0YTogQm9vbVNlcmllc1tdLCBvcHRpb25zOiBJQm9vbVRhYmxlVHJhbnNmb3JtYXRpb25PcHRpb25zLCBwYXR0ZXJuRGF0YXM6IEJvb21Ecml2ZXIpOiBJQm9vbVRhYmxlIHtcbiAgICBsZXQgcm93c19mb3VuZCA9IF8udW5pcShfLnVuaXEoXy5tYXAoaW5wdXRkYXRhLCAoZDogeyByb3dfbmFtZTogYW55OyB9KSA9PiBkLnJvd19uYW1lKSkuY29uY2F0KHBhdHRlcm5EYXRhcy5nZXRGaXhlZFJvd3MoKSkpO1xuICAgIGxldCByb3dzX3dpdGhvdXRfdG9rZW4gPSBfLnVuaXEoXy5tYXAoaW5wdXRkYXRhLCAoZDogeyByb3dfbmFtZV9yYXc6IGFueTsgfSkgPT4gZC5yb3dfbmFtZV9yYXcpKTtcbiAgICBsZXQgY29sc19mb3VuZDogc3RyaW5nW10gPSBfLnVuaXEoXy51bmlxKF8ubWFwKGlucHV0ZGF0YSwgKGQ6IHsgY29sX25hbWU6IGFueTsgfSkgPT4gZC5jb2xfbmFtZSkpLmNvbmNhdChwYXR0ZXJuRGF0YXMuZ2V0Rml4ZWRDb2xzKCkpKTtcbiAgICBsZXQgcm93X2NvbF9jZWxsczogSUJvb21DZWxsRGV0YWlsc1tdW10gPSBbXTtcbiAgICBjb2xzX2ZvdW5kID0gY29sc19mb3VuZC5zb3J0KCk7XG4gICAgaWYgKG9wdGlvbnMuY29sc19zb3J0X3R5cGUgPT09IGNvbHVtblNvcnRUeXBlc1sxXSl7XG4gICAgICAgIGNvbHNfZm91bmQgPSBjb2xzX2ZvdW5kLnJldmVyc2UoKTtcbiAgICB9XG4gICAgXy5lYWNoKHJvd3NfZm91bmQsIChyb3dfbmFtZTogYW55KSA9PiB7XG4gICAgICAgIGxldCBjb2xzOiBJQm9vbUNlbGxEZXRhaWxzW10gPSBbXTtcbiAgICAgICAgXy5lYWNoKGNvbHNfZm91bmQsIChjb2xfbmFtZTogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlZF9pdGVtczogQm9vbVNlcmllc1tdID0gXy5maWx0ZXIoaW5wdXRkYXRhLCAobzogeyByb3dfbmFtZTogYW55OyBjb2xfbmFtZTogYW55OyBoaWRkZW46IGFueSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG8ucm93X25hbWUgPT09IHJvd19uYW1lICYmIG8uY29sX25hbWUgPT09IGNvbF9uYW1lICYmIG8uaGlkZGVuID09PSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFtYXRjaGVkX2l0ZW1zIHx8IG1hdGNoZWRfaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGwgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29sX25hbWVcIjogY29sX25hbWUsXG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JfYmdcIjogb3B0aW9ucy5ub25fbWF0Y2hpbmdfY2VsbHNfY29sb3JfYmcsXG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JfdGV4dFwiOiBvcHRpb25zLm5vbl9tYXRjaGluZ19jZWxsc19jb2xvcl90ZXh0LFxuICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXlfdmFsdWVcIjogcmVwbGFjZVRva2VucyhvcHRpb25zLm5vbl9tYXRjaGluZ19jZWxsc190ZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgXCJoaWRkZW5cIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW10sXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJyb3dfbmFtZVwiOiByb3dfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0b29sdGlwXCI6IFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IE5hTixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbHMucHVzaChjZWxsKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlZF9pdGVtcyAmJiBtYXRjaGVkX2l0ZW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbHMucHVzaChtYXRjaGVkX2l0ZW1zWzBdLnRvQm9vbUNlbGxEZXRhaWxzKCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVkX2l0ZW1zICYmIG1hdGNoZWRfaXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gbWF0Y2hlZF9pdGVtc1swXTtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbDogSUJvb21DZWxsRGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xfbmFtZVwiOiBjb2xfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl9iZ1wiOiBcImRhcmtyZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl90ZXh0XCI6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNwbGF5X3ZhbHVlXCI6IFwiRHVwbGljYXRlIG1hdGNoZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJoaWRkZW5cIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW10sXG4gICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJyb3dfbmFtZVwiOiByb3dfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogTmFOLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSBwYXR0ZXJuRGF0YXMuZ2V0UGF0dGVybihpdGVtLnBhdHRlcm5faWQudmFsdWVPZigpKTtcbiAgICAgICAgICAgICAgICBsZXQgY2xhc3NpZnkgPSB7fTtcbiAgICAgICAgICAgICAgICBsZXQgbWluX2lkID0gaXRlbS5jb2xvcl9iZ19pZDtcbiAgICAgICAgICAgICAgICBsZXQgbWF4X2lkID0gaXRlbS5jb2xvcl9iZ19pZDtcbiAgICAgICAgICAgICAgICBsZXQgY2hvb3NlbjogQm9vbVNlcmllcyA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4uZW5hYmxlX211bHRpdmFsdWVfY2VsbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICBfLmVhY2gobWF0Y2hlZF9pdGVtcywgKGl0ZW06IEJvb21TZXJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaXRlbXMucHVzaChpdGVtLnRvQm9vbUNlbGxEZXRhaWxzKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC50b29sdGlwICs9IGl0ZW0udG9vbHRpcCArICc8YnI+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW5faWQgPiBpdGVtLmNvbG9yX2JnX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluX2lkID0gaXRlbS5jb2xvcl9iZ19pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXhfaWQgPCBpdGVtLmNvbG9yX2JnX2lkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhfaWQgPSBpdGVtLmNvbG9yX2JnX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjbGFzc2lmeVtpdGVtLmNvbG9yX2JnX2lkLnRvU3RyaW5nKCldID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2lmeVtpdGVtLmNvbG9yX2JnX2lkLnRvU3RyaW5nKCldID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2lmeVtpdGVtLmNvbG9yX2JnX2lkLnRvU3RyaW5nKCldLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF0dGVybi5tdWx0aV92YWx1ZV9zaG93X3ByaW9yaXR5ID09PSBtdWx0aVZhbHVlU2hvd1ByaW9yaXRpZXNbMF0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1zOiBCb29tU2VyaWVzW10gPSBjbGFzc2lmeVttaW5faWQudG9TdHJpbmcoKV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtc1swXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZW4gICA9IGl0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGNsYXNzaWZ5W21heF9pZC50b1N0cmluZygpXSwgKGl0ZW06IEJvb21TZXJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiBpdGVtLnZhbHVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtczogQm9vbVNlcmllc1tdID0gY2xhc3NpZnlbbWF4X2lkLnRvU3RyaW5nKCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gaXRlbXNbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VuICAgPSBpdGVtc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV0sIChpdGVtOiBCb29tU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlIDwgaXRlbS52YWx1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZW4gPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jb2xvcl9iZyAgICAgID0gY2hvb3Nlbi5jb2xvcl9iZztcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jb2xvcl90ZXh0ICAgID0gY2hvb3Nlbi5jb2xvcl90ZXh0O1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmRpc3BsYXlfdmFsdWUgPSBjaG9vc2VuLmRpc3BsYXlfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwubGluayAgICAgICAgICA9IGNob29zZW4ubGluaztcbiAgICAgICAgICAgICAgICAgICAgY2VsbC52YWx1ZSAgICAgICAgID0gY2hvb3Nlbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5oaWRkZW4gICAgICAgID0gY2hvb3Nlbi5oaWRkZW47XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICBfLmVhY2gobWF0Y2hlZF9pdGVtcywgKGl0ZW06IEJvb21TZXJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaXRlbXMucHVzaChpdGVtLnRvQm9vbUNlbGxEZXRhaWxzKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC50b29sdGlwICs9IGl0ZW0udG9vbHRpcCArICc8YnI+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5kaXNwbGF5X3ZhbHVlICs9IFwiOiBcIiArIHZhbHVlcy5qb2luKCd8Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbHMucHVzaChjZWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJvd19jb2xfY2VsbHMucHVzaChjb2xzKTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb2xzX2ZvdW5kLFxuICAgICAgICByb3dfY29sX2NlbGxzLFxuICAgICAgICByb3dzX2ZvdW5kLFxuICAgICAgICByb3dzX3dpdGhvdXRfdG9rZW4sXG4gICAgfTtcbn07XG5cbmNvbnN0IHJlbW92ZUhpZGRlbkNvbEZyb21UYWJsZSA9IGZ1bmN0aW9uKGJvb210YWJsZWRhdGE6IElCb29tVGFibGUsIG5lZWRfaGlkZGVuczogc3RyaW5nW10pe1xuICAgIGxldCBjb2xzX2ZvdW5kID0gYm9vbXRhYmxlZGF0YS5jb2xzX2ZvdW5kO1xuICAgIGZvciAobGV0IGNvbCBvZiBuZWVkX2hpZGRlbnMpIHtcbiAgICAgICAgbGV0IGlkeCA9IGNvbHNfZm91bmQuaW5kZXhPZihjb2wpO1xuICAgICAgICBpZiAoaWR4ICE9PSAtMSApe1xuICAgICAgICAgICAgY29sc19mb3VuZC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBib29tdGFibGVkYXRhLmNvbHNfZm91bmQgPSBjb2xzX2ZvdW5kO1xufTtcblxuY29uc3QgdXBkYXRlU29ydENvbElkeEZvclRhYmxlID0gZnVuY3Rpb24oYm9vbXRhYmxlZGF0YTogSUJvb21UYWJsZSwgc29ydGluZ19wcm9wczogYW55KXtcbiAgICAvLyBjb25zb2xlLmxvZyhib29tdGFibGVkYXRhLmNvbHNfZm91bmQgKyBcInxcIiArIHNvcnRpbmdfcHJvcHMuc29ydF9jb2x1bW4pO1xuICAgIGlmIChzb3J0aW5nX3Byb3BzLnNvcnRfY29sdW1uICE9PSB1bmRlZmluZWQgJiYgc29ydGluZ19wcm9wcy5zb3J0X2NvbHVtbiAhPT0gXCJcIil7XG4gICAgICAgIGxldCBpZHggPSBib29tdGFibGVkYXRhLmNvbHNfZm91bmQuaW5kZXhPZihzb3J0aW5nX3Byb3BzLnNvcnRfY29sdW1uKTtcbiAgICAgICAgaWYgKGlkeCAhPT0gLTEpe1xuICAgICAgICAgICAgc29ydGluZ19wcm9wcy5jb2xfaW5kZXggPSBpZHg7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldCBzb3J0IGNvbCBpZHggdG8gXCIgKyBpZHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChzb3J0aW5nX3Byb3BzLmNvbF9pbmRleCA+PSBib29tdGFibGVkYXRhLmNvbHNfZm91bmQubGVuZ3RoICl7XG4gICAgICAgIHNvcnRpbmdfcHJvcHMuY29sX2luZGV4ID0gLTE7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0UGF0dGVybixcbiAgICBzZXJpZXNUb1RhYmxlLFxuICAgIHJlbW92ZUhpZGRlbkNvbEZyb21UYWJsZSxcbiAgICB1cGRhdGVTb3J0Q29sSWR4Rm9yVGFibGUsXG59O1xuIl19