System.register(["lodash", "./index", "./BoomSeries", "./BoomPattern", "../config", "./BoomUtils"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, index_1, index_2, BoomSeries_1, BoomPattern_1, config_1, BoomUtils_1, BoomDriver;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
                index_2 = index_1_1;
            },
            function (BoomSeries_1_1) {
                BoomSeries_1 = BoomSeries_1_1;
            },
            function (BoomPattern_1_1) {
                BoomPattern_1 = BoomPattern_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (BoomUtils_1_1) {
                BoomUtils_1 = BoomUtils_1_1;
            }
        ],
        execute: function () {
            BoomDriver = (function () {
                function BoomDriver(ctrl) {
                    this.patterns = {};
                    this.columns = {};
                    this.series = [];
                    this.boomSeries = [];
                    this.ctrl = ctrl;
                    this.panel = ctrl.panel;
                }
                BoomDriver.prototype.registerPatterns = function () {
                    var _this = this;
                    this.patterns = {};
                    this.panel.defaultPattern.id = -1;
                    this.registerPattern(this.panel.defaultPattern);
                    var id = 0;
                    lodash_1.default.each(this.panel.patterns, function (pt) {
                        pt.id = id;
                        _this.registerPattern(pt);
                        id += 1;
                    });
                    this._resetColumnsFromPatterns();
                };
                BoomDriver.prototype.registerPattern = function (pattern) {
                    var data = this.patterns[pattern.id];
                    if (data === undefined) {
                        data = new index_1.BoomPatternData(pattern);
                        this.patterns[pattern.id] = data;
                    }
                    return data;
                };
                BoomDriver.prototype.feedSeries = function (seriesData) {
                    var _this = this;
                    this.series = seriesData;
                    this.boomSeries = this.series.map(function (seriesData) {
                        var seriesOptions = {
                            debug_mode: _this.panel.debug_mode,
                            row_col_wrapper: _this.panel.row_col_wrapper || "_"
                        };
                        return new BoomSeries_1.BoomSeries(seriesData, _this.panel, _this, seriesOptions, _this.ctrl.templateSrv, _this.ctrl.timeSrv);
                    });
                    this._addColumnsFromBoomSeries();
                };
                BoomDriver.prototype.genTableData = function () {
                    var options = {
                        cols_sort_type: this.panel.cols_sort_type === config_1.columnSortTypes[1] ? config_1.columnSortTypes[1] : config_1.columnSortTypes[0],
                        non_matching_cells_color_bg: this.panel.non_matching_cells_color_bg,
                        non_matching_cells_color_text: this.panel.non_matching_cells_color_text,
                        non_matching_cells_text: this.panel.non_matching_cells_text,
                    };
                    this.boomTable = this._boomSeriesToTable(options);
                    this._updateSortColIdxForTable();
                    this._removeHiddenColFromTable();
                };
                BoomDriver.prototype._validateTableStyles = function () {
                    var huh = Number(this.panel.header_unit_height);
                    var huw = Number(this.panel.header_unit_width);
                    var hup = Number(this.panel.header_unit_padding);
                    var buh = Number(this.panel.body_unit_height);
                    var buw = Number(this.panel.body_unit_width);
                    var bup = Number(this.panel.body_unit_padding);
                    var huf_sz = this.panel.header_font_size || "1rem";
                    var huf_sc = Number(this.panel.header_font_scale);
                    var buf_sz = this.panel.body_font_size || "1rem";
                    var buf_sc = Number(this.panel.body_font_scale);
                    var cols = this.boomTable.cols_found.length;
                    var rows = this.boomTable.rows_found.length;
                    var huf_block = "";
                    var buf_block = "";
                    var huf_overflow = "";
                    var buf_overflow = "";
                    if (isNaN(huh)) {
                        huh = -1;
                    }
                    if (isNaN(huw)) {
                        huw = -1;
                    }
                    if (isNaN(hup)) {
                        hup = -1;
                    }
                    if (isNaN(buh)) {
                        buh = -1;
                    }
                    if (isNaN(buw)) {
                        buw = -1;
                    }
                    if (isNaN(bup)) {
                        bup = -1;
                    }
                    if (isNaN(huf_sc)) {
                        huf_sc = -1;
                    }
                    if (isNaN(buf_sc)) {
                        buf_sc = -1;
                    }
                    var tw = 0;
                    var th = 0;
                    {
                        if (bup > 0) {
                            if (buh < (bup * 2)) {
                                buh = bup * 2;
                            }
                            if (buw < (bup * 2)) {
                                buw = bup * 2;
                            }
                        }
                        if (buh > -1) {
                            th = buh;
                            th = (th + 1) * cols - 1;
                        }
                        if (buw > -1) {
                            tw = buw;
                            tw = (tw + 1) * cols - 1;
                        }
                        if (hup > 0) {
                            if (huh < (hup * 2)) {
                                huh = hup * 2;
                            }
                            if (huw < (hup * 2)) {
                                huw = hup * 2;
                            }
                        }
                        if (huh > -1) {
                            th = huh;
                            th = (th + 1) * cols - 1;
                        }
                        if (huw > -1) {
                            tw = huw;
                            tw = (tw + 1) * cols - 1;
                        }
                    }
                    var huf_style = "";
                    var buf_style = "";
                    {
                        if (huf_sz === "" || undefined) {
                            huf_sz = "1rem";
                        }
                        if (buf_sz === "" || undefined) {
                            buf_sz = "1rem";
                        }
                        huf_style = "font-size:" + huf_sz + ";";
                        buf_style = "font-size:" + buf_sz + ";";
                        if (!isNaN(huf_sc) && huf_sc > 0) {
                            huf_style += "transform:scale(" + huf_sc + ") !important;";
                            huf_block = "display:block;";
                            huf_overflow = "overflow: hidden;";
                        }
                        if (!isNaN(buf_sc) && buf_sc > 0) {
                            buf_style += "transform:scale(" + buf_sc + ") !important;";
                            buf_block = "display:block;";
                            buf_overflow = "overflow: hidden;";
                        }
                    }
                    this.tb_styles = {
                        columns: cols,
                        rows: rows,
                        height: th,
                        width: tw,
                        height_style: th < 1 ? "" : "height:" + th + "px",
                        width_style: tw < 1 ? "" : "width:" + (tw / 0.89) + "px",
                        header_unit_width: huw,
                        header_unit_height: huh,
                        header_unit_padding: hup,
                        body_unit_width: buw,
                        body_unit_height: buh,
                        body_unit_padding: bup,
                        head_font_size: huf_sz,
                        head_font_scale: huf_sc,
                        body_font_size: buf_sz,
                        body_font_scale: buf_sc,
                        header_unit_width_style: huw < 0 ? "" : "width:" + (huw) + "px;",
                        header_unit_height_style: huh < 0 ? "" : "height:" + (huh) + "px;",
                        header_unit_padding_style: hup < 0 ? "" : "padding:" + (hup) + "px;",
                        body_unit_width_style: buw < 0 ? "" : "width:" + (buw) + "px;",
                        body_unit_height_style: buh < 0 ? "" : "height:" + (buh) + "px;",
                        body_unit_padding_style: bup < 0 ? "" : "padding:" + (bup) + "px;",
                        header_font_style: huf_style + huf_block + huf_overflow,
                        body_font_style: buf_style + buf_block + buf_overflow,
                    };
                };
                BoomDriver.prototype.renderHtml = function () {
                    this._validateTableStyles();
                    var options = {
                        default_title_for_rows: this.panel.default_title_for_rows || config_1.config.default_title_for_rows,
                        first_column_link: this.panel.first_column_link || "#",
                        hide_first_column: this.panel.hide_first_column,
                        hide_headers: this.panel.hide_headers,
                        text_alignment_firstcolumn: this.panel.text_alignment_firstcolumn,
                        text_alignment_values: this.panel.text_alignment_values,
                        table_styles: this.tb_styles,
                    };
                    this.boomRender = new index_2.BoomRender(options);
                    this.boomHtml = this.boomRender.getDataAsHTML(this.boomTable, this.panel.sorting_props);
                    this.boomHtmld = { body: "" };
                    if (this.panel.debug_mode) {
                        this.boomHtmld = this.boomRender.getDataAsDebugHTML(this.boomTable);
                    }
                };
                BoomDriver.prototype.getPatternData = function (idx) {
                    return this.patterns[idx];
                };
                BoomDriver.prototype.getPattern = function (idx) {
                    return this.getPatternData(idx).pattern;
                };
                BoomDriver.prototype.getShowColumns = function () {
                    var _this = this;
                    if (this.boomTable === undefined) {
                        return [];
                    }
                    return this.boomTable.cols_found.map(function (col) {
                        col = _this.columns[col].show;
                        return _this.ctrl.$sce.trustAsHtml(col);
                    });
                };
                BoomDriver.prototype.getFixedRows = function () {
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
                BoomDriver.prototype.getFixedCols = function () {
                    var ret = [];
                    lodash_1.default.each(this.patterns, function (data) {
                        lodash_1.default.each(data.pattern.fixed_cols, function (col) {
                            if (col.name !== "") {
                                ret.push(col.name);
                            }
                        });
                    });
                    ret = lodash_1.default.uniq(ret, function (item) { return item; });
                    return ret;
                };
                BoomDriver.prototype.getTableWidth = function () {
                    var pd = Number(this.panel.table_unit_padding);
                    var uw = Number(this.panel.table_unit_width);
                    if (isNaN(pd)) {
                        pd = 0;
                    }
                    if (isNaN(uw)) {
                        uw = 0;
                    }
                    if (uw < (pd * 2)) {
                        uw = pd * 2;
                    }
                    if (pd < 1 && uw < 1) {
                        return 0;
                    }
                    uw += 2;
                    var col_num = this.boomTable.cols_found.length;
                    console.log(col_num, pd, uw);
                    return uw * col_num - col_num + 1;
                };
                BoomDriver.prototype.getTableHeight = function () {
                    var pd = Number(this.panel.table_unit_padding);
                    var uh = Number(this.panel.table_unit_height);
                    if (isNaN(pd)) {
                        pd = 0;
                    }
                    if (isNaN(uh)) {
                        uh = 0;
                    }
                    if (pd < 1 && uh < 1) {
                        return 0;
                    }
                    if (pd < 0) {
                        pd = 0;
                    }
                    if (uh < 0) {
                        uh = 0;
                    }
                    var col_num = this.boomTable.rows_found.length;
                    return (col_num - 1) + (col_num * (pd + uh));
                };
                BoomDriver.prototype.getTableWidthStyle = function () {
                    var w = this.getTableWidth();
                    return w > 0 ? "width:" + w + "px" : "";
                };
                BoomDriver.prototype.getTableHeightStyle = function () {
                    var h = this.getTableHeight();
                    return h > 0 ? "width:" + h + "px" : "";
                };
                BoomDriver.prototype._resetColumnsFromPatterns = function () {
                    var cols = {};
                    lodash_1.default.each(this.patterns, function (ptdata) {
                        lodash_1.default.each(ptdata.pattern.fixed_cols, function (fcol) {
                            if (fcol.name !== "" && cols[fcol.name] === undefined) {
                                var new_col = new BoomPattern_1.BoomFixedCol(fcol.name);
                                new_col.order = fcol.order !== "" ? fcol.order : fcol.name;
                                new_col.show = fcol.show !== "" ? fcol.show : fcol.name;
                                new_col.bg_color = fcol.bg_color;
                                new_col.text_color = fcol.text_color;
                                new_col.from = "pattern:" + ptdata.pattern.id;
                                cols[fcol.name] = new_col;
                            }
                        });
                    });
                    this.columns = cols;
                };
                BoomDriver.prototype._addColumnsFromBoomSeries = function () {
                    var cols = this.columns;
                    var cols_found = lodash_1.default.uniq(lodash_1.default.map(this.boomSeries, function (d) { return d.col_name; }));
                    lodash_1.default.each(cols_found, function (name) {
                        if (cols[name] === undefined) {
                            var new_col = new BoomPattern_1.BoomFixedCol(name);
                            new_col.order = name;
                            new_col.show = name;
                            cols[name] = new_col;
                        }
                    });
                };
                BoomDriver.prototype._getSortedColumns = function (sort_type) {
                    return lodash_1.default.map(this.columns, function (col) { return col; }).sort(function (a, b) {
                        return BoomUtils_1.boomSortFunc(a.order, b.order, sort_type);
                    });
                };
                BoomDriver.prototype._boomSeriesToTable = function (options) {
                    var _this = this;
                    var rows_found = lodash_1.default.uniq(lodash_1.default.uniq(lodash_1.default.map(this.boomSeries, function (d) { return d.row_name; })).concat(this.getFixedRows()));
                    var rows_without_token = lodash_1.default.uniq(lodash_1.default.map(this.boomSeries, function (d) { return d.row_name_raw; }));
                    var cols_found = this._getSortedColumns(options.cols_sort_type);
                    var row_col_cells = [];
                    lodash_1.default.each(rows_found, function (row_name) {
                        var cols = [];
                        lodash_1.default.each(cols_found, function (col) {
                            var col_name = col.name;
                            var matched_items = lodash_1.default.filter(_this.boomSeries, function (o) {
                                return o.row_name === row_name && o.col_name === col_name && o.hidden === false;
                            });
                            if (!matched_items || matched_items.length === 0) {
                                var cell = {
                                    "col_name": col_name,
                                    "color_bg": col.bg_color || options.non_matching_cells_color_bg,
                                    "color_text": col.text_color || options.non_matching_cells_color_text,
                                    "display_value": BoomUtils_1.replaceTokens(options.non_matching_cells_text),
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
                                var pattern = _this.getPattern(item.pattern_id.valueOf());
                                var classify_1 = {};
                                var min_id_1 = item.color_bg_id;
                                var max_id_1 = item.color_bg_id;
                                var choosen_1 = item;
                                if (pattern.enable_multivalue_cells) {
                                    lodash_1.default.each(matched_items, function (item) {
                                        cell_1.items.push(item.toBoomCellDetails());
                                        cell_1.tooltip += "<div style=\"font-size:12px;color:" + item.color_bg + ";text-align:left\">" + item.tooltip + '</div>';
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
                                        cell_1.tooltip += "<div style=\"font-size:12px;color:" + item.color_bg + ";text-align:left\">" + item.tooltip + '</div>';
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
                        cols_found: lodash_1.default.map(cols_found, function (col) { return col.name; }),
                        row_col_cells: row_col_cells,
                        rows_found: rows_found,
                        rows_without_token: rows_without_token,
                    };
                };
                BoomDriver.prototype._removeHiddenColFromTable = function () {
                    if (this.boomTable === undefined) {
                        return;
                    }
                    var cols_found = this.boomTable.cols_found;
                    for (var _i = 0, _a = this.panel.sorting_props; _i < _a.length; _i++) {
                        var col = _a[_i];
                        var idx = cols_found.indexOf(col);
                        if (idx !== -1) {
                            cols_found.splice(idx, 1);
                        }
                    }
                    this.boomTable.cols_found = cols_found;
                };
                BoomDriver.prototype._updateSortColIdxForTable = function () {
                    if (this.boomTable === undefined) {
                        return;
                    }
                    var sorting_props = this.panel.sorting_props;
                    if (sorting_props.sort_column !== undefined && sorting_props.sort_column !== "") {
                        var idx = this.boomTable.cols_found.indexOf(sorting_props.sort_column);
                        if (idx !== -1) {
                            sorting_props.col_index = idx;
                            console.log("set sort col idx to " + idx);
                        }
                    }
                    if (sorting_props.col_index >= this.boomTable.cols_found.length) {
                        sorting_props.col_index = -1;
                    }
                };
                return BoomDriver;
            }());
            exports_1("BoomDriver", BoomDriver);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbURyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvYm9vbS9Cb29tRHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVdBO2dCQVlJLG9CQUFZLElBQWU7b0JBVHBCLGFBQVEsR0FBb0MsRUFBRSxDQUFDO29CQUMvQyxZQUFPLEdBQXFDLEVBQUUsQ0FBQztvQkFDL0MsV0FBTSxHQUFVLEVBQUUsQ0FBQztvQkFDbkIsZUFBVSxHQUFpQixFQUFFLENBQUM7b0JBT2pDLElBQUksQ0FBQyxJQUFJLEdBQUksSUFBSSxDQUFDO29CQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzVCLENBQUM7Z0JBRU0scUNBQWdCLEdBQXZCO29CQUFBLGlCQVdDO29CQVZHLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDaEQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNYLGdCQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQUMsRUFBZTt3QkFDMUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7d0JBQ1gsS0FBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDekIsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDVixDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztnQkFDckMsQ0FBQztnQkFDTSxvQ0FBZSxHQUF0QixVQUF1QixPQUFvQjtvQkFDdkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxD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QyxDQUFDO3FCQUFFO29CQUdyQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNYO3dCQUNJLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTs0QkFDVCxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FBRSxHQUFHLEdBQUcsR0FBRyxHQUFDLENBQUMsQ0FBQzs2QkFBRTs0QkFDbkMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsR0FBRyxHQUFHLEdBQUcsR0FBQyxDQUFDLENBQUM7NkJBQUU7eUJBQ3RDO3dCQUNELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFDOzRCQUFFLEVBQUUsR0FBRyxHQUFHLENBQUM7NEJBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7eUJBQUU7d0JBQ3BELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFDOzRCQUFFLEVBQUUsR0FBRyxHQUFHLENBQUM7NEJBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7eUJBQUU7d0JBQ3BELElBQUksR0FBRyxHQUFHLENBQUMsRUFBQzs0QkFDUixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBRTtnQ0FBRSxHQUFHLEdBQUcsR0FBRyxHQUFDLENBQUMsQ0FBQzs2QkFBRTs0QkFDbkMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsR0FBRyxHQUFHLEdBQUcsR0FBQyxDQUFDLENBQUM7NkJBQUU7eUJBQ3RDO3dCQUNELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFDOzRCQUFFLEVBQUUsR0FBRyxHQUFHLENBQUM7NEJBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMs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QixHQUFqQztvQkFDSSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFDO3dCQUM3QixPQUFPO3FCQUNWO29CQUNELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO29CQUM3QyxJQUFJLGFBQWEsQ0FBQyxXQUFXLEtBQUssU0FBUyxJQUFJLGFBQWEsQ0FBQyxXQUFXLEtBQUssRUFBRSxFQUFDO3dCQUM1RSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUN2RSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQzs0QkFDWCxhQUFhLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQzs0QkFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FBQzt5QkFDN0M7cUJBQ0o7b0JBQ0QsSUFBSSxhQUFhLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTt3QkFDN0QsYUFBYSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDaEM7Z0JBQ0wsQ0FBQztnQkFDTCxpQkFBQztZQUFELENBQUMsQUEzYkQsSUEyYkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBCb29tUGF0dGVybkRhdGEsIElCb29tVGFibGVUcmFuc2Zvcm1hdGlvbk9wdGlvbnMsIElCb29tVGFibGUsIElCb29tQ2VsbERldGFpbHMgfSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHsgQm9vbVJlbmRlciwgSUJvb21IVE1MLCBJQm9vbVJlbmRlcmluZ09wdGlvbnMsIElCb29tVGFibGVTdHlsZXMgfSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHsgQm9vbVNlcmllcyB9IGZyb20gXCIuL0Jvb21TZXJpZXNcIjtcbmltcG9ydCB7IEJvb21QYXR0ZXJuIH0gZnJvbSBcIi4vQm9vbVBhdHRlcm5cIjtcbmltcG9ydCB7IElCb29tRml4ZWRSb3csIElCb29tRml4ZWRDb2wgfSBmcm9tIFwiLi9Cb29tLmludGVyZmFjZVwiO1xuaW1wb3J0IHsgQm9vbUZpeGVkQ29sIH0gZnJvbSBcIi4vQm9vbVBhdHRlcm5cIjtcbmltcG9ydCB7IFBhbmVsQ3RybCB9IGZyb20gXCIuLi8uLi9tb2R1bGVcIjtcbmltcG9ydCB7IGNvbHVtblNvcnRUeXBlcywgY29uZmlnLCBtdWx0aVZhbHVlU2hvd1ByaW9yaXRpZXMgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyByZXBsYWNlVG9rZW5zLCBib29tU29ydEZ1bmMgfSBmcm9tIFwiLi9Cb29tVXRpbHNcIjtcblxuY2xhc3MgQm9vbURyaXZlciB7XG4gICAgcHVibGljIGN0cmw6ICAgICBQYW5lbEN0cmw7XG4gICAgcHVibGljIHBhbmVsOiAgICBhbnk7XG4gICAgcHVibGljIHBhdHRlcm5zOiB7W2lkOiBudW1iZXJdOiBCb29tUGF0dGVybkRhdGF9ID0ge307XG4gICAgcHVibGljIGNvbHVtbnM6ICB7W25hbWU6IHN0cmluZ106IEJvb21GaXhlZENvbCB9ID0ge307XG4gICAgcHVibGljIHNlcmllczogICBhbnkgPSBbXTsgICAgICAgICAgICAgICAgICAvLyBzZXJpZXMgZnJvbSBpbnB1dCBxdWVyeSBkYXRhXG4gICAgcHVibGljIGJvb21TZXJpZXM6IEJvb21TZXJpZXNbXSA9IFtdOyAgICAgICAvLyBzZXJpZXMgd2l0Y2ggcGFyc2VkIGZyb20gaW5wdXQgc2VyaWVzXG4gICAgcHVibGljIGJvb21UYWJsZTogIElCb29tVGFibGUgICB8IHVuZGVmaW5lZDsgIC8vIGRhdGEgZ2VuZXJhdGVkIGZyb20gYm9vbVNlcmllc1xuICAgIHB1YmxpYyBib29tUmVuZGVyOiBCb29tUmVuZGVyICAgfCB1bmRlZmluZWQ7ICAvLyByZW5kZXIgdG8gcmVuZCBib29tVGFibGUgdG8gYm9vbUh0bWxcbiAgICBwdWJsaWMgYm9vbUh0bWw6ICAgSUJvb21IVE1MICAgIHwgdW5kZWZpbmVkOyAgLy8gdGhlIG91dHB1dCBodG1sIHJlc3VsdFxuICAgIHB1YmxpYyBib29tSHRtbGQ6ICBJQm9vbUhUTUwgICAgfCB1bmRlZmluZWQ7ICAvLyB0aGUgb3V0cHV0IGh0bWwgcmVzdWx0IG9mIGRlYnVnXG4gICAgcHVibGljIHRiX3N0eWxlczogSUJvb21UYWJsZVN0eWxlcyB8IHVuZGVmaW5lZDtcbiAgICBjb25zdHJ1Y3RvcihjdHJsOiBQYW5lbEN0cmwpe1xuICAgICAgICB0aGlzLmN0cmwgID0gY3RybDtcbiAgICAgICAgdGhpcy5wYW5lbCA9IGN0cmwucGFuZWw7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyUGF0dGVybnMoKXtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IHt9O1xuICAgICAgICB0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuLmlkID0gLTE7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJQYXR0ZXJuKHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4pO1xuICAgICAgICBsZXQgaWQgPSAwO1xuICAgICAgICBfLmVhY2godGhpcy5wYW5lbC5wYXR0ZXJucywgKHB0OiBCb29tUGF0dGVybikgPT4ge1xuICAgICAgICAgIHB0LmlkID0gaWQ7XG4gICAgICAgICAgdGhpcy5yZWdpc3RlclBhdHRlcm4ocHQpO1xuICAgICAgICAgIGlkICs9IDE7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9yZXNldENvbHVtbnNGcm9tUGF0dGVybnMoKTtcbiAgICB9XG4gICAgcHVibGljIHJlZ2lzdGVyUGF0dGVybihwYXR0ZXJuOiBCb29tUGF0dGVybik6IEJvb21QYXR0ZXJuRGF0YSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5wYXR0ZXJuc1twYXR0ZXJuLmlkXTtcbiAgICAgICAgaWYgKCBkYXRhID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgQm9vbVBhdHRlcm5EYXRhKHBhdHRlcm4pO1xuICAgICAgICAgICAgdGhpcy5wYXR0ZXJuc1twYXR0ZXJuLmlkXSA9IGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIGZlZWRTZXJpZXMoc2VyaWVzRGF0YTogYW55KSB7XG4gICAgICAgIHRoaXMuc2VyaWVzID0gc2VyaWVzRGF0YTtcblxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgICAgIHRoaXMuYm9vbVNlcmllcyA9IHRoaXMuc2VyaWVzLm1hcChzZXJpZXNEYXRhID0+IHtcbiAgICAgICAgICAgIGxldCBzZXJpZXNPcHRpb25zID0ge1xuICAgICAgICAgICAgICBkZWJ1Z19tb2RlOiAgICAgICB0aGlzLnBhbmVsLmRlYnVnX21vZGUsXG4gICAgICAgICAgICAgIHJvd19jb2xfd3JhcHBlcjogIHRoaXMucGFuZWwucm93X2NvbF93cmFwcGVyIHx8IFwiX1wiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCb29tU2VyaWVzKHNlcmllc0RhdGEsIHRoaXMucGFuZWwsIHRoaXMsIHNlcmllc09wdGlvbnMsIHRoaXMuY3RybC50ZW1wbGF0ZVNydiwgdGhpcy5jdHJsLnRpbWVTcnYpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9hZGRDb2x1bW5zRnJvbUJvb21TZXJpZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2VuVGFibGVEYXRhKCkge1xuICAgICAgICBsZXQgb3B0aW9uczogSUJvb21UYWJsZVRyYW5zZm9ybWF0aW9uT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGNvbHNfc29ydF90eXBlOiAgICAgICAgICAgICAgICAgdGhpcy5wYW5lbC5jb2xzX3NvcnRfdHlwZSA9PT0gY29sdW1uU29ydFR5cGVzWzFdID8gY29sdW1uU29ydFR5cGVzWzFdIDogY29sdW1uU29ydFR5cGVzWzBdLFxuICAgICAgICAgICAgbm9uX21hdGNoaW5nX2NlbGxzX2NvbG9yX2JnOiAgICB0aGlzLnBhbmVsLm5vbl9tYXRjaGluZ19jZWxsc19jb2xvcl9iZyxcbiAgICAgICAgICAgIG5vbl9tYXRjaGluZ19jZWxsc19jb2xvcl90ZXh0OiAgdGhpcy5wYW5lbC5ub25fbWF0Y2hpbmdfY2VsbHNfY29sb3JfdGV4dCxcbiAgICAgICAgICAgIG5vbl9tYXRjaGluZ19jZWxsc190ZXh0OiAgICAgICAgdGhpcy5wYW5lbC5ub25fbWF0Y2hpbmdfY2VsbHNfdGV4dCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ib29tVGFibGUgPSB0aGlzLl9ib29tU2VyaWVzVG9UYWJsZShvcHRpb25zKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU29ydENvbElkeEZvclRhYmxlKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhpZGRlbkNvbEZyb21UYWJsZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3ZhbGlkYXRlVGFibGVTdHlsZXMoKSB7XG4gICAgICAgIGxldCBodWg6IG51bWJlciAgICA9IE51bWJlcih0aGlzLnBhbmVsLmhlYWRlcl91bml0X2hlaWdodCk7XG4gICAgICAgIGxldCBodXc6IG51bWJlciAgICA9IE51bWJlcih0aGlzLnBhbmVsLmhlYWRlcl91bml0X3dpZHRoKTtcbiAgICAgICAgbGV0IGh1cDogbnVtYmVyICAgID0gTnVtYmVyKHRoaXMucGFuZWwuaGVhZGVyX3VuaXRfcGFkZGluZyk7XG4gICAgICAgIGxldCBidWg6IG51bWJlciAgICA9IE51bWJlcih0aGlzLnBhbmVsLmJvZHlfdW5pdF9oZWlnaHQpO1xuICAgICAgICBsZXQgYnV3OiBudW1iZXIgICAgPSBOdW1iZXIodGhpcy5wYW5lbC5ib2R5X3VuaXRfd2lkdGgpO1xuICAgICAgICBsZXQgYnVwOiBudW1iZXIgICAgPSBOdW1iZXIodGhpcy5wYW5lbC5ib2R5X3VuaXRfcGFkZGluZyk7XG4gICAgICAgIGxldCBodWZfc3o6IHN0cmluZyA9IHRoaXMucGFuZWwuaGVhZGVyX2ZvbnRfc2l6ZSB8fCBcIjFyZW1cIjtcbiAgICAgICAgbGV0IGh1Zl9zYzogbnVtYmVyID0gTnVtYmVyKHRoaXMucGFuZWwuaGVhZGVyX2ZvbnRfc2NhbGUpO1xuICAgICAgICBsZXQgYnVmX3N6OiBzdHJpbmcgPSB0aGlzLnBhbmVsLmJvZHlfZm9udF9zaXplICAgfHwgXCIxcmVtXCI7XG4gICAgICAgIGxldCBidWZfc2M6IG51bWJlciA9IE51bWJlcih0aGlzLnBhbmVsLmJvZHlfZm9udF9zY2FsZSk7XG4gICAgICAgIGxldCBjb2xzOiBudW1iZXIgPSB0aGlzLmJvb21UYWJsZSEuY29sc19mb3VuZC5sZW5ndGg7XG4gICAgICAgIGxldCByb3dzOiBudW1iZXIgPSB0aGlzLmJvb21UYWJsZSEucm93c19mb3VuZC5sZW5ndGg7XG4gICAgICAgIGxldCBodWZfYmxvY2sgPSBcIlwiO1xuICAgICAgICBsZXQgYnVmX2Jsb2NrID0gXCJcIjtcbiAgICAgICAgbGV0IGh1Zl9vdmVyZmxvdyA9IFwiXCI7XG4gICAgICAgIGxldCBidWZfb3ZlcmZsb3cgPSBcIlwiO1xuXG4gICAgICAgIGlmICggaXNOYU4oaHVoKSApIHsgaHVoID0gLTE7IH1cbiAgICAgICAgaWYgKCBpc05hTihodXcpICkgeyBodXcgPSAtMTsgfVxuICAgICAgICBpZiAoIGlzTmFOKGh1cCkgKSB7IGh1cCA9IC0xOyB9XG4gICAgICAgIGlmICggaXNOYU4oYnVoKSApIHsgYnVoID0gLTE7IH1cbiAgICAgICAgaWYgKCBpc05hTihidXcpICkgeyBidXcgPSAtMTsgfVxuICAgICAgICBpZiAoIGlzTmFOKGJ1cCkgKSB7IGJ1cCA9IC0xOyB9XG4gICAgICAgIGlmICggaXNOYU4oaHVmX3NjKSApIHsgaHVmX3NjID0gLTE7IH1cbiAgICAgICAgaWYgKCBpc05hTihidWZfc2MpICkgeyBidWZfc2MgPSAtMTsgfVxuXG4gICAgICAgIC8vIHZhbGlkYXRlIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAgICAgbGV0IHR3ID0gMDtcbiAgICAgICAgbGV0IHRoID0gMDtcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGJ1cCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoYnVoIDwgKGJ1cCoyKSkgeyBidWggPSBidXAqMjsgfVxuICAgICAgICAgICAgICAgIGlmIChidXcgPCAoYnVwKjIpKSB7IGJ1dyA9IGJ1cCoyOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVoID4gLTEpeyB0aCA9IGJ1aDsgdGggPSAodGggKyAxKSAqIGNvbHMgLSAxOyB9XG4gICAgICAgICAgICBpZiAoYnV3ID4gLTEpeyB0dyA9IGJ1dzsgdHcgPSAodHcgKyAxKSAqIGNvbHMgLSAxOyB9XG4gICAgICAgICAgICBpZiAoaHVwID4gMCl7XG4gICAgICAgICAgICAgICAgaWYgKGh1aCA8IChodXAqMikpIHsgaHVoID0gaHVwKjI7IH1cbiAgICAgICAgICAgICAgICBpZiAoaHV3IDwgKGh1cCoyKSkgeyBodXcgPSBodXAqMjsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGh1aCA+IC0xKXsgdGggPSBodWg7IHRoID0gKHRoICsgMSkgKiBjb2xzIC0gMTsgfVxuICAgICAgICAgICAgaWYgKGh1dyA+IC0xKXsgdHcgPSBodXc7IHR3ID0gKHR3ICsgMSkgKiBjb2xzIC0gMTsgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHZhbGlkYXRhIGZvbnQgc3R5bGVzXG4gICAgICAgIGxldCBodWZfc3R5bGUgPSBcIlwiO1xuICAgICAgICBsZXQgYnVmX3N0eWxlID0gXCJcIjtcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGh1Zl9zeiA9PT0gXCJcIiB8fCB1bmRlZmluZWQpIHsgaHVmX3N6ID0gXCIxcmVtXCI7IH1cbiAgICAgICAgICAgIGlmIChidWZfc3ogPT09IFwiXCIgfHwgdW5kZWZpbmVkKSB7IGJ1Zl9zeiA9IFwiMXJlbVwiOyB9XG5cbiAgICAgICAgICAgIGh1Zl9zdHlsZSA9IGBmb250LXNpemU6JHtodWZfc3p9O2A7XG4gICAgICAgICAgICBidWZfc3R5bGUgPSBgZm9udC1zaXplOiR7YnVmX3N6fTtgO1xuXG4gICAgICAgICAgICBpZiAoICFpc05hTihodWZfc2MpICYmIGh1Zl9zYyA+IDApe1xuICAgICAgICAgICAgICAgIGh1Zl9zdHlsZSAgICs9IGB0cmFuc2Zvcm06c2NhbGUoJHtodWZfc2N9KSAhaW1wb3J0YW50O2A7XG4gICAgICAgICAgICAgICAgaHVmX2Jsb2NrICAgID0gXCJkaXNwbGF5OmJsb2NrO1wiO1xuICAgICAgICAgICAgICAgIGh1Zl9vdmVyZmxvdyA9IFwib3ZlcmZsb3c6IGhpZGRlbjtcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggIWlzTmFOKGJ1Zl9zYykgJiYgYnVmX3NjID4gMCkge1xuICAgICAgICAgICAgICAgIGJ1Zl9zdHlsZSAgICs9IGB0cmFuc2Zvcm06c2NhbGUoJHtidWZfc2N9KSAhaW1wb3J0YW50O2A7XG4gICAgICAgICAgICAgICAgYnVmX2Jsb2NrICAgID0gXCJkaXNwbGF5OmJsb2NrO1wiO1xuICAgICAgICAgICAgICAgIGJ1Zl9vdmVyZmxvdyA9IFwib3ZlcmZsb3c6IGhpZGRlbjtcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRiX3N0eWxlcyA9IHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgICAgICBjb2x1bW5zICAgICAgICAgICAgOiBjb2xzLFxuICAgICAgICAgICAgcm93cyAgICAgICAgICAgICAgIDogcm93cyxcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgICAgICBoZWlnaHQgICAgICAgICAgICAgOiB0aCxcbiAgICAgICAgICAgIHdpZHRoICAgICAgICAgICAgICA6IHR3LFxuICAgICAgICAgICAgaGVpZ2h0X3N0eWxlICAgICAgIDogdGggPCAxID8gXCJcIiA6IFwiaGVpZ2h0OlwiICArIHRoICsgXCJweFwiLFxuICAgICAgICAgICAgd2lkdGhfc3R5bGUgICAgICAgIDogdHcgPCAxID8gXCJcIiA6IFwid2lkdGg6XCIgICArICh0dyAvIDAuODkpICsgXCJweFwiLFxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgICAgIGhlYWRlcl91bml0X3dpZHRoICA6IGh1dyxcbiAgICAgICAgICAgIGhlYWRlcl91bml0X2hlaWdodCA6IGh1aCxcbiAgICAgICAgICAgIGhlYWRlcl91bml0X3BhZGRpbmc6IGh1cCxcbiAgICAgICAgICAgIGJvZHlfdW5pdF93aWR0aCAgICA6IGJ1dyxcbiAgICAgICAgICAgIGJvZHlfdW5pdF9oZWlnaHQgICA6IGJ1aCxcbiAgICAgICAgICAgIGJvZHlfdW5pdF9wYWRkaW5nICA6IGJ1cCxcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgICAgICBoZWFkX2ZvbnRfc2l6ZSAgICAgOiBodWZfc3osXG4gICAgICAgICAgICBoZWFkX2ZvbnRfc2NhbGUgICAgOiBodWZfc2MsXG4gICAgICAgICAgICBib2R5X2ZvbnRfc2l6ZSAgICAgOiBidWZfc3osXG4gICAgICAgICAgICBib2R5X2ZvbnRfc2NhbGUgICAgOiBidWZfc2MsXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICAgICAgaGVhZGVyX3VuaXRfd2lkdGhfc3R5bGUgIDogaHV3IDwgMCA/IFwiXCIgOiBcIndpZHRoOlwiICAgKyAoaHV3KSArIFwicHg7XCIsXG4gICAgICAgICAgICBoZWFkZXJfdW5pdF9oZWlnaHRfc3R5bGUgOiBodWggPCAwID8gXCJcIiA6IFwiaGVpZ2h0OlwiICArIChodWgpICsgXCJweDtcIixcbiAgICAgICAgICAgIGhlYWRlcl91bml0X3BhZGRpbmdfc3R5bGU6IGh1cCA8IDAgPyBcIlwiIDogXCJwYWRkaW5nOlwiICsgKGh1cCkgKyBcInB4O1wiLFxuICAgICAgICAgICAgYm9keV91bml0X3dpZHRoX3N0eWxlICAgIDogYnV3IDwgMCA/IFwiXCIgOiBcIndpZHRoOlwiICAgKyAoYnV3KSArIFwicHg7XCIsXG4gICAgICAgICAgICBib2R5X3VuaXRfaGVpZ2h0X3N0eWxlICAgOiBidWggPCAwID8gXCJcIiA6IFwiaGVpZ2h0OlwiICArIChidWgpICsgXCJweDtcIixcbiAgICAgICAgICAgIGJvZHlfdW5pdF9wYWRkaW5nX3N0eWxlICA6IGJ1cCA8IDAgPyBcIlwiIDogXCJwYWRkaW5nOlwiICsgKGJ1cCkgKyBcInB4O1wiLFxuICAgICAgICAgICAgaGVhZGVyX2ZvbnRfc3R5bGUgICAgICAgIDogaHVmX3N0eWxlICsgaHVmX2Jsb2NrICsgaHVmX292ZXJmbG93LFxuICAgICAgICAgICAgYm9keV9mb250X3N0eWxlICAgICAgICAgIDogYnVmX3N0eWxlICsgYnVmX2Jsb2NrICsgYnVmX292ZXJmbG93LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXJIdG1sKCkge1xuICAgICAgICB0aGlzLl92YWxpZGF0ZVRhYmxlU3R5bGVzKCk7XG4gICAgICAgIGxldCBvcHRpb25zOiBJQm9vbVJlbmRlcmluZ09wdGlvbnMgPSB7XG4gICAgICAgICAgICBkZWZhdWx0X3RpdGxlX2Zvcl9yb3dzOiAgICAgdGhpcy5wYW5lbC5kZWZhdWx0X3RpdGxlX2Zvcl9yb3dzIHx8IGNvbmZpZy5kZWZhdWx0X3RpdGxlX2Zvcl9yb3dzLFxuICAgICAgICAgICAgZmlyc3RfY29sdW1uX2xpbms6ICAgICAgICAgIHRoaXMucGFuZWwuZmlyc3RfY29sdW1uX2xpbmsgfHwgXCIjXCIsXG4gICAgICAgICAgICBoaWRlX2ZpcnN0X2NvbHVtbjogICAgICAgICAgdGhpcy5wYW5lbC5oaWRlX2ZpcnN0X2NvbHVtbixcbiAgICAgICAgICAgIGhpZGVfaGVhZGVyczogICAgICAgICAgICAgICB0aGlzLnBhbmVsLmhpZGVfaGVhZGVycyxcbiAgICAgICAgICAgIHRleHRfYWxpZ25tZW50X2ZpcnN0Y29sdW1uOiB0aGlzLnBhbmVsLnRleHRfYWxpZ25tZW50X2ZpcnN0Y29sdW1uLFxuICAgICAgICAgICAgdGV4dF9hbGlnbm1lbnRfdmFsdWVzOiAgICAgIHRoaXMucGFuZWwudGV4dF9hbGlnbm1lbnRfdmFsdWVzLFxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgICAgIHRhYmxlX3N0eWxlczogICAgICAgICAgICAgICB0aGlzLnRiX3N0eWxlcyEsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5ib29tUmVuZGVyID0gbmV3IEJvb21SZW5kZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYm9vbUh0bWwgICA9IHRoaXMuYm9vbVJlbmRlci5nZXREYXRhQXNIVE1MKHRoaXMuYm9vbVRhYmxlLCB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMpO1xuICAgICAgICB0aGlzLmJvb21IdG1sZCAgPSB7Ym9keTogXCJcIn07XG4gICAgICAgIGlmICh0aGlzLnBhbmVsLmRlYnVnX21vZGUpe1xuICAgICAgICAgICAgdGhpcy5ib29tSHRtbGQgPSB0aGlzLmJvb21SZW5kZXIuZ2V0RGF0YUFzRGVidWdIVE1MKHRoaXMuYm9vbVRhYmxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQYXR0ZXJuRGF0YShpZHg6IG51bWJlcik6IEJvb21QYXR0ZXJuRGF0YSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdHRlcm5zW2lkeF07XG4gICAgfVxuICAgIHB1YmxpYyBnZXRQYXR0ZXJuKGlkeDogbnVtYmVyKTogQm9vbVBhdHRlcm57XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBhdHRlcm5EYXRhKGlkeCkucGF0dGVybjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U2hvd0NvbHVtbnMoKTogc3RyaW5nW117XG4gICAgICAgIGlmICh0aGlzLmJvb21UYWJsZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ib29tVGFibGUuY29sc19mb3VuZC5tYXAoKGNvbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb2wgPSB0aGlzLmNvbHVtbnNbY29sXS5zaG93O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3RybC4kc2NlLnRydXN0QXNIdG1sKGNvbCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGaXhlZFJvd3MoKTogc3RyaW5nW10ge1xuICAgICAgICBsZXQgcmV0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBfLmVhY2godGhpcy5wYXR0ZXJucywgKGRhdGE6IEJvb21QYXR0ZXJuRGF0YSkgPT4ge1xuICAgICAgICAgICAgXy5lYWNoKGRhdGEucGF0dGVybi5maXhlZF9yb3dzLCAocm93OiBJQm9vbUZpeGVkUm93KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJvdy5uYW1lICE9PSBcIlwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2gocm93Lm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0ID0gXy51bmlxKHJldCwgaXRlbSA9PiBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Rml4ZWRDb2xzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgXy5lYWNoKHRoaXMucGF0dGVybnMsIChkYXRhOiBCb29tUGF0dGVybkRhdGEpID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChkYXRhLnBhdHRlcm4uZml4ZWRfY29scywgKGNvbDogSUJvb21GaXhlZENvbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb2wubmFtZSAhPT0gXCJcIil7XG4gICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKGNvbC5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldCA9IF8udW5pcShyZXQsIGl0ZW0gPT4gaXRlbSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRhYmxlV2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHBkOiBudW1iZXIgPSBOdW1iZXIodGhpcy5wYW5lbC50YWJsZV91bml0X3BhZGRpbmcpO1xuICAgICAgICBsZXQgdXc6IG51bWJlciA9IE51bWJlcih0aGlzLnBhbmVsLnRhYmxlX3VuaXRfd2lkdGgpO1xuICAgICAgICBpZiAoaXNOYU4ocGQpKSB7cGQgPSAwO31cbiAgICAgICAgaWYgKGlzTmFOKHV3KSkge3V3ID0gMDt9XG4gICAgICAgIGlmICh1dyA8IChwZCAqIDIpKSB7IHV3ID0gcGQgKiAyO31cbiAgICAgICAgaWYgKHBkIDwgMSAmJiB1dyA8IDEpeyByZXR1cm4gMDt9XG4gICAgICAgIHV3ICs9IDI7XG4gICAgICAgIGxldCBjb2xfbnVtID0gdGhpcy5ib29tVGFibGUhLmNvbHNfZm91bmQubGVuZ3RoO1xuICAgICAgICBjb25zb2xlLmxvZyhjb2xfbnVtLCBwZCwgdXcpO1xuICAgICAgICByZXR1cm4gdXcgKiBjb2xfbnVtIC0gY29sX251bSArIDE7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRUYWJsZUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgcGQ6IG51bWJlciA9IE51bWJlcih0aGlzLnBhbmVsLnRhYmxlX3VuaXRfcGFkZGluZyk7XG4gICAgICAgIGxldCB1aDogbnVtYmVyID0gTnVtYmVyKHRoaXMucGFuZWwudGFibGVfdW5pdF9oZWlnaHQpO1xuICAgICAgICBpZiAoaXNOYU4ocGQpKSB7cGQgPSAwO31cbiAgICAgICAgaWYgKGlzTmFOKHVoKSkge3VoID0gMDt9XG4gICAgICAgIGlmIChwZCA8IDEgJiYgdWggPCAxKXsgcmV0dXJuIDA7fVxuICAgICAgICBpZiAocGQgPCAwICAgICAgICAgICl7IHBkID0gMDt9XG4gICAgICAgIGlmICh1aCA8IDAgICAgICAgICAgKXsgdWggPSAwO31cbiAgICAgICAgbGV0IGNvbF9udW0gPSB0aGlzLmJvb21UYWJsZSEucm93c19mb3VuZC5sZW5ndGg7XG4gICAgICAgIHJldHVybiAoY29sX251bSAtIDEpICsgKGNvbF9udW0gKiAocGQgKyB1aCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRUYWJsZVdpZHRoU3R5bGUoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHcgPSB0aGlzLmdldFRhYmxlV2lkdGgoKTtcbiAgICAgICAgcmV0dXJuIHcgPiAwID8gXCJ3aWR0aDpcIiArIHcgKyBcInB4XCIgOiBcIlwiO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0VGFibGVIZWlnaHRTdHlsZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgaCA9IHRoaXMuZ2V0VGFibGVIZWlnaHQoKTtcbiAgICAgICAgcmV0dXJuIGggPiAwID8gXCJ3aWR0aDpcIiArIGggKyBcInB4XCIgOiBcIlwiO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Jlc2V0Q29sdW1uc0Zyb21QYXR0ZXJucygpIHtcbiAgICAgICAgLy8gc2VhcmNoIGZyb20gcGF0dGVybiBmaXhlZCBjb2x1bW5zXG4gICAgICAgIGxldCBjb2xzOiB7W25hbWU6IHN0cmluZ106IEJvb21GaXhlZENvbH0gPSB7fTtcbiAgICAgICAgXy5lYWNoKHRoaXMucGF0dGVybnMsIChwdGRhdGE6IEJvb21QYXR0ZXJuRGF0YSkgPT4ge1xuICAgICAgICAgICAgXy5lYWNoKHB0ZGF0YS5wYXR0ZXJuLmZpeGVkX2NvbHMsIChmY29sOiBJQm9vbUZpeGVkQ29sKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZjb2wubmFtZSAhPT0gXCJcIiAmJiBjb2xzW2Zjb2wubmFtZV0gPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdfY29sID0gbmV3IEJvb21GaXhlZENvbChmY29sLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBuZXdfY29sLm9yZGVyID0gZmNvbC5vcmRlciAhPT0gXCJcIiA/IGZjb2wub3JkZXIgOiBmY29sLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIG5ld19jb2wuc2hvdyAgPSBmY29sLnNob3cgICE9PSBcIlwiID8gZmNvbC5zaG93ICA6IGZjb2wubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgbmV3X2NvbC5iZ19jb2xvciA9IGZjb2wuYmdfY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIG5ld19jb2wudGV4dF9jb2xvciA9IGZjb2wudGV4dF9jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgbmV3X2NvbC5mcm9tICA9IFwicGF0dGVybjpcIiArIHB0ZGF0YS5wYXR0ZXJuLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb2xzW2Zjb2wubmFtZV0gPSBuZXdfY29sO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gY29scztcbiAgICB9XG4gICAgcHJpdmF0ZSBfYWRkQ29sdW1uc0Zyb21Cb29tU2VyaWVzKCkge1xuICAgICAgICAvLyBzZWFyY2ggZnJvbSBzZXJpZXNcbiAgICAgICAgbGV0IGNvbHM6IHtbbmFtZTogc3RyaW5nXTogQm9vbUZpeGVkQ29sfSA9IHRoaXMuY29sdW1ucztcbiAgICAgICAgbGV0IGNvbHNfZm91bmQ6IHN0cmluZ1tdID0gXy51bmlxKF8ubWFwKHRoaXMuYm9vbVNlcmllcywgKGQ6IHsgY29sX25hbWU6IGFueTsgfSkgPT4gZC5jb2xfbmFtZSkpO1xuICAgICAgICBfLmVhY2goY29sc19mb3VuZCwgKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbHNbbmFtZV0gPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgbGV0IG5ld19jb2wgPSBuZXcgQm9vbUZpeGVkQ29sKG5hbWUpO1xuICAgICAgICAgICAgICAgIG5ld19jb2wub3JkZXIgPSBuYW1lO1xuICAgICAgICAgICAgICAgIG5ld19jb2wuc2hvdyAgPSBuYW1lO1xuICAgICAgICAgICAgICAgIGNvbHNbbmFtZV0gPSBuZXdfY29sO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRTb3J0ZWRDb2x1bW5zKHNvcnRfdHlwZTogc3RyaW5nKTogQm9vbUZpeGVkQ29sW117XG4gICAgICAgIHJldHVybiBfLm1hcCh0aGlzLmNvbHVtbnMsIGNvbCA9PiBjb2wpLnNvcnQoKGE6IEJvb21GaXhlZENvbCwgYjogQm9vbUZpeGVkQ29sKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYm9vbVNvcnRGdW5jKGEub3JkZXIsIGIub3JkZXIsIHNvcnRfdHlwZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2Jvb21TZXJpZXNUb1RhYmxlKG9wdGlvbnM6IElCb29tVGFibGVUcmFuc2Zvcm1hdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgbGV0IHJvd3NfZm91bmQgPSBfLnVuaXEoXy51bmlxKF8ubWFwKHRoaXMuYm9vbVNlcmllcywgKGQ6IHsgcm93X25hbWU6IGFueTsgfSkgPT4gZC5yb3dfbmFtZSkpLmNvbmNhdCh0aGlzLmdldEZpeGVkUm93cygpKSk7XG4gICAgICAgIGxldCByb3dzX3dpdGhvdXRfdG9rZW4gPSBfLnVuaXEoXy5tYXAodGhpcy5ib29tU2VyaWVzLCAoZDogeyByb3dfbmFtZV9yYXc6IGFueTsgfSkgPT4gZC5yb3dfbmFtZV9yYXcpKTtcbiAgICAgICAgbGV0IGNvbHNfZm91bmQ6IEJvb21GaXhlZENvbFtdID0gdGhpcy5fZ2V0U29ydGVkQ29sdW1ucyhvcHRpb25zLmNvbHNfc29ydF90eXBlKTtcbiAgICAgICAgbGV0IHJvd19jb2xfY2VsbHM6IElCb29tQ2VsbERldGFpbHNbXVtdID0gW107XG4gICAgICAgIF8uZWFjaChyb3dzX2ZvdW5kLCAocm93X25hbWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbHM6IElCb29tQ2VsbERldGFpbHNbXSA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKGNvbHNfZm91bmQsIChjb2w6IEJvb21GaXhlZENvbCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjb2xfbmFtZSA9IGNvbC5uYW1lO1xuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkX2l0ZW1zOiBCb29tU2VyaWVzW10gPSBfLmZpbHRlcih0aGlzLmJvb21TZXJpZXMsIChvOiB7IHJvd19uYW1lOiBhbnk7IGNvbF9uYW1lOiBhbnk7IGhpZGRlbjogYW55IH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG8ucm93X25hbWUgPT09IHJvd19uYW1lICYmIG8uY29sX25hbWUgPT09IGNvbF9uYW1lICYmIG8uaGlkZGVuID09PSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoZWRfaXRlbXMgfHwgbWF0Y2hlZF9pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGwgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbF9uYW1lXCI6IGNvbF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl9iZ1wiOiBjb2wuYmdfY29sb3IgfHwgb3B0aW9ucy5ub25fbWF0Y2hpbmdfY2VsbHNfY29sb3JfYmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yX3RleHRcIjogY29sLnRleHRfY29sb3IgfHwgb3B0aW9ucy5ub25fbWF0Y2hpbmdfY2VsbHNfY29sb3JfdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheV92YWx1ZVwiOiByZXBsYWNlVG9rZW5zKG9wdGlvbnMubm9uX21hdGNoaW5nX2NlbGxzX3RleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJoaWRkZW5cIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1zXCI6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaW5rXCI6IFwiLVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyb3dfbmFtZVwiOiByb3dfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidG9vbHRpcFwiOiBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogTmFOLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb2xzLnB1c2goY2VsbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVkX2l0ZW1zICYmIG1hdGNoZWRfaXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHMucHVzaChtYXRjaGVkX2l0ZW1zWzBdLnRvQm9vbUNlbGxEZXRhaWxzKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlZF9pdGVtcyAmJiBtYXRjaGVkX2l0ZW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBtYXRjaGVkX2l0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbDogSUJvb21DZWxsRGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sX25hbWVcIjogY29sX25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yX2JnXCI6IFwiZGFya3JlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl90ZXh0XCI6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheV92YWx1ZVwiOiBcIkR1cGxpY2F0ZSBtYXRjaGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhpZGRlblwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCItXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJvd19uYW1lXCI6IHJvd19uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IE5hTixcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSB0aGlzLmdldFBhdHRlcm4oaXRlbS5wYXR0ZXJuX2lkLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc2lmeSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWluX2lkID0gaXRlbS5jb2xvcl9iZ19pZDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1heF9pZCA9IGl0ZW0uY29sb3JfYmdfaWQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaG9vc2VuOiBCb29tU2VyaWVzID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4uZW5hYmxlX211bHRpdmFsdWVfY2VsbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChtYXRjaGVkX2l0ZW1zLCAoaXRlbTogQm9vbVNlcmllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaXRlbXMucHVzaChpdGVtLnRvQm9vbUNlbGxEZXRhaWxzKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudG9vbHRpcCArPSBgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxMnB4O2NvbG9yOiR7aXRlbS5jb2xvcl9iZ307dGV4dC1hbGlnbjpsZWZ0XCI+YCArIGl0ZW0udG9vbHRpcCArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW5faWQgPiBpdGVtLmNvbG9yX2JnX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbl9pZCA9IGl0ZW0uY29sb3JfYmdfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXhfaWQgPCBpdGVtLmNvbG9yX2JnX2lkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4X2lkID0gaXRlbS5jb2xvcl9iZ19pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjbGFzc2lmeVtpdGVtLmNvbG9yX2JnX2lkLnRvU3RyaW5nKCldID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NpZnlbaXRlbS5jb2xvcl9iZ19pZC50b1N0cmluZygpXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2lmeVtpdGVtLmNvbG9yX2JnX2lkLnRvU3RyaW5nKCldLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuLm11bHRpX3ZhbHVlX3Nob3dfcHJpb3JpdHkgPT09IG11bHRpVmFsdWVTaG93UHJpb3JpdGllc1swXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1zOiBCb29tU2VyaWVzW10gPSBjbGFzc2lmeVttaW5faWQudG9TdHJpbmcoKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gaXRlbXNbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiAgID0gaXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV0sIChpdGVtOiBCb29tU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+IGl0ZW0udmFsdWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1zOiBCb29tU2VyaWVzW10gPSBjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gaXRlbXNbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiAgID0gaXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV0sIChpdGVtOiBCb29tU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA8IGl0ZW0udmFsdWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY29sb3JfYmcgICAgICA9IGNob29zZW4uY29sb3JfYmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbG9yX3RleHQgICAgPSBjaG9vc2VuLmNvbG9yX3RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmRpc3BsYXlfdmFsdWUgPSBjaG9vc2VuLmRpc3BsYXlfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmxpbmsgICAgICAgICAgPSBjaG9vc2VuLmxpbms7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnZhbHVlICAgICAgICAgPSBjaG9vc2VuLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5oaWRkZW4gICAgICAgID0gY2hvb3Nlbi5oaWRkZW47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKG1hdGNoZWRfaXRlbXMsIChpdGVtOiBCb29tU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5pdGVtcy5wdXNoKGl0ZW0udG9Cb29tQ2VsbERldGFpbHMoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC50b29sdGlwICs9IGA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjEycHg7Y29sb3I6JHtpdGVtLmNvbG9yX2JnfTt0ZXh0LWFsaWduOmxlZnRcIj5gICsgaXRlbS50b29sdGlwICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuZGlzcGxheV92YWx1ZSArPSBcIjogXCIgKyB2YWx1ZXMuam9pbignfCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbHMucHVzaChjZWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJvd19jb2xfY2VsbHMucHVzaChjb2xzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2xzX2ZvdW5kOiBfLm1hcChjb2xzX2ZvdW5kLCAoY29sOiBCb29tRml4ZWRDb2wpID0+IGNvbC5uYW1lKSxcbiAgICAgICAgICAgIHJvd19jb2xfY2VsbHMsXG4gICAgICAgICAgICByb3dzX2ZvdW5kLFxuICAgICAgICAgICAgcm93c193aXRob3V0X3Rva2VuLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JlbW92ZUhpZGRlbkNvbEZyb21UYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9vbVRhYmxlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb2xzX2ZvdW5kID0gdGhpcy5ib29tVGFibGUuY29sc19mb3VuZDtcbiAgICAgICAgZm9yIChsZXQgY29sIG9mIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcykge1xuICAgICAgICAgICAgbGV0IGlkeCA9IGNvbHNfZm91bmQuaW5kZXhPZihjb2wpO1xuICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEgKXtcbiAgICAgICAgICAgICAgICBjb2xzX2ZvdW5kLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9vbVRhYmxlLmNvbHNfZm91bmQgPSBjb2xzX2ZvdW5kO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZVNvcnRDb2xJZHhGb3JUYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9vbVRhYmxlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzb3J0aW5nX3Byb3BzID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzO1xuICAgICAgICBpZiAoc29ydGluZ19wcm9wcy5zb3J0X2NvbHVtbiAhPT0gdW5kZWZpbmVkICYmIHNvcnRpbmdfcHJvcHMuc29ydF9jb2x1bW4gIT09IFwiXCIpe1xuICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMuYm9vbVRhYmxlLmNvbHNfZm91bmQuaW5kZXhPZihzb3J0aW5nX3Byb3BzLnNvcnRfY29sdW1uKTtcbiAgICAgICAgICAgIGlmIChpZHggIT09IC0xKXtcbiAgICAgICAgICAgICAgICBzb3J0aW5nX3Byb3BzLmNvbF9pbmRleCA9IGlkeDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldCBzb3J0IGNvbCBpZHggdG8gXCIgKyBpZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzb3J0aW5nX3Byb3BzLmNvbF9pbmRleCA+PSB0aGlzLmJvb21UYWJsZS5jb2xzX2ZvdW5kLmxlbmd0aCApe1xuICAgICAgICAgICAgc29ydGluZ19wcm9wcy5jb2xfaW5kZXggPSAtMTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBCb29tRHJpdmVyXG59O1xuIl19