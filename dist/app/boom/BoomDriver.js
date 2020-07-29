System.register(["lodash", "./index", "./BoomPattern", "../config", "./BoomUtils"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, index_1, index_2, BoomPattern_1, config_1, BoomUtils_1, BoomDriver;
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
                    this.inputs = [];
                    this.boomSeries = [];
                    this.cost = "";
                    this.ctrl = ctrl;
                    this.panel = ctrl.panel;
                    this.inputs = ctrl.dataReceived;
                }
                BoomDriver.prototype.doProcessing = function () {
                    var start = new Date();
                    this._registerPatterns();
                    this._parsingInputs();
                    this._genTableData();
                    this._renderHtml();
                    var end = new Date();
                    var diffms = end.getTime() - start.getTime();
                    this.cost = "" + (diffms / 1000) + "s";
                };
                BoomDriver.prototype._registerPatterns = function () {
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
                        data = new index_1.BoomPatternData(pattern, this.ctrl);
                        this.patterns[pattern.id] = data;
                    }
                    return data;
                };
                BoomDriver.prototype._parsingInputs = function () {
                    var _this = this;
                    if (!this.inputs) {
                        return;
                    }
                    var patterns = this.panel.patterns;
                    var defaultPattern = this.panel.panelDefaultPattern;
                    this.inputs.map(function (input) {
                        var alias = input.target;
                        var pattern = lodash_1.default.find(patterns.filter(function (p) { return p.disabled !== true; }), function (p) { return alias.match(p.pattern); }) || defaultPattern;
                        _this.getPatternData(pattern.id).addInput(input);
                    });
                    var boomSeries = [];
                    lodash_1.default.each(this.patterns, function (pattern) {
                        pattern.joinData();
                        pattern.genBoomSeries();
                        boomSeries = boomSeries.concat(pattern.boomSeries);
                    });
                    this.boomSeries = boomSeries;
                    this._addColumnsFromBoomSeries();
                };
                BoomDriver.prototype._genTableData = function () {
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
                BoomDriver.prototype._renderHtml = function () {
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
                                cell.tooltip = "<div style=\"font-size:12px;color:" + cell.color_bg + ";text-align:left\">" + cell.tooltip + '</div>';
                                cols.push(cell);
                            }
                            else if (matched_items && matched_items.length === 1) {
                                var cell = matched_items[0].toBoomCellDetails();
                                cell.tooltip = "<div style=\"font-size:12px;color:" + cell.color_bg + ";text-align:left\">" + cell.tooltip + '</div>';
                                cols.push(cell);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbURyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvYm9vbS9Cb29tRHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVdBO2dCQWFJLG9CQUFZLElBQWU7b0JBVnBCLGFBQVEsR0FBb0MsRUFBRSxDQUFDO29CQUMvQyxZQUFPLEdBQXFDLEVBQUUsQ0FBQztvQkFDL0MsV0FBTSxHQUFVLEVBQUUsQ0FBQztvQkFDbkIsZUFBVSxHQUFpQixFQUFFLENBQUM7b0JBTTlCLFNBQUksR0FBRyxFQUFFLENBQUM7b0JBRWIsSUFBSSxDQUFDLElBQUksR0FBSyxJQUFJLENBQUM7b0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNwQyxDQUFDO2dCQUVNLGlDQUFZLEdBQW5CO29CQUNJLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7b0JBRXZCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUN6QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDckIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUVuQixJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO29CQUNyQixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUM3QyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQzNDLENBQUM7Z0JBRU8sc0NBQWlCLEdBQXpCO29CQUFBLGlCQVdDO29CQVZHLElBQUksQ0FBQyxRQUFRLEdBQUcs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O3dCQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFBRTtvQkFHckMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNYLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDWDt3QkFDSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7NEJBQ1QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsR0FBRyxHQUFHLEdBQUcsR0FBQyxDQUFDLENBQUM7NkJBQUU7NEJBQ25DLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUMsQ0FBQyxDQUFDOzZCQUFFO3lCQUN0Qzt3QkFDRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQzs0QkFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDOzRCQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO3lCQUFFO3dCQUNwRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQzs0QkFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDOzRCQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO3lCQUFFO3dCQUNwRCxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUM7NEJBQ1IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQUUsR0FBRyxHQUFHLEdBQUcsR0FBQyxDQUFDLENBQUM7NkJBQUU7NEJBQ25DLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUMsQ0FBQyxDQUFDOzZCQUFFO3lCQUN0Qzt3QkFDRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQzs0QkFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDOzRCQUFDLEVBQUUs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QUksR0FBRyxTQUFBO3dCQUNSLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2xDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFOzRCQUNaLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUM3QjtxQkFDSjtvQkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7Z0JBQzNDLENBQUM7Z0JBRU8sOENBQXlCLEdBQWpDO29CQUNJLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUM7d0JBQzdCLE9BQU87cUJBQ1Y7b0JBQ0QsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7b0JBQzdDLElBQUksYUFBYSxDQUFDLFdBQVcsS0FBSyxTQUFTLElBQUksYUFBYSxDQUFDLFdBQVcsS0FBSyxFQUFFLEVBQUM7d0JBQzVFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQ3ZFLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFDOzRCQUNYLGFBQWEsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDOzRCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxDQUFDO3lCQUM3QztxQkFDSjtvQkFDRCxJQUFJLGFBQWEsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO3dCQUM3RCxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNoQztnQkFDTCxDQUFDO2dCQUNMLGlCQUFDO1lBQUQsQ0FBQyxBQXJkRCxJQXFkQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IEJvb21QYXR0ZXJuRGF0YSwgSUJvb21UYWJsZVRyYW5zZm9ybWF0aW9uT3B0aW9ucywgSUJvb21UYWJsZSwgSUJvb21DZWxsRGV0YWlscyB9IGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgeyBCb29tUmVuZGVyLCBJQm9vbUhUTUwsIElCb29tUmVuZGVyaW5nT3B0aW9ucywgSUJvb21UYWJsZVN0eWxlcyB9IGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgeyBCb29tU2VyaWVzIH0gZnJvbSBcIi4vQm9vbVNlcmllc1wiO1xuaW1wb3J0IHsgQm9vbVBhdHRlcm4gfSBmcm9tIFwiLi9Cb29tUGF0dGVyblwiO1xuaW1wb3J0IHsgSUJvb21GaXhlZFJvdywgSUJvb21GaXhlZENvbCB9IGZyb20gXCIuL0Jvb20uaW50ZXJmYWNlXCI7XG5pbXBvcnQgeyBCb29tRml4ZWRDb2wgfSBmcm9tIFwiLi9Cb29tUGF0dGVyblwiO1xuaW1wb3J0IHsgUGFuZWxDdHJsIH0gZnJvbSBcIi4uLy4uL21vZHVsZVwiO1xuaW1wb3J0IHsgY29sdW1uU29ydFR5cGVzLCBjb25maWcsIG11bHRpVmFsdWVTaG93UHJpb3JpdGllcyB9IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCB7IHJlcGxhY2VUb2tlbnMsIGJvb21Tb3J0RnVuYyB9IGZyb20gXCIuL0Jvb21VdGlsc1wiO1xuXG5jbGFzcyBCb29tRHJpdmVyIHtcbiAgICBwdWJsaWMgY3RybDogICAgIFBhbmVsQ3RybDtcbiAgICBwdWJsaWMgcGFuZWw6ICAgIGFueTtcbiAgICBwdWJsaWMgcGF0dGVybnM6IHtbaWQ6IG51bWJlcl06IEJvb21QYXR0ZXJuRGF0YX0gPSB7fTtcbiAgICBwdWJsaWMgY29sdW1uczogIHtbbmFtZTogc3RyaW5nXTogQm9vbUZpeGVkQ29sIH0gPSB7fTtcbiAgICBwdWJsaWMgaW5wdXRzOiAgIGFueSA9IFtdOyAgICAgICAgICAgICAgICAgICAgLy8gc2VyaWVzIGZyb20gaW5wdXQgcXVlcnkgZGF0YVxuICAgIHB1YmxpYyBib29tU2VyaWVzOiBCb29tU2VyaWVzW10gPSBbXTsgICAgICAgICAvLyBzZXJpZXMgd2l0Y2ggcGFyc2VkIGZyb20gaW5wdXQgc2VyaWVzXG4gICAgcHVibGljIGJvb21UYWJsZTogIElCb29tVGFibGUgICB8IHVuZGVmaW5lZDsgIC8vIGRhdGEgZ2VuZXJhdGVkIGZyb20gYm9vbVNlcmllc1xuICAgIHB1YmxpYyBib29tUmVuZGVyOiBCb29tUmVuZGVyICAgfCB1bmRlZmluZWQ7ICAvLyByZW5kZXIgdG8gcmVuZCBib29tVGFibGUgdG8gYm9vbUh0bWxcbiAgICBwdWJsaWMgYm9vbUh0bWw6ICAgSUJvb21IVE1MICAgIHwgdW5kZWZpbmVkOyAgLy8gdGhlIG91dHB1dCBodG1sIHJlc3VsdFxuICAgIHB1YmxpYyBib29tSHRtbGQ6ICBJQm9vbUhUTUwgICAgfCB1bmRlZmluZWQ7ICAvLyB0aGUgb3V0cHV0IGh0bWwgcmVzdWx0IG9mIGRlYnVnXG4gICAgcHVibGljIHRiX3N0eWxlczogSUJvb21UYWJsZVN0eWxlcyB8IHVuZGVmaW5lZDtcbiAgICBwdWJsaWMgY29zdCA9IFwiXCI7XG4gICAgY29uc3RydWN0b3IoY3RybDogUGFuZWxDdHJsKXtcbiAgICAgICAgdGhpcy5jdHJsICAgPSBjdHJsO1xuICAgICAgICB0aGlzLnBhbmVsICA9IGN0cmwucGFuZWw7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gY3RybC5kYXRhUmVjZWl2ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGRvUHJvY2Vzc2luZygpe1xuICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyUGF0dGVybnMoKTtcbiAgICAgICAgdGhpcy5fcGFyc2luZ0lucHV0cygpO1xuICAgICAgICB0aGlzLl9nZW5UYWJsZURhdGEoKTtcbiAgICAgICAgdGhpcy5fcmVuZGVySHRtbCgpO1xuXG4gICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBsZXQgZGlmZm1zID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5jb3N0ID0gXCJcIiArIChkaWZmbXMgLyAxMDAwKSArIFwic1wiO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JlZ2lzdGVyUGF0dGVybnMoKXtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IHt9O1xuICAgICAgICB0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuLmlkID0gLTE7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJQYXR0ZXJuKHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4pO1xuICAgICAgICBsZXQgaWQgPSAwO1xuICAgICAgICBfLmVhY2godGhpcy5wYW5lbC5wYXR0ZXJucywgKHB0OiBCb29tUGF0dGVybikgPT4ge1xuICAgICAgICAgIHB0LmlkID0gaWQ7XG4gICAgICAgICAgdGhpcy5yZWdpc3RlclBhdHRlcm4ocHQpO1xuICAgICAgICAgIGlkICs9IDE7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9yZXNldENvbHVtbnNGcm9tUGF0dGVybnMoKTtcbiAgICB9XG4gICAgcHVibGljIHJlZ2lzdGVyUGF0dGVybihwYXR0ZXJuOiBCb29tUGF0dGVybik6IEJvb21QYXR0ZXJuRGF0YSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5wYXR0ZXJuc1twYXR0ZXJuLmlkXTtcbiAgICAgICAgaWYgKCBkYXRhID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgQm9vbVBhdHRlcm5EYXRhKHBhdHRlcm4sIHRoaXMuY3RybCk7XG4gICAgICAgICAgICB0aGlzLnBhdHRlcm5zW3BhdHRlcm4uaWRdID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wYXJzaW5nSW5wdXRzKCl7XG4gICAgICAgIGlmICghdGhpcy5pbnB1dHMpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwYXR0ZXJucyAgICAgICAgPSB0aGlzLnBhbmVsLnBhdHRlcm5zO1xuICAgICAgICBsZXQgZGVmYXVsdFBhdHRlcm4gID0gdGhpcy5wYW5lbC5wYW5lbERlZmF1bHRQYXR0ZXJuO1xuICAgICAgICB0aGlzLmlucHV0cy5tYXAoaW5wdXQgPT4ge1xuICAgICAgICAgICAgbGV0IGFsaWFzOiBzdHJpbmcgPSBpbnB1dC50YXJnZXQ7XG4gICAgICAgICAgICBsZXQgcGF0dGVybjogQm9vbVBhdHRlcm4gPSBfLmZpbmQocGF0dGVybnMuZmlsdGVyKHAgPT4geyByZXR1cm4gcC5kaXNhYmxlZCAhPT0gdHJ1ZTsgfSksIHAgPT4gYWxpYXMubWF0Y2gocC5wYXR0ZXJuKSkgfHwgZGVmYXVsdFBhdHRlcm47XG4gICAgICAgICAgICB0aGlzLmdldFBhdHRlcm5EYXRhKHBhdHRlcm4uaWQpLmFkZElucHV0KGlucHV0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGJvb21TZXJpZXM6IEJvb21TZXJpZXNbXSA9IFtdO1xuICAgICAgICBfLmVhY2godGhpcy5wYXR0ZXJucywgKHBhdHRlcm46IEJvb21QYXR0ZXJuRGF0YSkgPT57XG4gICAgICAgICAgICBwYXR0ZXJuLmpvaW5EYXRhKCk7XG4gICAgICAgICAgICBwYXR0ZXJuLmdlbkJvb21TZXJpZXMoKTtcbiAgICAgICAgICAgIGJvb21TZXJpZXMgPSBib29tU2VyaWVzLmNvbmNhdChwYXR0ZXJuLmJvb21TZXJpZXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ib29tU2VyaWVzID0gYm9vbVNlcmllcztcblxuICAgICAgICB0aGlzLl9hZGRDb2x1bW5zRnJvbUJvb21TZXJpZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZW5UYWJsZURhdGEoKSB7XG4gICAgICAgIGxldCBvcHRpb25zOiBJQm9vbVRhYmxlVHJhbnNmb3JtYXRpb25PcHRpb25zID0ge1xuICAgICAgICAgICAgY29sc19zb3J0X3R5cGU6ICAgICAgICAgICAgICAgICB0aGlzLnBhbmVsLmNvbHNfc29ydF90eXBlID09PSBjb2x1bW5Tb3J0VHlwZXNbMV0gPyBjb2x1bW5Tb3J0VHlwZXNbMV0gOiBjb2x1bW5Tb3J0VHlwZXNbMF0sXG4gICAgICAgICAgICBub25fbWF0Y2hpbmdfY2VsbHNfY29sb3JfYmc6ICAgIHRoaXMucGFuZWwubm9uX21hdGNoaW5nX2NlbGxzX2NvbG9yX2JnLFxuICAgICAgICAgICAgbm9uX21hdGNoaW5nX2NlbGxzX2NvbG9yX3RleHQ6ICB0aGlzLnBhbmVsLm5vbl9tYXRjaGluZ19jZWxsc19jb2xvcl90ZXh0LFxuICAgICAgICAgICAgbm9uX21hdGNoaW5nX2NlbGxzX3RleHQ6ICAgICAgICB0aGlzLnBhbmVsLm5vbl9tYXRjaGluZ19jZWxsc190ZXh0LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmJvb21UYWJsZSA9IHRoaXMuX2Jvb21TZXJpZXNUb1RhYmxlKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl91cGRhdGVTb3J0Q29sSWR4Rm9yVGFibGUoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGlkZGVuQ29sRnJvbVRhYmxlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVUYWJsZVN0eWxlcygpIHtcbiAgICAgICAgbGV0IGh1aDogbnVtYmVyICAgID0gTnVtYmVyKHRoaXMucGFuZWwuaGVhZGVyX3VuaXRfaGVpZ2h0KTtcbiAgICAgICAgbGV0IGh1dzogbnVtYmVyICAgID0gTnVtYmVyKHRoaXMucGFuZWwuaGVhZGVyX3VuaXRfd2lkdGgpO1xuICAgICAgICBsZXQgaHVwOiBudW1iZXIgICAgPSBOdW1iZXIodGhpcy5wYW5lbC5oZWFkZXJfdW5pdF9wYWRkaW5nKTtcbiAgICAgICAgbGV0IGJ1aDogbnVtYmVyICAgID0gTnVtYmVyKHRoaXMucGFuZWwuYm9keV91bml0X2hlaWdodCk7XG4gICAgICAgIGxldCBidXc6IG51bWJlciAgICA9IE51bWJlcih0aGlzLnBhbmVsLmJvZHlfdW5pdF93aWR0aCk7XG4gICAgICAgIGxldCBidXA6IG51bWJlciAgICA9IE51bWJlcih0aGlzLnBhbmVsLmJvZHlfdW5pdF9wYWRkaW5nKTtcbiAgICAgICAgbGV0IGh1Zl9zejogc3RyaW5nID0gdGhpcy5wYW5lbC5oZWFkZXJfZm9udF9zaXplIHx8IFwiMXJlbVwiO1xuICAgICAgICBsZXQgaHVmX3NjOiBudW1iZXIgPSBOdW1iZXIodGhpcy5wYW5lbC5oZWFkZXJfZm9udF9zY2FsZSk7XG4gICAgICAgIGxldCBidWZfc3o6IHN0cmluZyA9IHRoaXMucGFuZWwuYm9keV9mb250X3NpemUgICB8fCBcIjFyZW1cIjtcbiAgICAgICAgbGV0IGJ1Zl9zYzogbnVtYmVyID0gTnVtYmVyKHRoaXMucGFuZWwuYm9keV9mb250X3NjYWxlKTtcbiAgICAgICAgbGV0IGNvbHM6IG51bWJlciA9IHRoaXMuYm9vbVRhYmxlIS5jb2xzX2ZvdW5kLmxlbmd0aDtcbiAgICAgICAgbGV0IHJvd3M6IG51bWJlciA9IHRoaXMuYm9vbVRhYmxlIS5yb3dzX2ZvdW5kLmxlbmd0aDtcbiAgICAgICAgbGV0IGh1Zl9ibG9jayA9IFwiXCI7XG4gICAgICAgIGxldCBidWZfYmxvY2sgPSBcIlwiO1xuICAgICAgICBsZXQgaHVmX292ZXJmbG93ID0gXCJcIjtcbiAgICAgICAgbGV0IGJ1Zl9vdmVyZmxvdyA9IFwiXCI7XG5cbiAgICAgICAgaWYgKCBpc05hTihodWgpICkgeyBodWggPSAtMTsgfVxuICAgICAgICBpZiAoIGlzTmFOKGh1dykgKSB7IGh1dyA9IC0xOyB9XG4gICAgICAgIGlmICggaXNOYU4oaHVwKSApIHsgaHVwID0gLTE7IH1cbiAgICAgICAgaWYgKCBpc05hTihidWgpICkgeyBidWggPSAtMTsgfVxuICAgICAgICBpZiAoIGlzTmFOKGJ1dykgKSB7IGJ1dyA9IC0xOyB9XG4gICAgICAgIGlmICggaXNOYU4oYnVwKSApIHsgYnVwID0gLTE7IH1cbiAgICAgICAgaWYgKCBpc05hTihodWZfc2MpICkgeyBodWZfc2MgPSAtMTsgfVxuICAgICAgICBpZiAoIGlzTmFOKGJ1Zl9zYykgKSB7IGJ1Zl9zYyA9IC0xOyB9XG5cbiAgICAgICAgLy8gdmFsaWRhdGUgd2lkdGggYW5kIGhlaWdodFxuICAgICAgICBsZXQgdHcgPSAwO1xuICAgICAgICBsZXQgdGggPSAwO1xuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoYnVwID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChidWggPCAoYnVwKjIpKSB7IGJ1aCA9IGJ1cCoyOyB9XG4gICAgICAgICAgICAgICAgaWYgKGJ1dyA8IChidXAqMikpIHsgYnV3ID0gYnVwKjI7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidWggPiAtMSl7IHRoID0gYnVoOyB0aCA9ICh0aCArIDEpICogY29scyAtIDE7IH1cbiAgICAgICAgICAgIGlmIChidXcgPiAtMSl7IHR3ID0gYnV3OyB0dyA9ICh0dyArIDEpICogY29scyAtIDE7IH1cbiAgICAgICAgICAgIGlmIChodXAgPiAwKXtcbiAgICAgICAgICAgICAgICBpZiAoaHVoIDwgKGh1cCoyKSkgeyBodWggPSBodXAqMjsgfVxuICAgICAgICAgICAgICAgIGlmIChodXcgPCAoaHVwKjIpKSB7IGh1dyA9IGh1cCoyOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaHVoID4gLTEpeyB0aCA9IGh1aDsgdGggPSAodGggKyAxKSAqIGNvbHMgLSAxOyB9XG4gICAgICAgICAgICBpZiAoaHV3ID4gLTEpeyB0dyA9IGh1dzsgdHcgPSAodHcgKyAxKSAqIGNvbHMgLSAxOyB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdmFsaWRhdGEgZm9udCBzdHlsZXNcbiAgICAgICAgbGV0IGh1Zl9zdHlsZSA9IFwiXCI7XG4gICAgICAgIGxldCBidWZfc3R5bGUgPSBcIlwiO1xuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoaHVmX3N6ID09PSBcIlwiIHx8IHVuZGVmaW5lZCkgeyBodWZfc3ogPSBcIjFyZW1cIjsgfVxuICAgICAgICAgICAgaWYgKGJ1Zl9zeiA9PT0gXCJcIiB8fCB1bmRlZmluZWQpIHsgYnVmX3N6ID0gXCIxcmVtXCI7IH1cblxuICAgICAgICAgICAgaHVmX3N0eWxlID0gYGZvbnQtc2l6ZToke2h1Zl9zen07YDtcbiAgICAgICAgICAgIGJ1Zl9zdHlsZSA9IGBmb250LXNpemU6JHtidWZfc3p9O2A7XG5cbiAgICAgICAgICAgIGlmICggIWlzTmFOKGh1Zl9zYykgJiYgaHVmX3NjID4gMCl7XG4gICAgICAgICAgICAgICAgaHVmX3N0eWxlICAgKz0gYHRyYW5zZm9ybTpzY2FsZSgke2h1Zl9zY30pICFpbXBvcnRhbnQ7YDtcbiAgICAgICAgICAgICAgICBodWZfYmxvY2sgICAgPSBcImRpc3BsYXk6YmxvY2s7XCI7XG4gICAgICAgICAgICAgICAgaHVmX292ZXJmbG93ID0gXCJvdmVyZmxvdzogaGlkZGVuO1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCAhaXNOYU4oYnVmX3NjKSAmJiBidWZfc2MgPiAwKSB7XG4gICAgICAgICAgICAgICAgYnVmX3N0eWxlICAgKz0gYHRyYW5zZm9ybTpzY2FsZSgke2J1Zl9zY30pICFpbXBvcnRhbnQ7YDtcbiAgICAgICAgICAgICAgICBidWZfYmxvY2sgICAgPSBcImRpc3BsYXk6YmxvY2s7XCI7XG4gICAgICAgICAgICAgICAgYnVmX292ZXJmbG93ID0gXCJvdmVyZmxvdzogaGlkZGVuO1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudGJfc3R5bGVzID0ge1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgICAgIGNvbHVtbnMgICAgICAgICAgICA6IGNvbHMsXG4gICAgICAgICAgICByb3dzICAgICAgICAgICAgICAgOiByb3dzLFxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgICAgICA6IHRoLFxuICAgICAgICAgICAgd2lkdGggICAgICAgICAgICAgIDogdHcsXG4gICAgICAgICAgICBoZWlnaHRfc3R5bGUgICAgICAgOiB0aCA8IDEgPyBcIlwiIDogXCJoZWlnaHQ6XCIgICsgdGggKyBcInB4XCIsXG4gICAgICAgICAgICB3aWR0aF9zdHlsZSAgICAgICAgOiB0dyA8IDEgPyBcIlwiIDogXCJ3aWR0aDpcIiAgICsgKHR3IC8gMC44OSkgKyBcInB4XCIsXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG9iamVjdC1saXRlcmFsLXNvcnQta2V5c1xuICAgICAgICAgICAgaGVhZGVyX3VuaXRfd2lkdGggIDogaHV3LFxuICAgICAgICAgICAgaGVhZGVyX3VuaXRfaGVpZ2h0IDogaHVoLFxuICAgICAgICAgICAgaGVhZGVyX3VuaXRfcGFkZGluZzogaHVwLFxuICAgICAgICAgICAgYm9keV91bml0X3dpZHRoICAgIDogYnV3LFxuICAgICAgICAgICAgYm9keV91bml0X2hlaWdodCAgIDogYnVoLFxuICAgICAgICAgICAgYm9keV91bml0X3BhZGRpbmcgIDogYnVwLFxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvYmplY3QtbGl0ZXJhbC1zb3J0LWtleXNcbiAgICAgICAgICAgIGhlYWRfZm9udF9zaXplICAgICA6IGh1Zl9zeixcbiAgICAgICAgICAgIGhlYWRfZm9udF9zY2FsZSAgICA6IGh1Zl9zYyxcbiAgICAgICAgICAgIGJvZHlfZm9udF9zaXplICAgICA6IGJ1Zl9zeixcbiAgICAgICAgICAgIGJvZHlfZm9udF9zY2FsZSAgICA6IGJ1Zl9zYyxcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgICAgICBoZWFkZXJfdW5pdF93aWR0aF9zdHlsZSAgOiBodXcgPCAwID8gXCJcIiA6IFwid2lkdGg6XCIgICArIChodXcpICsgXCJweDtcIixcbiAgICAgICAgICAgIGhlYWRlcl91bml0X2hlaWdodF9zdHlsZSA6IGh1aCA8IDAgPyBcIlwiIDogXCJoZWlnaHQ6XCIgICsgKGh1aCkgKyBcInB4O1wiLFxuICAgICAgICAgICAgaGVhZGVyX3VuaXRfcGFkZGluZ19zdHlsZTogaHVwIDwgMCA/IFwiXCIgOiBcInBhZGRpbmc6XCIgKyAoaHVwKSArIFwicHg7XCIsXG4gICAgICAgICAgICBib2R5X3VuaXRfd2lkdGhfc3R5bGUgICAgOiBidXcgPCAwID8gXCJcIiA6IFwid2lkdGg6XCIgICArIChidXcpICsgXCJweDtcIixcbiAgICAgICAgICAgIGJvZHlfdW5pdF9oZWlnaHRfc3R5bGUgICA6IGJ1aCA8IDAgPyBcIlwiIDogXCJoZWlnaHQ6XCIgICsgKGJ1aCkgKyBcInB4O1wiLFxuICAgICAgICAgICAgYm9keV91bml0X3BhZGRpbmdfc3R5bGUgIDogYnVwIDwgMCA/IFwiXCIgOiBcInBhZGRpbmc6XCIgKyAoYnVwKSArIFwicHg7XCIsXG4gICAgICAgICAgICBoZWFkZXJfZm9udF9zdHlsZSAgICAgICAgOiBodWZfc3R5bGUgKyBodWZfYmxvY2sgKyBodWZfb3ZlcmZsb3csXG4gICAgICAgICAgICBib2R5X2ZvbnRfc3R5bGUgICAgICAgICAgOiBidWZfc3R5bGUgKyBidWZfYmxvY2sgKyBidWZfb3ZlcmZsb3csXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVuZGVySHRtbCgpIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVUYWJsZVN0eWxlcygpO1xuICAgICAgICBsZXQgb3B0aW9uczogSUJvb21SZW5kZXJpbmdPcHRpb25zID0ge1xuICAgICAgICAgICAgZGVmYXVsdF90aXRsZV9mb3Jfcm93czogICAgIHRoaXMucGFuZWwuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyB8fCBjb25maWcuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyxcbiAgICAgICAgICAgIGZpcnN0X2NvbHVtbl9saW5rOiAgICAgICAgICB0aGlzLnBhbmVsLmZpcnN0X2NvbHVtbl9saW5rIHx8IFwiI1wiLFxuICAgICAgICAgICAgaGlkZV9maXJzdF9jb2x1bW46ICAgICAgICAgIHRoaXMucGFuZWwuaGlkZV9maXJzdF9jb2x1bW4sXG4gICAgICAgICAgICBoaWRlX2hlYWRlcnM6ICAgICAgICAgICAgICAgdGhpcy5wYW5lbC5oaWRlX2hlYWRlcnMsXG4gICAgICAgICAgICB0ZXh0X2FsaWdubWVudF9maXJzdGNvbHVtbjogdGhpcy5wYW5lbC50ZXh0X2FsaWdubWVudF9maXJzdGNvbHVtbixcbiAgICAgICAgICAgIHRleHRfYWxpZ25tZW50X3ZhbHVlczogICAgICB0aGlzLnBhbmVsLnRleHRfYWxpZ25tZW50X3ZhbHVlcyxcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gICAgICAgICAgICB0YWJsZV9zdHlsZXM6ICAgICAgICAgICAgICAgdGhpcy50Yl9zdHlsZXMhLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYm9vbVJlbmRlciA9IG5ldyBCb29tUmVuZGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmJvb21IdG1sICAgPSB0aGlzLmJvb21SZW5kZXIuZ2V0RGF0YUFzSFRNTCh0aGlzLmJvb21UYWJsZSwgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzKTtcbiAgICAgICAgdGhpcy5ib29tSHRtbGQgID0ge2JvZHk6IFwiXCJ9O1xuICAgICAgICBpZiAodGhpcy5wYW5lbC5kZWJ1Z19tb2RlKXtcbiAgICAgICAgICAgIHRoaXMuYm9vbUh0bWxkID0gdGhpcy5ib29tUmVuZGVyLmdldERhdGFBc0RlYnVnSFRNTCh0aGlzLmJvb21UYWJsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UGF0dGVybkRhdGEoaWR4OiBudW1iZXIpOiBCb29tUGF0dGVybkRhdGEge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXR0ZXJuc1tpZHhdO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0UGF0dGVybihpZHg6IG51bWJlcik6IEJvb21QYXR0ZXJue1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXR0ZXJuRGF0YShpZHgpLnBhdHRlcm47XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNob3dDb2x1bW5zKCk6IHN0cmluZ1tde1xuICAgICAgICBpZiAodGhpcy5ib29tVGFibGUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYm9vbVRhYmxlLmNvbHNfZm91bmQubWFwKChjb2w6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29sID0gdGhpcy5jb2x1bW5zW2NvbF0uc2hvdztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN0cmwuJHNjZS50cnVzdEFzSHRtbChjb2wpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Rml4ZWRSb3dzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IHJldDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgXy5lYWNoKHRoaXMucGF0dGVybnMsIChkYXRhOiBCb29tUGF0dGVybkRhdGEpID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChkYXRhLnBhdHRlcm4uZml4ZWRfcm93cywgKHJvdzogSUJvb21GaXhlZFJvdykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyb3cubmFtZSAhPT0gXCJcIil7XG4gICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKHJvdy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldCA9IF8udW5pcShyZXQsIGl0ZW0gPT4gaXRlbSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZpeGVkQ29scygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGxldCByZXQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgIF8uZWFjaCh0aGlzLnBhdHRlcm5zLCAoZGF0YTogQm9vbVBhdHRlcm5EYXRhKSA9PiB7XG4gICAgICAgICAgICBfLmVhY2goZGF0YS5wYXR0ZXJuLmZpeGVkX2NvbHMsIChjb2w6IElCb29tRml4ZWRDb2wpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29sLm5hbWUgIT09IFwiXCIpe1xuICAgICAgICAgICAgICAgICAgICByZXQucHVzaChjb2wubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXQgPSBfLnVuaXEocmV0LCBpdGVtID0+IGl0ZW0pO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRUYWJsZVdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIGxldCBwZDogbnVtYmVyID0gTnVtYmVyKHRoaXMucGFuZWwudGFibGVfdW5pdF9wYWRkaW5nKTtcbiAgICAgICAgbGV0IHV3OiBudW1iZXIgPSBOdW1iZXIodGhpcy5wYW5lbC50YWJsZV91bml0X3dpZHRoKTtcbiAgICAgICAgaWYgKGlzTmFOKHBkKSkge3BkID0gMDt9XG4gICAgICAgIGlmIChpc05hTih1dykpIHt1dyA9IDA7fVxuICAgICAgICBpZiAodXcgPCAocGQgKiAyKSkgeyB1dyA9IHBkICogMjt9XG4gICAgICAgIGlmIChwZCA8IDEgJiYgdXcgPCAxKXsgcmV0dXJuIDA7fVxuICAgICAgICB1dyArPSAyO1xuICAgICAgICBsZXQgY29sX251bSA9IHRoaXMuYm9vbVRhYmxlIS5jb2xzX2ZvdW5kLmxlbmd0aDtcbiAgICAgICAgY29uc29sZS5sb2coY29sX251bSwgcGQsIHV3KTtcbiAgICAgICAgcmV0dXJuIHV3ICogY29sX251bSAtIGNvbF9udW0gKyAxO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0VGFibGVIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHBkOiBudW1iZXIgPSBOdW1iZXIodGhpcy5wYW5lbC50YWJsZV91bml0X3BhZGRpbmcpO1xuICAgICAgICBsZXQgdWg6IG51bWJlciA9IE51bWJlcih0aGlzLnBhbmVsLnRhYmxlX3VuaXRfaGVpZ2h0KTtcbiAgICAgICAgaWYgKGlzTmFOKHBkKSkge3BkID0gMDt9XG4gICAgICAgIGlmIChpc05hTih1aCkpIHt1aCA9IDA7fVxuICAgICAgICBpZiAocGQgPCAxICYmIHVoIDwgMSl7IHJldHVybiAwO31cbiAgICAgICAgaWYgKHBkIDwgMCAgICAgICAgICApeyBwZCA9IDA7fVxuICAgICAgICBpZiAodWggPCAwICAgICAgICAgICl7IHVoID0gMDt9XG4gICAgICAgIGxldCBjb2xfbnVtID0gdGhpcy5ib29tVGFibGUhLnJvd3NfZm91bmQubGVuZ3RoO1xuICAgICAgICByZXR1cm4gKGNvbF9udW0gLSAxKSArIChjb2xfbnVtICogKHBkICsgdWgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VGFibGVXaWR0aFN0eWxlKCk6IHN0cmluZyB7XG4gICAgICAgIGxldCB3ID0gdGhpcy5nZXRUYWJsZVdpZHRoKCk7XG4gICAgICAgIHJldHVybiB3ID4gMCA/IFwid2lkdGg6XCIgKyB3ICsgXCJweFwiIDogXCJcIjtcbiAgICB9XG4gICAgcHVibGljIGdldFRhYmxlSGVpZ2h0U3R5bGUoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGggPSB0aGlzLmdldFRhYmxlSGVpZ2h0KCk7XG4gICAgICAgIHJldHVybiBoID4gMCA/IFwid2lkdGg6XCIgKyBoICsgXCJweFwiIDogXCJcIjtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZXNldENvbHVtbnNGcm9tUGF0dGVybnMoKSB7XG4gICAgICAgIC8vIHNlYXJjaCBmcm9tIHBhdHRlcm4gZml4ZWQgY29sdW1uc1xuICAgICAgICBsZXQgY29sczoge1tuYW1lOiBzdHJpbmddOiBCb29tRml4ZWRDb2x9ID0ge307XG4gICAgICAgIF8uZWFjaCh0aGlzLnBhdHRlcm5zLCAocHRkYXRhOiBCb29tUGF0dGVybkRhdGEpID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChwdGRhdGEucGF0dGVybi5maXhlZF9jb2xzLCAoZmNvbDogSUJvb21GaXhlZENvbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmY29sLm5hbWUgIT09IFwiXCIgJiYgY29sc1tmY29sLm5hbWVdID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3X2NvbCA9IG5ldyBCb29tRml4ZWRDb2woZmNvbC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3X2NvbC5vcmRlciA9IGZjb2wub3JkZXIgIT09IFwiXCIgPyBmY29sLm9yZGVyIDogZmNvbC5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBuZXdfY29sLnNob3cgID0gZmNvbC5zaG93ICAhPT0gXCJcIiA/IGZjb2wuc2hvdyAgOiBmY29sLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIG5ld19jb2wuYmdfY29sb3IgPSBmY29sLmJnX2NvbG9yO1xuICAgICAgICAgICAgICAgICAgICBuZXdfY29sLnRleHRfY29sb3IgPSBmY29sLnRleHRfY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIG5ld19jb2wuZnJvbSAgPSBcInBhdHRlcm46XCIgKyBwdGRhdGEucGF0dGVybi5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29sc1tmY29sLm5hbWVdID0gbmV3X2NvbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IGNvbHM7XG4gICAgfVxuICAgIHByaXZhdGUgX2FkZENvbHVtbnNGcm9tQm9vbVNlcmllcygpIHtcbiAgICAgICAgLy8gc2VhcmNoIGZyb20gc2VyaWVzXG4gICAgICAgIGxldCBjb2xzOiB7W25hbWU6IHN0cmluZ106IEJvb21GaXhlZENvbH0gPSB0aGlzLmNvbHVtbnM7XG4gICAgICAgIGxldCBjb2xzX2ZvdW5kOiBzdHJpbmdbXSA9IF8udW5pcShfLm1hcCh0aGlzLmJvb21TZXJpZXMsIChkOiB7IGNvbF9uYW1lOiBhbnk7IH0pID0+IGQuY29sX25hbWUpKTtcbiAgICAgICAgXy5lYWNoKGNvbHNfZm91bmQsIChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmIChjb2xzW25hbWVdID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIGxldCBuZXdfY29sID0gbmV3IEJvb21GaXhlZENvbChuYW1lKTtcbiAgICAgICAgICAgICAgICBuZXdfY29sLm9yZGVyID0gbmFtZTtcbiAgICAgICAgICAgICAgICBuZXdfY29sLnNob3cgID0gbmFtZTtcbiAgICAgICAgICAgICAgICBjb2xzW25hbWVdID0gbmV3X2NvbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0U29ydGVkQ29sdW1ucyhzb3J0X3R5cGU6IHN0cmluZyk6IEJvb21GaXhlZENvbFtde1xuICAgICAgICByZXR1cm4gXy5tYXAodGhpcy5jb2x1bW5zLCBjb2wgPT4gY29sKS5zb3J0KChhOiBCb29tRml4ZWRDb2wsIGI6IEJvb21GaXhlZENvbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGJvb21Tb3J0RnVuYyhhLm9yZGVyLCBiLm9yZGVyLCBzb3J0X3R5cGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9ib29tU2VyaWVzVG9UYWJsZShvcHRpb25zOiBJQm9vbVRhYmxlVHJhbnNmb3JtYXRpb25PcHRpb25zKSB7XG4gICAgICAgIGxldCByb3dzX2ZvdW5kID0gXy51bmlxKF8udW5pcShfLm1hcCh0aGlzLmJvb21TZXJpZXMsIChkOiB7IHJvd19uYW1lOiBhbnk7IH0pID0+IGQucm93X25hbWUpKS5jb25jYXQodGhpcy5nZXRGaXhlZFJvd3MoKSkpO1xuICAgICAgICBsZXQgcm93c193aXRob3V0X3Rva2VuID0gXy51bmlxKF8ubWFwKHRoaXMuYm9vbVNlcmllcywgKGQ6IHsgcm93X25hbWVfcmF3OiBhbnk7IH0pID0+IGQucm93X25hbWVfcmF3KSk7XG4gICAgICAgIGxldCBjb2xzX2ZvdW5kOiBCb29tRml4ZWRDb2xbXSA9IHRoaXMuX2dldFNvcnRlZENvbHVtbnMob3B0aW9ucy5jb2xzX3NvcnRfdHlwZSk7XG4gICAgICAgIGxldCByb3dfY29sX2NlbGxzOiBJQm9vbUNlbGxEZXRhaWxzW11bXSA9IFtdO1xuICAgICAgICBfLmVhY2gocm93c19mb3VuZCwgKHJvd19uYW1lOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBjb2xzOiBJQm9vbUNlbGxEZXRhaWxzW10gPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChjb2xzX2ZvdW5kLCAoY29sOiBCb29tRml4ZWRDb2wpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY29sX25hbWUgPSBjb2wubmFtZTtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2hlZF9pdGVtczogQm9vbVNlcmllc1tdID0gXy5maWx0ZXIodGhpcy5ib29tU2VyaWVzLCAobzogeyByb3dfbmFtZTogYW55OyBjb2xfbmFtZTogYW55OyBoaWRkZW46IGFueSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvLnJvd19uYW1lID09PSByb3dfbmFtZSAmJiBvLmNvbF9uYW1lID09PSBjb2xfbmFtZSAmJiBvLmhpZGRlbiA9PT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaGVkX2l0ZW1zIHx8IG1hdGNoZWRfaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjZWxsID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xfbmFtZVwiOiBjb2xfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JfYmdcIjogY29sLmJnX2NvbG9yIHx8IG9wdGlvbnMubm9uX21hdGNoaW5nX2NlbGxzX2NvbG9yX2JnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl90ZXh0XCI6IGNvbC50ZXh0X2NvbG9yIHx8IG9wdGlvbnMubm9uX21hdGNoaW5nX2NlbGxzX2NvbG9yX3RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXlfdmFsdWVcIjogcmVwbGFjZVRva2VucyhvcHRpb25zLm5vbl9tYXRjaGluZ19jZWxsc190ZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaGlkZGVuXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpdGVtc1wiOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGlua1wiOiBcIi1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicm93X25hbWVcIjogcm93X25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRvb2x0aXBcIjogXCItXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IE5hTixcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC50b29sdGlwID0gYDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTJweDtjb2xvcjoke2NlbGwuY29sb3JfYmd9O3RleHQtYWxpZ246bGVmdFwiPmAgKyBjZWxsLnRvb2x0aXAgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgY29scy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlZF9pdGVtcyAmJiBtYXRjaGVkX2l0ZW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IG1hdGNoZWRfaXRlbXNbMF0udG9Cb29tQ2VsbERldGFpbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgY2VsbC50b29sdGlwID0gYDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTJweDtjb2xvcjoke2NlbGwuY29sb3JfYmd9O3RleHQtYWxpZ246bGVmdFwiPmAgKyBjZWxsLnRvb2x0aXAgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgY29scy5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlZF9pdGVtcyAmJiBtYXRjaGVkX2l0ZW1zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBtYXRjaGVkX2l0ZW1zWzBdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2VsbDogSUJvb21DZWxsRGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sX25hbWVcIjogY29sX25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yX2JnXCI6IFwiZGFya3JlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvcl90ZXh0XCI6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheV92YWx1ZVwiOiBcIkR1cGxpY2F0ZSBtYXRjaGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhpZGRlblwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIjogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxpbmtcIjogXCItXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJvd19uYW1lXCI6IHJvd19uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b29sdGlwXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IE5hTixcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSB0aGlzLmdldFBhdHRlcm4oaXRlbS5wYXR0ZXJuX2lkLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjbGFzc2lmeSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWluX2lkID0gaXRlbS5jb2xvcl9iZ19pZDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1heF9pZCA9IGl0ZW0uY29sb3JfYmdfaWQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaG9vc2VuOiBCb29tU2VyaWVzID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHRlcm4uZW5hYmxlX211bHRpdmFsdWVfY2VsbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChtYXRjaGVkX2l0ZW1zLCAoaXRlbTogQm9vbVNlcmllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuaXRlbXMucHVzaChpdGVtLnRvQm9vbUNlbGxEZXRhaWxzKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwudG9vbHRpcCArPSBgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxMnB4O2NvbG9yOiR7aXRlbS5jb2xvcl9iZ307dGV4dC1hbGlnbjpsZWZ0XCI+YCArIGl0ZW0udG9vbHRpcCArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW5faWQgPiBpdGVtLmNvbG9yX2JnX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbl9pZCA9IGl0ZW0uY29sb3JfYmdfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXhfaWQgPCBpdGVtLmNvbG9yX2JnX2lkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4X2lkID0gaXRlbS5jb2xvcl9iZ19pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjbGFzc2lmeVtpdGVtLmNvbG9yX2JnX2lkLnRvU3RyaW5nKCldID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NpZnlbaXRlbS5jb2xvcl9iZ19pZC50b1N0cmluZygpXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2lmeVtpdGVtLmNvbG9yX2JnX2lkLnRvU3RyaW5nKCldLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXR0ZXJuLm11bHRpX3ZhbHVlX3Nob3dfcHJpb3JpdHkgPT09IG11bHRpVmFsdWVTaG93UHJpb3JpdGllc1swXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1zOiBCb29tU2VyaWVzW10gPSBjbGFzc2lmeVttaW5faWQudG9TdHJpbmcoKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gaXRlbXNbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiAgID0gaXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV0sIChpdGVtOiBCb29tU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+IGl0ZW0udmFsdWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1zOiBCb29tU2VyaWVzW10gPSBjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gaXRlbXNbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiAgID0gaXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjbGFzc2lmeVttYXhfaWQudG9TdHJpbmcoKV0sIChpdGVtOiBCb29tU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA8IGl0ZW0udmFsdWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlbiA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY29sb3JfYmcgICAgICA9IGNob29zZW4uY29sb3JfYmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbG9yX3RleHQgICAgPSBjaG9vc2VuLmNvbG9yX3RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmRpc3BsYXlfdmFsdWUgPSBjaG9vc2VuLmRpc3BsYXlfdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmxpbmsgICAgICAgICAgPSBjaG9vc2VuLmxpbms7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnZhbHVlICAgICAgICAgPSBjaG9vc2VuLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5oaWRkZW4gICAgICAgID0gY2hvb3Nlbi5oaWRkZW47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKG1hdGNoZWRfaXRlbXMsIChpdGVtOiBCb29tU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5pdGVtcy5wdXNoKGl0ZW0udG9Cb29tQ2VsbERldGFpbHMoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC50b29sdGlwICs9IGA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjEycHg7Y29sb3I6JHtpdGVtLmNvbG9yX2JnfTt0ZXh0LWFsaWduOmxlZnRcIj5gICsgaXRlbS50b29sdGlwICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuZGlzcGxheV92YWx1ZSArPSBcIjogXCIgKyB2YWx1ZXMuam9pbignfCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbHMucHVzaChjZWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJvd19jb2xfY2VsbHMucHVzaChjb2xzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2xzX2ZvdW5kOiBfLm1hcChjb2xzX2ZvdW5kLCAoY29sOiBCb29tRml4ZWRDb2wpID0+IGNvbC5uYW1lKSxcbiAgICAgICAgICAgIHJvd19jb2xfY2VsbHMsXG4gICAgICAgICAgICByb3dzX2ZvdW5kLFxuICAgICAgICAgICAgcm93c193aXRob3V0X3Rva2VuLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JlbW92ZUhpZGRlbkNvbEZyb21UYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9vbVRhYmxlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb2xzX2ZvdW5kID0gdGhpcy5ib29tVGFibGUuY29sc19mb3VuZDtcbiAgICAgICAgZm9yIChsZXQgY29sIG9mIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcykge1xuICAgICAgICAgICAgbGV0IGlkeCA9IGNvbHNfZm91bmQuaW5kZXhPZihjb2wpO1xuICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEgKXtcbiAgICAgICAgICAgICAgICBjb2xzX2ZvdW5kLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9vbVRhYmxlLmNvbHNfZm91bmQgPSBjb2xzX2ZvdW5kO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZVNvcnRDb2xJZHhGb3JUYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYm9vbVRhYmxlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzb3J0aW5nX3Byb3BzID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzO1xuICAgICAgICBpZiAoc29ydGluZ19wcm9wcy5zb3J0X2NvbHVtbiAhPT0gdW5kZWZpbmVkICYmIHNvcnRpbmdfcHJvcHMuc29ydF9jb2x1bW4gIT09IFwiXCIpe1xuICAgICAgICAgICAgbGV0IGlkeCA9IHRoaXMuYm9vbVRhYmxlLmNvbHNfZm91bmQuaW5kZXhPZihzb3J0aW5nX3Byb3BzLnNvcnRfY29sdW1uKTtcbiAgICAgICAgICAgIGlmIChpZHggIT09IC0xKXtcbiAgICAgICAgICAgICAgICBzb3J0aW5nX3Byb3BzLmNvbF9pbmRleCA9IGlkeDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldCBzb3J0IGNvbCBpZHggdG8gXCIgKyBpZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzb3J0aW5nX3Byb3BzLmNvbF9pbmRleCA+PSB0aGlzLmJvb21UYWJsZS5jb2xzX2ZvdW5kLmxlbmd0aCApe1xuICAgICAgICAgICAgc29ydGluZ19wcm9wcy5jb2xfaW5kZXggPSAtMTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBCb29tRHJpdmVyXG59O1xuIl19