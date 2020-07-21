System.register(["lodash", "app/core/utils/kbn", "app/plugins/sdk", "./app/boom/index", "./app/config", "./app/app", "./app/boom/BoomPatternData"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var lodash_1, kbn_1, sdk_1, index_1, config_1, app_1, BoomPatternData_1, GrafanaBoomTableCtrl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (app_1_1) {
                app_1 = app_1_1;
            },
            function (BoomPatternData_1_1) {
                BoomPatternData_1 = BoomPatternData_1_1;
            }
        ],
        execute: function () {
            sdk_1.loadPluginCss({
                dark: "plugins/" + config_1.plugin_id + "/css/default.dark.css",
                light: "plugins/" + config_1.plugin_id + "/css/default.light.css"
            });
            GrafanaBoomTableCtrl = (function (_super) {
                __extends(GrafanaBoomTableCtrl, _super);
                function GrafanaBoomTableCtrl($scope, $injector, $sce) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.unitFormats = kbn_1.default.getUnitFormats();
                    _this.valueNameOptions = config_1.value_name_options;
                    _this.textAlignmentOptions = config_1.textAlignmentOptions;
                    _this.columnSortTypes = config_1.columnSortTypes;
                    _this.multiValueShowPriorities = config_1.multiValueShowPriorities;
                    lodash_1.default.defaults(_this.panel, config_1.config.panelDefaults);
                    _this.patternDatas = new BoomPatternData_1.BoomPatternDatas();
                    _this.panel.defaultPattern = _this.panel.defaultPattern || app_1.defaultPattern;
                    _this.$sce = $sce;
                    _this.templateSrv = $injector.get("templateSrv");
                    _this.timeSrv = $injector.get("timeSrv");
                    _this.updatePrototypes();
                    _this.events.on("data-received", _this.onDataReceived.bind(_this));
                    _this.events.on("data-snapshot-load", _this.onDataReceived.bind(_this));
                    _this.events.on("init-edit-mode", _this.onInitEditMode.bind(_this));
                    _this.panel.activePatternIndex = _this.panel.activePatternIndex === -1 ? _this.panel.patterns.length : _this.panel.activePatternIndex;
                    return _this;
                }
                GrafanaBoomTableCtrl.prototype.updatePrototypes = function () {
                    Object.setPrototypeOf(this.panel.defaultPattern, index_1.BoomPattern.prototype);
                    this.panel.patterns.map(function (pattern) {
                        Object.setPrototypeOf(pattern, index_1.BoomPattern.prototype);
                        return pattern;
                    });
                };
                GrafanaBoomTableCtrl.prototype.onDataReceived = function (data) {
                    this.dataReceived = data;
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.onInitEditMode = function () {
                    this.addEditorTab("Patterns", "public/plugins/" + config_1.plugin_id + "/partials/editor.html", 2);
                };
                GrafanaBoomTableCtrl.prototype.addPattern = function () {
                    var newPattern = new index_1.BoomPattern({
                        row_col_wrapper: this.panel.row_col_wrapper
                    });
                    this.panel.patterns.push(newPattern);
                    this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : (this.panel.patterns.length - 1);
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.removePattern = function (index) {
                    this.panel.patterns.splice(index, 1);
                    this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : ((this.panel.patterns && this.panel.patterns.length > 0) ? (this.panel.patterns.length - 1) : -1);
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.movePattern = function (direction, index) {
                    var tempElement = this.panel.patterns[Number(index)];
                    if (direction === "UP") {
                        this.panel.patterns[Number(index)] = this.panel.patterns[Number(index) - 1];
                        this.panel.patterns[Number(index) - 1] = tempElement;
                        this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : Number(index) - 1;
                    }
                    if (direction === "DOWN") {
                        this.panel.patterns[Number(index)] = this.panel.patterns[Number(index) + 1];
                        this.panel.patterns[Number(index) + 1] = tempElement;
                        this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : Number(index) + 1;
                    }
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.clonePattern = function (index) {
                    var copiedPattern = Object.assign({}, this.panel.patterns[Number(index)]);
                    Object.setPrototypeOf(copiedPattern, index_1.BoomPattern.prototype);
                    this.panel.patterns.push(copiedPattern);
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.sortByHeader = function (headerIndex) {
                    this.panel.sorting_props = this.panel.sorting_props || {
                        col_index: -1,
                        direction: "desc"
                    };
                    this.panel.sorting_props.col_index = headerIndex;
                    this.panel.sorting_props.direction = this.panel.sorting_props.direction === "asc" ? "desc" : "asc";
                    console.log("sortByHeaderIndex: " + headerIndex + " in " + this.panel.sorting_props.direction);
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.genHiddelStr = function () {
                    var str = '';
                    lodash_1.default.each(this.panel.sorting_props.hidden_cols, function (item) {
                        str += item + ',';
                    });
                    this.panel.sorting_props.hidden_cols_str = str;
                };
                GrafanaBoomTableCtrl.prototype.hiddenCol = function (colName) {
                    this.panel.sorting_props.hidden_cols = this.panel.sorting_props.hidden_cols || [];
                    if (colName === undefined || colName === "") {
                        colName = this.panel.sorting_props.hidden_input;
                    }
                    if (colName !== undefined && colName !== "" && this.panel.sorting_props.hidden_cols.indexOf(colName) < 0) {
                        this.panel.sorting_props.hidden_cols.push(colName);
                    }
                    console.log("hiddenCol: " + colName);
                    this.genHiddelStr();
                    this.panel.sorting_props.hidden_input = "";
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.unHiddenCol = function (colName) {
                    this.panel.sorting_props.hidden_cols = this.panel.sorting_props.hidden_cols || [];
                    if (colName === undefined || colName === "") {
                        colName = this.panel.sorting_props.hidden_input;
                    }
                    if (colName !== null && colName !== "") {
                        var idx = this.panel.sorting_props.hidden_cols.indexOf(colName);
                        if (idx > -1) {
                            this.panel.sorting_props.hidden_cols.splice(idx, 1);
                        }
                    }
                    console.log("unHiddenCol: " + colName);
                    this.genHiddelStr();
                    this.panel.sorting_props.hidden_input = "";
                    this.render();
                };
                GrafanaBoomTableCtrl.prototype.limitText = function (text, maxlength) {
                    if (text.split('').length > maxlength) {
                        text = text.substring(0, Number(maxlength) - 3) + "...";
                    }
                    return text;
                };
                GrafanaBoomTableCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
                    this.scope = scope;
                    this.elem = elem;
                    this.attrs = attrs;
                    this.ctrl = ctrl;
                    this.panel = ctrl.panel;
                    this.panel.sorting_props = this.panel.sorting_props || {
                        col_index: -1,
                        direction: "desc",
                        sort_column: "",
                    };
                    this.panel.sorting_props.hidden_cols = this.panel.sorting_props.hidden_cols || [];
                };
                GrafanaBoomTableCtrl.templateUrl = "partials/module.html";
                return GrafanaBoomTableCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("PanelCtrl", GrafanaBoomTableCtrl);
            GrafanaBoomTableCtrl.prototype.render = function () {
                var _this = this;
                this.patternDatas = new BoomPatternData_1.BoomPatternDatas();
                this.patternDatas.registerPatterns(this.panel.defaultPattern, this.panel.patterns);
                if (this.dataReceived) {
                    var outputdata = this.dataReceived.map(function (seriesData) {
                        var seriesOptions = {
                            debug_mode: _this.panel.debug_mode,
                            row_col_wrapper: _this.panel.row_col_wrapper || "_"
                        };
                        return new index_1.BoomSeries(seriesData, _this.panel, _this.patternDatas, seriesOptions, _this.templateSrv, _this.timeSrv);
                    });
                    console.log(this.patternDatas);
                    var boomTableTransformationOptions = {
                        cols_sort_type: this.panel.cols_sort_type === config_1.columnSortTypes[1] ? config_1.columnSortTypes[1] : config_1.columnSortTypes[0],
                        non_matching_cells_color_bg: this.panel.non_matching_cells_color_bg,
                        non_matching_cells_color_text: this.panel.non_matching_cells_color_text,
                        non_matching_cells_text: this.panel.non_matching_cells_text,
                    };
                    var boomtabledata = app_1.seriesToTable(outputdata, boomTableTransformationOptions, this.patternDatas);
                    app_1.updateSortColIdxForTable(boomtabledata, this.panel.sorting_props);
                    console.log(boomtabledata);
                    app_1.removeHiddenColFromTable(boomtabledata, this.panel.sorting_props.hidden_cols);
                    var renderingOptions = {
                        default_title_for_rows: this.panel.default_title_for_rows || config_1.config.default_title_for_rows,
                        first_column_link: this.panel.first_column_link || "#",
                        hide_first_column: this.panel.hide_first_column,
                        hide_headers: this.panel.hide_headers,
                        table_unit_height: this.panel.table_unit_height,
                        table_unit_padding: this.panel.table_unit_padding,
                        table_unit_width: this.panel.table_unit_width,
                        text_alignment_firstcolumn: this.panel.text_alignment_firstcolumn,
                        text_alignment_values: this.panel.text_alignment_values,
                    };
                    var boom_output = new index_1.BoomOutput(renderingOptions);
                    this.outdata = {
                        cols_found: boomtabledata.cols_found.map(function (col) { return _this.$sce.trustAsHtml(col); })
                    };
                    var renderingdata = boom_output.getDataAsHTML(boomtabledata, this.panel.sorting_props);
                    this.elem.find('#boomtable_output_body').html("" + renderingdata.body);
                    this.elem.find('#boomtable_output_body_debug').html(this.panel.debug_mode ? boom_output.getDataAsDebugHTML(outputdata) : "");
                    this.elem.find("[data-toggle='tooltip']").tooltip({
                        boundary: "scrollParent"
                    });
                    var rootElem = this.elem.find('.table-panel-scroll');
                    var originalHeight = this.ctrl.height;
                    if (isNaN(originalHeight)) {
                        if (this.ctrl && this.ctrl.elem && this.ctrl.elem[0] && this.ctrl.elem[0].clientHeight) {
                            originalHeight = this.ctrl.elem[0].clientHeight;
                        }
                    }
                    var maxheightofpanel = this.panel.debug_mode ? originalHeight - 111 : originalHeight - 31;
                    rootElem.css({ 'max-height': maxheightofpanel + "px" });
                }
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFXQSxtQkFBYSxDQUFDO2dCQUNaLElBQUksRUFBRSxhQUFXLGtCQUFTLDBCQUF1QjtnQkFDakQsS0FBSyxFQUFFLGFBQVcsa0JBQVMsMkJBQXdCO2FBQ3BELENBQUMsQ0FBQzs7Z0JBRWdDLHdDQUFnQjtnQkFjakQsOEJBQVksTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJO29CQUFuQyxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FZekI7b0JBekJNLGlCQUFXLEdBQUcsYUFBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNuQyxzQkFBZ0IsR0FBRywyQkFBa0IsQ0FBQztvQkFDdEMsMEJBQW9CLEdBQUcsNkJBQW9CLENBQUM7b0JBQzVDLHFCQUFlLEdBQUcsd0JBQWUsQ0FBQztvQkFDbEMsOEJBQXdCLEdBQUcsaUNBQXdCLENBQUM7b0JBVXpELGdCQUFDLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsZUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM3QyxLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksa0NBQWdCLEVBQUUsQ0FBQztvQkFDM0MsS0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLElBQUksb0JBQWMsQ0FBQztvQkFDeEUsS0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2pCLEtBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEQsS0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4QyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FB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QUFDLENBQUM7aUJBQ3pEO1lBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcclxuaW1wb3J0IGtibiBmcm9tICdhcHAvY29yZS91dGlscy9rYm4nO1xyXG5pbXBvcnQgeyBsb2FkUGx1Z2luQ3NzLCBNZXRyaWNzUGFuZWxDdHJsIH0gZnJvbSBcImFwcC9wbHVnaW5zL3Nka1wiO1xyXG5pbXBvcnQgeyBJQm9vbVJlbmRlcmluZ09wdGlvbnMsIElCb29tVGFibGUsIElCb29tSFRNTCwgSUJvb21UYWJsZVRyYW5zZm9ybWF0aW9uT3B0aW9ucyB9IGZyb20gXCIuL2FwcC9ib29tL2luZGV4XCI7XHJcbmltcG9ydCB7IEJvb21QYXR0ZXJuLCBCb29tU2VyaWVzLCBCb29tT3V0cHV0IH0gZnJvbSBcIi4vYXBwL2Jvb20vaW5kZXhcIjtcclxuaW1wb3J0IHsgcGx1Z2luX2lkLCB2YWx1ZV9uYW1lX29wdGlvbnMsIHRleHRBbGlnbm1lbnRPcHRpb25zLCBjb2x1bW5Tb3J0VHlwZXMsIG11bHRpVmFsdWVTaG93UHJpb3JpdGllcywgY29uZmlnIH0gZnJvbSBcIi4vYXBwL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBkZWZhdWx0UGF0dGVybiwgc2VyaWVzVG9UYWJsZSwgcmVtb3ZlSGlkZGVuQ29sRnJvbVRhYmxlLCB1cGRhdGVTb3J0Q29sSWR4Rm9yVGFibGUgfSBmcm9tIFwiLi9hcHAvYXBwXCI7XHJcbmltcG9ydCB7IEJvb21QYXR0ZXJuRGF0YXMgfSBmcm9tIFwiLi9hcHAvYm9vbS9Cb29tUGF0dGVybkRhdGFcIjtcclxuXHJcbmxvYWRQbHVnaW5Dc3Moe1xyXG4gIGRhcms6IGBwbHVnaW5zLyR7cGx1Z2luX2lkfS9jc3MvZGVmYXVsdC5kYXJrLmNzc2AsXHJcbiAgbGlnaHQ6IGBwbHVnaW5zLyR7cGx1Z2luX2lkfS9jc3MvZGVmYXVsdC5saWdodC5jc3NgXHJcbn0pO1xyXG5cclxuY2xhc3MgR3JhZmFuYUJvb21UYWJsZUN0cmwgZXh0ZW5kcyBNZXRyaWNzUGFuZWxDdHJsIHtcclxuICBwdWJsaWMgc3RhdGljIHRlbXBsYXRlVXJsID0gXCJwYXJ0aWFscy9tb2R1bGUuaHRtbFwiO1xyXG4gIHB1YmxpYyB1bml0Rm9ybWF0cyA9IGtibi5nZXRVbml0Rm9ybWF0cygpO1xyXG4gIHB1YmxpYyB2YWx1ZU5hbWVPcHRpb25zID0gdmFsdWVfbmFtZV9vcHRpb25zO1xyXG4gIHB1YmxpYyB0ZXh0QWxpZ25tZW50T3B0aW9ucyA9IHRleHRBbGlnbm1lbnRPcHRpb25zO1xyXG4gIHB1YmxpYyBjb2x1bW5Tb3J0VHlwZXMgPSBjb2x1bW5Tb3J0VHlwZXM7XHJcbiAgcHVibGljIG11bHRpVmFsdWVTaG93UHJpb3JpdGllcyA9IG11bHRpVmFsdWVTaG93UHJpb3JpdGllcztcclxuICBwdWJsaWMgb3V0ZGF0YTtcclxuICBwdWJsaWMgZGF0YVJlY2VpdmVkOiBhbnk7XHJcbiAgcHVibGljIGN0cmw6IGFueTtcclxuICBwdWJsaWMgZWxlbTogYW55O1xyXG4gIHB1YmxpYyBhdHRyczogYW55O1xyXG4gIHB1YmxpYyAkc2NlOiBhbnk7XHJcbiAgcHVibGljIHBhdHRlcm5EYXRhczogQm9vbVBhdHRlcm5EYXRhcztcclxuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRpbmplY3RvciwgJHNjZSkge1xyXG4gICAgc3VwZXIoJHNjb3BlLCAkaW5qZWN0b3IpO1xyXG4gICAgXy5kZWZhdWx0cyh0aGlzLnBhbmVsLCBjb25maWcucGFuZWxEZWZhdWx0cyk7XHJcbiAgICB0aGlzLnBhdHRlcm5EYXRhcyA9IG5ldyBCb29tUGF0dGVybkRhdGFzKCk7XHJcbiAgICB0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuID0gdGhpcy5wYW5lbC5kZWZhdWx0UGF0dGVybiB8fCBkZWZhdWx0UGF0dGVybjtcclxuICAgIHRoaXMuJHNjZSA9ICRzY2U7XHJcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gJGluamVjdG9yLmdldChcInRlbXBsYXRlU3J2XCIpO1xyXG4gICAgdGhpcy50aW1lU3J2ID0gJGluamVjdG9yLmdldChcInRpbWVTcnZcIik7XHJcbiAgICB0aGlzLnVwZGF0ZVByb3RvdHlwZXMoKTtcclxuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1yZWNlaXZlZFwiLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXNuYXBzaG90LWxvYWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuZXZlbnRzLm9uKFwiaW5pdC1lZGl0LW1vZGVcIiwgdGhpcy5vbkluaXRFZGl0TW9kZS5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID0gdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPT09IC0xID8gdGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggOiB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleDtcclxuICB9XHJcbiAgcHJpdmF0ZSB1cGRhdGVQcm90b3R5cGVzKCk6IHZvaWQge1xyXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4sIEJvb21QYXR0ZXJuLnByb3RvdHlwZSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLm1hcChwYXR0ZXJuID0+IHtcclxuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHBhdHRlcm4sIEJvb21QYXR0ZXJuLnByb3RvdHlwZSk7XHJcbiAgICAgIHJldHVybiBwYXR0ZXJuO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBvbkRhdGFSZWNlaXZlZChkYXRhOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuZGF0YVJlY2VpdmVkID0gZGF0YTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBvbkluaXRFZGl0TW9kZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiUGF0dGVybnNcIiwgYHB1YmxpYy9wbHVnaW5zLyR7cGx1Z2luX2lkfS9wYXJ0aWFscy9lZGl0b3IuaHRtbGAsIDIpO1xyXG4gIH1cclxuICBwdWJsaWMgYWRkUGF0dGVybigpOiB2b2lkIHtcclxuICAgIGxldCBuZXdQYXR0ZXJuID0gbmV3IEJvb21QYXR0ZXJuKHtcclxuICAgICAgcm93X2NvbF93cmFwcGVyOiB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2gobmV3UGF0dGVybik7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMiA/IC0yIDogKHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoIC0gMSk7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgcmVtb3ZlUGF0dGVybihpbmRleDogTnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMiA/IC0yIDogKCh0aGlzLnBhbmVsLnBhdHRlcm5zICYmIHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoID4gMCkgPyAodGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggLSAxKSA6IC0xKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBtb3ZlUGF0dGVybihkaXJlY3Rpb246IHN0cmluZywgaW5kZXg6IE51bWJlcikge1xyXG4gICAgbGV0IHRlbXBFbGVtZW50ID0gdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpXTtcclxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiVVBcIikge1xyXG4gICAgICB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCldID0gdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpIC0gMV07XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KSAtIDFdID0gdGVtcEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID0gdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPT09IC0yID8gLTIgOiBOdW1iZXIoaW5kZXgpIC0gMTtcclxuICAgIH1cclxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiRE9XTlwiKSB7XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV0gPSB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCkgKyAxXTtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpICsgMV0gPSB0ZW1wRWxlbWVudDtcclxuICAgICAgdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPSB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9PT0gLTIgPyAtMiA6IE51bWJlcihpbmRleCkgKyAxO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGNsb25lUGF0dGVybihpbmRleDogTnVtYmVyKTogdm9pZCB7XHJcbiAgICBsZXQgY29waWVkUGF0dGVybiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV0pO1xyXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGNvcGllZFBhdHRlcm4sIEJvb21QYXR0ZXJuLnByb3RvdHlwZSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2goY29waWVkUGF0dGVybik7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgc29ydEJ5SGVhZGVyKGhlYWRlckluZGV4OiBudW1iZXIpIHtcclxuICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyA9IHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyB8fCB7XHJcbiAgICAgIGNvbF9pbmRleDogLTEsXHJcbiAgICAgIGRpcmVjdGlvbjogXCJkZXNjXCJcclxuICAgIH07XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuY29sX2luZGV4ID0gaGVhZGVySW5kZXg7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuZGlyZWN0aW9uID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmRpcmVjdGlvbiA9PT0gXCJhc2NcIiA/IFwiZGVzY1wiIDogXCJhc2NcIjtcclxuICAgIGNvbnNvbGUubG9nKFwic29ydEJ5SGVhZGVySW5kZXg6IFwiICsgaGVhZGVySW5kZXggKyBcIiBpbiBcIiArIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5kaXJlY3Rpb24pO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGdlbkhpZGRlbFN0cigpe1xyXG4gICAgbGV0IHN0ciA9ICcnO1xyXG4gICAgXy5lYWNoKHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scywgaXRlbSA9PiB7XHJcbiAgICAgIHN0ciArPSBpdGVtICsgJywnO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHNfc3RyID0gc3RyO1xyXG4gIH1cclxuICBwdWJsaWMgaGlkZGVuQ29sKGNvbE5hbWU6IHN0cmluZyl7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgfHwgW107XHJcbiAgICBpZiAoIGNvbE5hbWUgPT09IHVuZGVmaW5lZCB8fCBjb2xOYW1lID09PSBcIlwiKXtcclxuICAgICAgY29sTmFtZSA9IHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5faW5wdXQ7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sTmFtZSAhPT0gdW5kZWZpbmVkICYmIGNvbE5hbWUgIT09IFwiXCIgJiYgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzLmluZGV4T2YoY29sTmFtZSkgPCAwKXtcclxuICAgICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzLnB1c2goY29sTmFtZSk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcImhpZGRlbkNvbDogXCIgKyBjb2xOYW1lKTtcclxuICAgIHRoaXMuZ2VuSGlkZGVsU3RyKCk7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2lucHV0ID0gXCJcIjtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyB1bkhpZGRlbkNvbChjb2xOYW1lOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzIHx8IFtdO1xyXG4gICAgaWYgKCBjb2xOYW1lID09PSB1bmRlZmluZWQgfHwgY29sTmFtZSA9PT0gXCJcIil7XHJcbiAgICAgIGNvbE5hbWUgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2lucHV0O1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbE5hbWUgIT09IG51bGwgJiYgY29sTmFtZSAhPT0gXCJcIil7XHJcbiAgICAgIGxldCBpZHggPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMuaW5kZXhPZihjb2xOYW1lKTtcclxuICAgICAgICAgIGlmIChpZHggPiAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKFwidW5IaWRkZW5Db2w6IFwiICsgY29sTmFtZSk7XHJcbiAgICB0aGlzLmdlbkhpZGRlbFN0cigpO1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9pbnB1dCA9IFwiXCI7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgbGltaXRUZXh0KHRleHQ6IHN0cmluZywgbWF4bGVuZ3RoOiBOdW1iZXIpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRleHQuc3BsaXQoJycpLmxlbmd0aCA+IG1heGxlbmd0aCkge1xyXG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgTnVtYmVyKG1heGxlbmd0aCkgLSAzKSArIFwiLi4uXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9XHJcbiAgcHVibGljIGxpbmsoc2NvcGU6IGFueSwgZWxlbTogYW55LCBhdHRyczogYW55LCBjdHJsOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcclxuICAgIHRoaXMuZWxlbSA9IGVsZW07XHJcbiAgICB0aGlzLmF0dHJzID0gYXR0cnM7XHJcbiAgICB0aGlzLmN0cmwgPSBjdHJsO1xyXG4gICAgdGhpcy5wYW5lbCA9IGN0cmwucGFuZWw7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgfHwge1xyXG4gICAgICBjb2xfaW5kZXg6IC0xLFxyXG4gICAgICBkaXJlY3Rpb246IFwiZGVzY1wiLFxyXG4gICAgICBzb3J0X2NvbHVtbjogXCJcIixcclxuICAgIH07XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgfHwgW107XHJcbiAgfVxyXG59XHJcblxyXG5HcmFmYW5hQm9vbVRhYmxlQ3RybC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMucGF0dGVybkRhdGFzID0gbmV3IEJvb21QYXR0ZXJuRGF0YXMoKTtcclxuICB0aGlzLnBhdHRlcm5EYXRhcy5yZWdpc3RlclBhdHRlcm5zKHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4sIHRoaXMucGFuZWwucGF0dGVybnMpO1xyXG4gIGlmICh0aGlzLmRhdGFSZWNlaXZlZCkge1xyXG4gICAgbGV0IG91dHB1dGRhdGE6IEJvb21TZXJpZXNbXSA9IHRoaXMuZGF0YVJlY2VpdmVkLm1hcChzZXJpZXNEYXRhID0+IHtcclxuICAgICAgbGV0IHNlcmllc09wdGlvbnMgPSB7XHJcbiAgICAgICAgZGVidWdfbW9kZTogICAgICAgdGhpcy5wYW5lbC5kZWJ1Z19tb2RlLFxyXG4gICAgICAgIHJvd19jb2xfd3JhcHBlcjogIHRoaXMucGFuZWwucm93X2NvbF93cmFwcGVyIHx8IFwiX1wiXHJcbiAgICAgIH07XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCBzZXJpZXNEYXRhICk7XHJcbiAgICAgIHJldHVybiBuZXcgQm9vbVNlcmllcyhzZXJpZXNEYXRhLCB0aGlzLnBhbmVsLCB0aGlzLnBhdHRlcm5EYXRhcywgc2VyaWVzT3B0aW9ucywgdGhpcy50ZW1wbGF0ZVNydiwgdGhpcy50aW1lU3J2KTtcclxuICAgIH0pO1xyXG4gICAgY29uc29sZS5sb2cgKCB0aGlzLnBhdHRlcm5EYXRhcyApO1xyXG4gICAgbGV0IGJvb21UYWJsZVRyYW5zZm9ybWF0aW9uT3B0aW9uczogSUJvb21UYWJsZVRyYW5zZm9ybWF0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgY29sc19zb3J0X3R5cGU6ICAgICAgICAgICAgICAgICB0aGlzLnBhbmVsLmNvbHNfc29ydF90eXBlID09PSBjb2x1bW5Tb3J0VHlwZXNbMV0gPyBjb2x1bW5Tb3J0VHlwZXNbMV0gOiBjb2x1bW5Tb3J0VHlwZXNbMF0sXHJcbiAgICAgIG5vbl9tYXRjaGluZ19jZWxsc19jb2xvcl9iZzogICAgdGhpcy5wYW5lbC5ub25fbWF0Y2hpbmdfY2VsbHNfY29sb3JfYmcsXHJcbiAgICAgIG5vbl9tYXRjaGluZ19jZWxsc19jb2xvcl90ZXh0OiAgdGhpcy5wYW5lbC5ub25fbWF0Y2hpbmdfY2VsbHNfY29sb3JfdGV4dCxcclxuICAgICAgbm9uX21hdGNoaW5nX2NlbGxzX3RleHQ6ICAgICAgICB0aGlzLnBhbmVsLm5vbl9tYXRjaGluZ19jZWxsc190ZXh0LFxyXG4gICAgfTtcclxuICAgIGxldCBib29tdGFibGVkYXRhOiBJQm9vbVRhYmxlID0gc2VyaWVzVG9UYWJsZShvdXRwdXRkYXRhLCBib29tVGFibGVUcmFuc2Zvcm1hdGlvbk9wdGlvbnMsIHRoaXMucGF0dGVybkRhdGFzKTtcclxuICAgIHVwZGF0ZVNvcnRDb2xJZHhGb3JUYWJsZShib29tdGFibGVkYXRhLCB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMpO1xyXG4gICAgY29uc29sZS5sb2coIGJvb210YWJsZWRhdGEgKTtcclxuICAgIHJlbW92ZUhpZGRlbkNvbEZyb21UYWJsZShib29tdGFibGVkYXRhLCB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMpO1xyXG4gICAgbGV0IHJlbmRlcmluZ09wdGlvbnM6IElCb29tUmVuZGVyaW5nT3B0aW9ucyA9IHtcclxuICAgICAgZGVmYXVsdF90aXRsZV9mb3Jfcm93czogICAgIHRoaXMucGFuZWwuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyB8fCBjb25maWcuZGVmYXVsdF90aXRsZV9mb3Jfcm93cyxcclxuICAgICAgZmlyc3RfY29sdW1uX2xpbms6ICAgICAgICAgIHRoaXMucGFuZWwuZmlyc3RfY29sdW1uX2xpbmsgfHwgXCIjXCIsXHJcbiAgICAgIGhpZGVfZmlyc3RfY29sdW1uOiAgICAgICAgICB0aGlzLnBhbmVsLmhpZGVfZmlyc3RfY29sdW1uLFxyXG4gICAgICBoaWRlX2hlYWRlcnM6ICAgICAgICAgICAgICAgdGhpcy5wYW5lbC5oaWRlX2hlYWRlcnMsXHJcbiAgICAgIHRhYmxlX3VuaXRfaGVpZ2h0OiAgICAgICAgICB0aGlzLnBhbmVsLnRhYmxlX3VuaXRfaGVpZ2h0LFxyXG4gICAgICB0YWJsZV91bml0X3BhZGRpbmc6ICAgICAgICAgdGhpcy5wYW5lbC50YWJsZV91bml0X3BhZGRpbmcsXHJcbiAgICAgIHRhYmxlX3VuaXRfd2lkdGg6ICAgICAgICAgICB0aGlzLnBhbmVsLnRhYmxlX3VuaXRfd2lkdGgsXHJcbiAgICAgIHRleHRfYWxpZ25tZW50X2ZpcnN0Y29sdW1uOiB0aGlzLnBhbmVsLnRleHRfYWxpZ25tZW50X2ZpcnN0Y29sdW1uLFxyXG4gICAgICB0ZXh0X2FsaWdubWVudF92YWx1ZXM6ICAgICAgdGhpcy5wYW5lbC50ZXh0X2FsaWdubWVudF92YWx1ZXMsXHJcbiAgICB9O1xyXG4gICAgbGV0IGJvb21fb3V0cHV0ID0gbmV3IEJvb21PdXRwdXQocmVuZGVyaW5nT3B0aW9ucyk7XHJcbiAgICB0aGlzLm91dGRhdGEgPSB7XHJcbiAgICAgIGNvbHNfZm91bmQ6IGJvb210YWJsZWRhdGEuY29sc19mb3VuZC5tYXAoY29sID0+IHsgcmV0dXJuIHRoaXMuJHNjZS50cnVzdEFzSHRtbChjb2wpOyB9KVxyXG4gICAgfTtcclxuICAgIGxldCByZW5kZXJpbmdkYXRhOiBJQm9vbUhUTUwgPSBib29tX291dHB1dC5nZXREYXRhQXNIVE1MKGJvb210YWJsZWRhdGEsIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyk7XHJcbiAgICB0aGlzLmVsZW0uZmluZCgnI2Jvb210YWJsZV9vdXRwdXRfYm9keScpLmh0bWwoYGAgKyByZW5kZXJpbmdkYXRhLmJvZHkpO1xyXG4gICAgdGhpcy5lbGVtLmZpbmQoJyNib29tdGFibGVfb3V0cHV0X2JvZHlfZGVidWcnKS5odG1sKHRoaXMucGFuZWwuZGVidWdfbW9kZSA/IGJvb21fb3V0cHV0LmdldERhdGFBc0RlYnVnSFRNTChvdXRwdXRkYXRhKSA6IGBgKTtcclxuICAgIHRoaXMuZWxlbS5maW5kKFwiW2RhdGEtdG9nZ2xlPSd0b29sdGlwJ11cIikudG9vbHRpcCh7XHJcbiAgICAgIGJvdW5kYXJ5OiBcInNjcm9sbFBhcmVudFwiXHJcbiAgICB9KTtcclxuICAgIGxldCByb290RWxlbSA9IHRoaXMuZWxlbS5maW5kKCcudGFibGUtcGFuZWwtc2Nyb2xsJyk7XHJcbiAgICBsZXQgb3JpZ2luYWxIZWlnaHQgPSB0aGlzLmN0cmwuaGVpZ2h0O1xyXG4gICAgaWYgKGlzTmFOKG9yaWdpbmFsSGVpZ2h0KSkge1xyXG4gICAgICBpZiAodGhpcy5jdHJsICYmIHRoaXMuY3RybC5lbGVtICYmIHRoaXMuY3RybC5lbGVtWzBdICYmIHRoaXMuY3RybC5lbGVtWzBdLmNsaWVudEhlaWdodCkge1xyXG4gICAgICAgIG9yaWdpbmFsSGVpZ2h0ID0gdGhpcy5jdHJsLmVsZW1bMF0uY2xpZW50SGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgbWF4aGVpZ2h0b2ZwYW5lbCA9IHRoaXMucGFuZWwuZGVidWdfbW9kZSA/IG9yaWdpbmFsSGVpZ2h0IC0gMTExIDogb3JpZ2luYWxIZWlnaHQgLSAzMTtcclxuICAgIHJvb3RFbGVtLmNzcyh7ICdtYXgtaGVpZ2h0JzogbWF4aGVpZ2h0b2ZwYW5lbCArIFwicHhcIiB9KTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQge1xyXG4gIEdyYWZhbmFCb29tVGFibGVDdHJsIGFzIFBhbmVsQ3RybFxyXG59O1xyXG4iXX0=