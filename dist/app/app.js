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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFNTSxjQUFjLEdBQUcsSUFBSSxtQkFBVyxDQUFDO2dCQUNuQyxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixrQkFBa0IsRUFBRSwyQkFBMkI7Z0JBQy9DLG9CQUFvQixFQUFFLEVBQUU7Z0JBQ3hCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxRQUFRLEVBQUUsQ0FBQztnQkFDWCxTQUFTLEVBQUUsR0FBRztnQkFDZCwwQkFBMEIsRUFBRSxLQUFLO2dCQUNqQyxVQUFVLEVBQUUsRUFBRTtnQkFDZCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNULElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixjQUFjLEVBQUUsT0FBTztnQkFDdkIsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLE9BQU8sRUFBRSxHQUFHO2dCQUNaLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixvQkFBb0IsRUFBRSwyQkFBMkI7Z0JBQ2pELFVBQVUsRUFBRSxPQUFPO2dCQUNuQixxQkFBcUIsRUFBRSxFQUFFO2dCQUN6QixnQkFBZ0IsRUFBRSx5QkFBeUI7Z0JBQzNDLDBCQUEwQixFQUFFLGVBQWU7Z0JBQzNDLFNBQVMsRUFBRSxLQUFLO2FBQ25CLENBQUMsQ0FBQzs7WUFFRyxhQUFhLEdBQUcsVUFBVSxTQUF1QixFQUFFLE9BQXdDLEVBQUUsWUFBOEI7Z0JBQzdILElBQUksVUFBVSxHQUFHLGdCQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsUUFBUSxF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b0JBQXpCLElBQUksR0FBRyxxQkFBQTtvQkFDUixJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDWixVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDN0I7aUJBQ0o7Z0JBQ0QsYUFBYSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDMUMsQ0FBQyxDQUFDOztZQUVJLHdCQUF3QixHQUFHLFVBQVMsYUFBeUIsRUFBRSxhQUFrQjtnQkFFbkYsSUFBSSxhQUFhLENBQUMsV0FBVyxLQUFLLFNBQVMsSUFBSSxhQUFhLENBQUMsV0FBVyxLQUFLLEVBQUUsRUFBQztvQkFDNUUsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUN0RSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQzt3QkFDWCxhQUFhLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQzt3QkFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FBQztxQkFDN0M7aUJBQ0o7Z0JBQ0QsSUFBSSxhQUFhLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO29CQUM1RCxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNoQztZQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IEJvb21TZXJpZXMsIElCb29tQ2VsbERldGFpbHMsIElCb29tVGFibGUsIElCb29tVGFibGVUcmFuc2Zvcm1hdGlvbk9wdGlvbnMgfSBmcm9tIFwiLi9ib29tL2luZGV4XCI7XG5pbXBvcnQgeyBCb29tUGF0dGVybiwgcmVwbGFjZVRva2VucyB9IGZyb20gJy4vYm9vbS9pbmRleCc7XG5pbXBvcnQgeyBtdWx0aVZhbHVlU2hvd1ByaW9yaXRpZXMsIGNvbHVtblNvcnRUeXBlcyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IEJvb21QYXR0ZXJuRGF0YXMgfSBmcm9tICcuL2Jvb20vQm9vbVBhdHRlcm5EYXRhJztcblxuY29uc3QgZGVmYXVsdFBhdHRlcm4gPSBuZXcgQm9vbVBhdHRlcm4oe1xuICAgIGJnQ29sb3JzOiBcImdyZWVufG9yYW5nZXxyZWRcIixcbiAgICBiZ0NvbG9yc19vdmVycmlkZXM6IFwiMC0+Z3JlZW58Mi0+cmVkfDEtPnllbGxvd1wiLFxuICAgIGNsaWNrYWJsZV9jZWxsc19saW5rOiBcIlwiLFxuICAgIGNvbF9uYW1lOiBcIlZhbHVlXCIsXG4gICAgZGF0YXM6IFtdLFxuICAgIGRlY2ltYWxzOiAyLFxuICAgIGRlbGltaXRlcjogXCIuXCIsXG4gICAgZW5hYmxlX2ZpbHRlcmVkX3RocmVzaG9sZHM6IGZhbHNlLFxuICAgIGZpeGVkX3Jvd3M6IFtdLFxuICAgIGZvcm1hdDogXCJub25lXCIsXG4gICAgaW5kZXg6IC0xLFxuICAgIG5hbWU6IFwiRGVmYXVsdCBQYXR0ZXJuXCIsXG4gICAgbnVsbF9jb2xvcjogXCJkYXJrcmVkXCIsXG4gICAgbnVsbF90ZXh0Y29sb3I6IFwid2hpdGVcIixcbiAgICBudWxsX3ZhbHVlOiBcIk5vIGRhdGFcIixcbiAgICBwYXR0ZXJuOiBcIipcIixcbiAgICByb3dfbmFtZTogXCJfc2VyaWVzX1wiLFxuICAgIHRleHRDb2xvcjogXCJyZWR8b3JhbmdlfGdyZWVuXCIsXG4gICAgdGV4dENvbG9yc19vdmVycmlkZXM6IFwiMC0+cmVkfDItPmdyZWVufDEtPnllbGxvd1wiLFxuICAgIHRocmVzaG9sZHM6IFwiNzAsOTBcIixcbiAgICB0aW1lX2Jhc2VkX3RocmVzaG9sZHM6IFtdLFxuICAgIHRyYW5zZm9ybV92YWx1ZXM6IFwiX3ZhbHVlX3xfdmFsdWVffF92YWx1ZV9cIixcbiAgICB0cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlczogXCIwLT5kb3dufDEtPnVwXCIsXG4gICAgdmFsdWVOYW1lOiBcImF2Z1wiLFxufSk7XG5cbmNvbnN0IHNlcmllc1RvVGFibGUgPSBmdW5jdGlvbiAoaW5wdXRkYXRhOiBCb29tU2VyaWVzW10sIG9wdGlvbnM6IElCb29tVGFibGVUcmFuc2Zvcm1hdGlvbk9wdGlvbnMsIHBhdHRlcm5EYXRhczogQm9vbVBhdHRlcm5EYXRhcyk6IElCb29tVGFibGUge1xuICAgIGxldCByb3dzX2ZvdW5kID0gXy51bmlxKF8udW5pcShfLm1hcChpbnB1dGRhdGEsIChkOiB7IHJvd19uYW1lOiBhbnk7IH0pID0+IGQucm93X25hbWUpKS5jb25jYXQocGF0dGVybkRhdGFzLmdldEZpeGVkUm93cygpKSk7XG4gICAgbGV0IHJvd3Nfd2l0aG91dF90b2tlbiA9IF8udW5pcShfLm1hcChpbnB1dGRhdGEsIChkOiB7IHJvd19uYW1lX3JhdzogYW55OyB9KSA9PiBkLnJvd19uYW1lX3JhdykpO1xuICAgIGxldCBjb2xzX2ZvdW5kOiBzdHJpbmdbXSA9IF8udW5pcShfLnVuaXEoXy5tYXAoaW5wdXRkYXRhLCAoZDogeyBjb2xfbmFtZTogYW55OyB9KSA9PiBkLmNvbF9uYW1lKSkuY29uY2F0KHBhdHRlcm5EYXRhcy5nZXRGaXhlZENvbHMoKSkpO1xuICAgIGxldCByb3dfY29sX2NlbGxzOiBJQm9vbUNlbGxEZXRhaWxzW11bXSA9IFtdO1xuICAgIGNvbHNfZm91bmQgPSBjb2xzX2ZvdW5kLnNvcnQoKTtcbiAgICBpZiAob3B0aW9ucy5jb2xzX3NvcnRfdHlwZSA9PT0gY29sdW1uU29ydFR5cGVzWzFdKXtcbiAgICAgICAgY29sc19mb3VuZCA9IGNvbHNfZm91bmQucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBfLmVhY2gocm93c19mb3VuZCwgKHJvd19uYW1lOiBhbnkpID0+IHtcbiAgICAgICAgbGV0IGNvbHM6IElCb29tQ2VsbERldGFpbHNbXSA9IFtdO1xuICAgICAgICBfLmVhY2goY29sc19mb3VuZCwgKGNvbF9uYW1lOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBtYXRjaGVkX2l0ZW1zOiBCb29tU2VyaWVzW10gPSBfLmZpbHRlcihpbnB1dGRhdGEsIChvOiB7IHJvd19uYW1lOiBhbnk7IGNvbF9uYW1lOiBhbnk7IGhpZGRlbjogYW55IH0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5yb3dfbmFtZSA9PT0gcm93X25hbWUgJiYgby5jb2xfbmFtZSA9PT0gY29sX25hbWUgJiYgby5oaWRkZW4gPT09IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoZWRfaXRlbXMgfHwgbWF0Y2hlZF9pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xfbmFtZVwiOiBjb2xfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl9iZ1wiOiBvcHRpb25zLm5vbl9tYXRjaGluZ19jZWxsc19jb2xvcl9iZyxcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl90ZXh0XCI6IG9wdGlvbnMubm9uX21hdGNoaW5nX2NlbGxzX2NvbG9yX3RleHQsXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheV92YWx1ZVwiOiByZXBsYWNlVG9rZW5zKG9wdGlvbnMubm9uX21hdGNoaW5nX2NlbGxzX3RleHQpLFxuICAgICAgICAgICAgICAgICAgICBcImhpZGRlblwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICBcInJvd19uYW1lXCI6IHJvd19uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInRvb2x0aXBcIjogXCItXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogTmFOLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29scy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVkX2l0ZW1zICYmIG1hdGNoZWRfaXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgY29scy5wdXNoKG1hdGNoZWRfaXRlbXNbMF0udG9Cb29tQ2VsbERldGFpbHMoKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoZWRfaXRlbXMgJiYgbWF0Y2hlZF9pdGVtcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBtYXRjaGVkX2l0ZW1zWzBdO1xuICAgICAgICAgICAgICAgIGxldCBjZWxsOiBJQm9vbUNlbGxEZXRhaWxzID0ge1xuICAgICAgICAgICAgICAgICAgICBcImNvbF9uYW1lXCI6IGNvbF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcImNvbG9yX2JnXCI6IFwiZGFya3JlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImNvbG9yX3RleHRcIjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXlfdmFsdWVcIjogXCJEdXBsaWNhdGUgbWF0Y2hlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcImhpZGRlblwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICBcInJvd19uYW1lXCI6IHJvd19uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcInRvb2x0aXBcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBOYU4sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgcGF0dGVybiA9IHBhdHRlcm5EYXRhcy5nZXRQYXR0ZXJuKGl0ZW0ucGF0dGVybl9pZC52YWx1ZU9mKCkpO1xuICAgICAgICAgICAgICAgIGxldCBjbGFzc2lmeSA9IHt9O1xuICAgICAgICAgICAgICAgIGxldCBtaW5faWQgPSBpdGVtLmNvbG9yX2JnX2lkO1xuICAgICAgICAgICAgICAgIGxldCBtYXhfaWQgPSBpdGVtLmNvbG9yX2JnX2lkO1xuICAgICAgICAgICAgICAgIGxldCBjaG9vc2VuOiBCb29tU2VyaWVzID0gaXRlbTtcbiAgICAgICAgICAgICAgICBpZiAocGF0dGVybi5lbmFibGVfbXVsdGl2YWx1ZV9jZWxscykge1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChtYXRjaGVkX2l0ZW1zLCAoaXRlbTogQm9vbVNlcmllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5pdGVtcy5wdXNoKGl0ZW0udG9Cb29tQ2VsbERldGFpbHMoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnRvb2x0aXAgKz0gaXRlbS50b29sdGlwICsgJzxicj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbl9pZCA+IGl0ZW0uY29sb3JfYmdfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5faWQgPSBpdGVtLmNvbG9yX2JnX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1heF9pZCA8IGl0ZW0uY29sb3JfYmdfaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heF9pZCA9IGl0ZW0uY29sb3JfYmdfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGNsYXNzaWZ5W2l0ZW0uY29sb3JfYmdfaWQudG9TdHJpbmcoKV0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzaWZ5W2l0ZW0uY29sb3JfYmdfaWQudG9TdHJpbmcoKV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzaWZ5W2l0ZW0uY29sb3JfYmdfaWQudG9TdHJpbmcoKV0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuLm11bHRpX3ZhbHVlX3Nob3dfcHJpb3JpdHkgPT09IG11bHRpVmFsdWVTaG93UHJpb3JpdGllc1swXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbXM6IEJvb21TZXJpZXNbXSA9IGNsYXNzaWZ5W21pbl9pZC50b1N0cmluZygpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGl0ZW1zWzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiAgID0gaXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goY2xhc3NpZnlbbWF4X2lkLnRvU3RyaW5nKCldLCAoaXRlbTogQm9vbVNlcmllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+IGl0ZW0udmFsdWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VuID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1zOiBCb29tU2VyaWVzW10gPSBjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtc1swXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZW4gICA9IGl0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGNsYXNzaWZ5W21heF9pZC50b1N0cmluZygpXSwgKGl0ZW06IEJvb21TZXJpZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPCBpdGVtLnZhbHVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbG9yX2JnICAgICAgPSBjaG9vc2VuLmNvbG9yX2JnO1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbG9yX3RleHQgICAgPSBjaG9vc2VuLmNvbG9yX3RleHQ7XG4gICAgICAgICAgICAgICAgICAgIGNlbGwuZGlzcGxheV92YWx1ZSA9IGNob29zZW4uZGlzcGxheV92YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5saW5rICAgICAgICAgID0gY2hvb3Nlbi5saW5rO1xuICAgICAgICAgICAgICAgICAgICBjZWxsLnZhbHVlICAgICAgICAgPSBjaG9vc2VuLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmhpZGRlbiAgICAgICAgPSBjaG9vc2VuLmhpZGRlbjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChtYXRjaGVkX2l0ZW1zLCAoaXRlbTogQm9vbVNlcmllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5pdGVtcy5wdXNoKGl0ZW0udG9Cb29tQ2VsbERldGFpbHMoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnRvb2x0aXAgKz0gaXRlbS50b29sdGlwICsgJzxicj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjZWxsLmRpc3BsYXlfdmFsdWUgKz0gXCI6IFwiICsgdmFsdWVzLmpvaW4oJ3wnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29scy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcm93X2NvbF9jZWxscy5wdXNoKGNvbHMpO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbHNfZm91bmQsXG4gICAgICAgIHJvd19jb2xfY2VsbHMsXG4gICAgICAgIHJvd3NfZm91bmQsXG4gICAgICAgIHJvd3Nfd2l0aG91dF90b2tlbixcbiAgICB9O1xufTtcblxuY29uc3QgcmVtb3ZlSGlkZGVuQ29sRnJvbVRhYmxlID0gZnVuY3Rpb24oYm9vbXRhYmxlZGF0YTogSUJvb21UYWJsZSwgbmVlZF9oaWRkZW5zOiBzdHJpbmdbXSl7XG4gICAgbGV0IGNvbHNfZm91bmQgPSBib29tdGFibGVkYXRhLmNvbHNfZm91bmQ7XG4gICAgZm9yIChsZXQgY29sIG9mIG5lZWRfaGlkZGVucykge1xuICAgICAgICBsZXQgaWR4ID0gY29sc19mb3VuZC5pbmRleE9mKGNvbCk7XG4gICAgICAgIGlmIChpZHggIT09IC0xICl7XG4gICAgICAgICAgICBjb2xzX2ZvdW5kLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGJvb210YWJsZWRhdGEuY29sc19mb3VuZCA9IGNvbHNfZm91bmQ7XG59O1xuXG5jb25zdCB1cGRhdGVTb3J0Q29sSWR4Rm9yVGFibGUgPSBmdW5jdGlvbihib29tdGFibGVkYXRhOiBJQm9vbVRhYmxlLCBzb3J0aW5nX3Byb3BzOiBhbnkpe1xuICAgIC8vIGNvbnNvbGUubG9nKGJvb210YWJsZWRhdGEuY29sc19mb3VuZCArIFwifFwiICsgc29ydGluZ19wcm9wcy5zb3J0X2NvbHVtbik7XG4gICAgaWYgKHNvcnRpbmdfcHJvcHMuc29ydF9jb2x1bW4gIT09IHVuZGVmaW5lZCAmJiBzb3J0aW5nX3Byb3BzLnNvcnRfY29sdW1uICE9PSBcIlwiKXtcbiAgICAgICAgbGV0IGlkeCA9IGJvb210YWJsZWRhdGEuY29sc19mb3VuZC5pbmRleE9mKHNvcnRpbmdfcHJvcHMuc29ydF9jb2x1bW4pO1xuICAgICAgICBpZiAoaWR4ICE9PSAtMSl7XG4gICAgICAgICAgICBzb3J0aW5nX3Byb3BzLmNvbF9pbmRleCA9IGlkeDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0IHNvcnQgY29sIGlkeCB0byBcIiArIGlkeCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNvcnRpbmdfcHJvcHMuY29sX2luZGV4ID49IGJvb210YWJsZWRhdGEuY29sc19mb3VuZC5sZW5ndGggKXtcbiAgICAgICAgc29ydGluZ19wcm9wcy5jb2xfaW5kZXggPSAtMTtcbiAgICB9XG59O1xuXG5leHBvcnQge1xuICAgIGRlZmF1bHRQYXR0ZXJuLFxuICAgIHNlcmllc1RvVGFibGUsXG4gICAgcmVtb3ZlSGlkZGVuQ29sRnJvbVRhYmxlLFxuICAgIHVwZGF0ZVNvcnRDb2xJZHhGb3JUYWJsZSxcbn07XG4iXX0=