System.register(["lodash", "app/core/utils/kbn", "app/plugins/sdk", "./app/boom/index", "./app/config", "./app/app", "./app/boom/BoomDriver"], function (exports_1, context_1) {
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
    var lodash_1, kbn_1, sdk_1, index_1, config_1, app_1, BoomDriver_1, GrafanaBoomGridCtrl;
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
            function (BoomDriver_1_1) {
                BoomDriver_1 = BoomDriver_1_1;
            }
        ],
        execute: function () {
            sdk_1.loadPluginCss({
                dark: "plugins/" + config_1.plugin_id + "/css/default.dark.css",
                light: "plugins/" + config_1.plugin_id + "/css/default.light.css"
            });
            GrafanaBoomGridCtrl = (function (_super) {
                __extends(GrafanaBoomGridCtrl, _super);
                function GrafanaBoomGridCtrl($scope, $injector, $sce) {
                    var _this = _super.call(this, $scope, $injector) || this;
                    _this.unitFormats = kbn_1.default.getUnitFormats();
                    _this.valueNameOptions = config_1.value_name_options;
                    _this.textAlignmentOptions = config_1.textAlignmentOptions;
                    _this.columnSortTypes = config_1.columnSortTypes;
                    _this.multiValueShowPriorities = config_1.multiValueShowPriorities;
                    lodash_1.default.defaults(_this.panel, config_1.config.panelDefaults);
                    _this.panel.defaultPattern = _this.panel.defaultPattern || app_1.defaultPattern;
                    _this.driver = new BoomDriver_1.BoomDriver(_this);
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
                GrafanaBoomGridCtrl.prototype.updatePrototypes = function () {
                    Object.setPrototypeOf(this.panel.defaultPattern, index_1.BoomPattern.prototype);
                    this.panel.patterns.map(function (pattern) {
                        Object.setPrototypeOf(pattern, index_1.BoomPattern.prototype);
                        return pattern;
                    });
                };
                GrafanaBoomGridCtrl.prototype.onDataReceived = function (data) {
                    this.dataReceived = data;
                    this.render();
                };
                GrafanaBoomGridCtrl.prototype.onInitEditMode = function () {
                    this.addEditorTab("Patterns", "public/plugins/" + config_1.plugin_id + "/partials/editor.html", 2);
                };
                GrafanaBoomGridCtrl.prototype.addPattern = function () {
                    var newPattern = new index_1.BoomPattern({
                        row_col_wrapper: this.panel.row_col_wrapper
                    });
                    this.panel.patterns.push(newPattern);
                    this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : (this.panel.patterns.length - 1);
                    this.render();
                };
                GrafanaBoomGridCtrl.prototype.removePattern = function (index) {
                    this.panel.patterns.splice(index, 1);
                    this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : ((this.panel.patterns && this.panel.patterns.length > 0) ? (this.panel.patterns.length - 1) : -1);
                    this.render();
                };
                GrafanaBoomGridCtrl.prototype.movePattern = function (direction, index) {
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
                GrafanaBoomGridCtrl.prototype.clonePattern = function (index) {
                    var copiedPattern = Object.assign({}, this.panel.patterns[Number(index)]);
                    Object.setPrototypeOf(copiedPattern, index_1.BoomPattern.prototype);
                    this.panel.patterns.push(copiedPattern);
                    this.render();
                };
                GrafanaBoomGridCtrl.prototype.sortByHeader = function (headerIndex) {
                    this.panel.sorting_props = this.panel.sorting_props || {
                        col_index: -1,
                        direction: "desc"
                    };
                    this.panel.sorting_props.col_index = headerIndex;
                    this.panel.sorting_props.direction = this.panel.sorting_props.direction === "asc" ? "desc" : "asc";
                    console.log("sortByHeaderIndex: " + headerIndex + " in " + this.panel.sorting_props.direction);
                    this.render();
                };
                GrafanaBoomGridCtrl.prototype.getPatternData = function (pattern) {
                    return this.driver.getPatternData(pattern.id);
                };
                GrafanaBoomGridCtrl.prototype.genHiddelStr = function () {
                    var str = '';
                    lodash_1.default.each(this.panel.sorting_props.hidden_cols, function (item) {
                        str += item + ',';
                    });
                    this.panel.sorting_props.hidden_cols_str = str;
                };
                GrafanaBoomGridCtrl.prototype.hiddenCol = function (colName) {
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
                GrafanaBoomGridCtrl.prototype.unHiddenCol = function (colName) {
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
                GrafanaBoomGridCtrl.prototype.limitText = function (text, maxlength) {
                    if (text.split('').length > maxlength) {
                        text = text.substring(0, Number(maxlength) - 3) + "...";
                    }
                    return text;
                };
                GrafanaBoomGridCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
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
                GrafanaBoomGridCtrl.templateUrl = "partials/module.html";
                return GrafanaBoomGridCtrl;
            }(sdk_1.MetricsPanelCtrl));
            exports_1("PanelCtrl", GrafanaBoomGridCtrl);
            GrafanaBoomGridCtrl.prototype.render = function () {
                if (!this.dataReceived) {
                    return;
                }
                this.driver = new BoomDriver_1.BoomDriver(this);
                var driver = this.driver;
                driver.doProcessing();
                console.log("cost: ", driver.cost);
                console.log(driver);
                var style = driver.tb_styles;
                this.outdata = {
                    header_unit_styles: style.header_font_style + style.header_unit_width_style + style.header_unit_height_style + style.body_unit_padding_style,
                    show_cols: driver.getShowColumns(),
                    table_width: style.width_style,
                };
                this.elem.find('#boomtable_output_body').html("" + driver.boomHtml.body);
                this.elem.find('#boomtable_output_body_debug').html(driver.boomHtmld.body);
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
                rootElem.css({ 'max-height': maxheightofpanel + "px", 'font-family': '宋体' });
                console.log(this.ctrl.height, this.ctrl.width, this.outdata.width);
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVQSxtQkFBYSxDQUFDO2dCQUNaLElBQUksRUFBRSxhQUFXLGtCQUFTLDBCQUF1QjtnQkFDakQsS0FBSyxFQUFFLGFBQVcsa0JBQVMsMkJBQXdCO2FBQ3BELENBQUMsQ0FBQzs7Z0JBRStCLHVDQUFnQjtnQkFjaEQsNkJBQVksTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJO29CQUFuQyxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FZekI7b0JBekJNLGlCQUFXLEdBQUcsYUFBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNuQyxzQkFBZ0IsR0FBRywyQkFBa0IsQ0FBQztvQkFDdEMsMEJBQW9CLEdBQUcsNkJBQW9CLENBQUM7b0JBQzVDLHFCQUFlLEdBQUcsd0JBQWUsQ0FBQztvQkFDbEMsOEJBQXdCLEdBQUcsaUNBQXdCLENBQUM7b0JBVXpELGdCQUFDLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsZUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM3QyxLQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsSUFBSSxvQkFBYyxDQUFDO29CQUN4RSxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksdUJBQVUsQ0FBQyxLQUFJLENBQUMsQ0FBQztvQkFDbkMsS0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2pCLEtBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDaEQsS0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4QyxLQUFJLENBQUMsZ0JBQWdC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SyxDQUFDLGNBQWMsQ0FBQyxFQUFFO29CQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFO3dCQUN0RixjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO3FCQUNqRDtpQkFDRjtnQkFDRCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUMxRixRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixHQUFHLElBQUksRUFBRyxhQUFhLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztnQkFHN0UsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBRSxDQUFDO1lBQ3ZFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XHJcblxyXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XHJcbmltcG9ydCBrYm4gZnJvbSAnYXBwL2NvcmUvdXRpbHMva2JuJztcclxuaW1wb3J0IHsgbG9hZFBsdWdpbkNzcywgTWV0cmljc1BhbmVsQ3RybCB9IGZyb20gXCJhcHAvcGx1Z2lucy9zZGtcIjtcclxuaW1wb3J0IHsgQm9vbVBhdHRlcm4sIElCb29tVGFibGVTdHlsZXMsIElCb29tUGF0dGVybiwgQm9vbVBhdHRlcm5EYXRhIH0gZnJvbSBcIi4vYXBwL2Jvb20vaW5kZXhcIjtcclxuaW1wb3J0IHsgcGx1Z2luX2lkLCB2YWx1ZV9uYW1lX29wdGlvbnMsIHRleHRBbGlnbm1lbnRPcHRpb25zLCBjb2x1bW5Tb3J0VHlwZXMsIG11bHRpVmFsdWVTaG93UHJpb3JpdGllcywgY29uZmlnIH0gZnJvbSBcIi4vYXBwL2NvbmZpZ1wiO1xyXG5pbXBvcnQgeyBkZWZhdWx0UGF0dGVybiB9IGZyb20gXCIuL2FwcC9hcHBcIjtcclxuaW1wb3J0IHsgQm9vbURyaXZlciB9IGZyb20gXCIuL2FwcC9ib29tL0Jvb21Ecml2ZXJcIjtcclxuXHJcbmxvYWRQbHVnaW5Dc3Moe1xyXG4gIGRhcms6IGBwbHVnaW5zLyR7cGx1Z2luX2lkfS9jc3MvZGVmYXVsdC5kYXJrLmNzc2AsXHJcbiAgbGlnaHQ6IGBwbHVnaW5zLyR7cGx1Z2luX2lkfS9jc3MvZGVmYXVsdC5saWdodC5jc3NgXHJcbn0pO1xyXG5cclxuY2xhc3MgR3JhZmFuYUJvb21HcmlkQ3RybCBleHRlbmRzIE1ldHJpY3NQYW5lbEN0cmwge1xyXG4gIHB1YmxpYyBzdGF0aWMgdGVtcGxhdGVVcmwgPSBcInBhcnRpYWxzL21vZHVsZS5odG1sXCI7XHJcbiAgcHVibGljIHVuaXRGb3JtYXRzID0ga2JuLmdldFVuaXRGb3JtYXRzKCk7XHJcbiAgcHVibGljIHZhbHVlTmFtZU9wdGlvbnMgPSB2YWx1ZV9uYW1lX29wdGlvbnM7XHJcbiAgcHVibGljIHRleHRBbGlnbm1lbnRPcHRpb25zID0gdGV4dEFsaWdubWVudE9wdGlvbnM7XHJcbiAgcHVibGljIGNvbHVtblNvcnRUeXBlcyA9IGNvbHVtblNvcnRUeXBlcztcclxuICBwdWJsaWMgbXVsdGlWYWx1ZVNob3dQcmlvcml0aWVzID0gbXVsdGlWYWx1ZVNob3dQcmlvcml0aWVzO1xyXG4gIHB1YmxpYyBvdXRkYXRhO1xyXG4gIHB1YmxpYyBkYXRhUmVjZWl2ZWQ6IGFueTtcclxuICBwdWJsaWMgY3RybDogYW55O1xyXG4gIHB1YmxpYyBlbGVtOiBhbnk7XHJcbiAgcHVibGljIGF0dHJzOiBhbnk7XHJcbiAgcHVibGljICRzY2U6IGFueTtcclxuICBwdWJsaWMgZHJpdmVyOiBCb29tRHJpdmVyO1xyXG4gIGNvbnN0cnVjdG9yKCRzY29wZSwgJGluamVjdG9yLCAkc2NlKSB7XHJcbiAgICBzdXBlcigkc2NvcGUsICRpbmplY3Rvcik7XHJcbiAgICBfLmRlZmF1bHRzKHRoaXMucGFuZWwsIGNvbmZpZy5wYW5lbERlZmF1bHRzKTtcclxuICAgIHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4gPSB0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuIHx8IGRlZmF1bHRQYXR0ZXJuO1xyXG4gICAgdGhpcy5kcml2ZXIgPSBuZXcgQm9vbURyaXZlcih0aGlzKTtcclxuICAgIHRoaXMuJHNjZSA9ICRzY2U7XHJcbiAgICB0aGlzLnRlbXBsYXRlU3J2ID0gJGluamVjdG9yLmdldChcInRlbXBsYXRlU3J2XCIpO1xyXG4gICAgdGhpcy50aW1lU3J2ID0gJGluamVjdG9yLmdldChcInRpbWVTcnZcIik7XHJcbiAgICB0aGlzLnVwZGF0ZVByb3RvdHlwZXMoKTtcclxuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1yZWNlaXZlZFwiLCB0aGlzLm9uRGF0YVJlY2VpdmVkLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5ldmVudHMub24oXCJkYXRhLXNuYXBzaG90LWxvYWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuZXZlbnRzLm9uKFwiaW5pdC1lZGl0LW1vZGVcIiwgdGhpcy5vbkluaXRFZGl0TW9kZS5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID0gdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPT09IC0xID8gdGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggOiB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleDtcclxuICB9XHJcbiAgcHJpdmF0ZSB1cGRhdGVQcm90b3R5cGVzKCk6IHZvaWQge1xyXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMucGFuZWwuZGVmYXVsdFBhdHRlcm4sIEJvb21QYXR0ZXJuLnByb3RvdHlwZSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLm1hcChwYXR0ZXJuID0+IHtcclxuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHBhdHRlcm4sIEJvb21QYXR0ZXJuLnByb3RvdHlwZSk7XHJcbiAgICAgIHJldHVybiBwYXR0ZXJuO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHB1YmxpYyBvbkRhdGFSZWNlaXZlZChkYXRhOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuZGF0YVJlY2VpdmVkID0gZGF0YTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBvbkluaXRFZGl0TW9kZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuYWRkRWRpdG9yVGFiKFwiUGF0dGVybnNcIiwgYHB1YmxpYy9wbHVnaW5zLyR7cGx1Z2luX2lkfS9wYXJ0aWFscy9lZGl0b3IuaHRtbGAsIDIpO1xyXG4gIH1cclxuICBwdWJsaWMgYWRkUGF0dGVybigpOiB2b2lkIHtcclxuICAgIGxldCBuZXdQYXR0ZXJuID0gbmV3IEJvb21QYXR0ZXJuKHtcclxuICAgICAgcm93X2NvbF93cmFwcGVyOiB0aGlzLnBhbmVsLnJvd19jb2xfd3JhcHBlclxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2gobmV3UGF0dGVybik7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMiA/IC0yIDogKHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoIC0gMSk7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgcmVtb3ZlUGF0dGVybihpbmRleDogTnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMiA/IC0yIDogKCh0aGlzLnBhbmVsLnBhdHRlcm5zICYmIHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoID4gMCkgPyAodGhpcy5wYW5lbC5wYXR0ZXJucy5sZW5ndGggLSAxKSA6IC0xKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBtb3ZlUGF0dGVybihkaXJlY3Rpb246IHN0cmluZywgaW5kZXg6IE51bWJlcikge1xyXG4gICAgbGV0IHRlbXBFbGVtZW50ID0gdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpXTtcclxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiVVBcIikge1xyXG4gICAgICB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCldID0gdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpIC0gMV07XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KSAtIDFdID0gdGVtcEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID0gdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPT09IC0yID8gLTIgOiBOdW1iZXIoaW5kZXgpIC0gMTtcclxuICAgIH1cclxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiRE9XTlwiKSB7XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV0gPSB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCkgKyAxXTtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpICsgMV0gPSB0ZW1wRWxlbWVudDtcclxuICAgICAgdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPSB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9PT0gLTIgPyAtMiA6IE51bWJlcihpbmRleCkgKyAxO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGNsb25lUGF0dGVybihpbmRleDogTnVtYmVyKTogdm9pZCB7XHJcbiAgICBsZXQgY29waWVkUGF0dGVybiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV0pO1xyXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGNvcGllZFBhdHRlcm4sIEJvb21QYXR0ZXJuLnByb3RvdHlwZSk7XHJcbiAgICB0aGlzLnBhbmVsLnBhdHRlcm5zLnB1c2goY29waWVkUGF0dGVybik7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgc29ydEJ5SGVhZGVyKGhlYWRlckluZGV4OiBudW1iZXIpIHtcclxuICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyA9IHRoaXMucGFuZWwuc29ydGluZ19wcm9wcyB8fCB7XHJcbiAgICAgIGNvbF9pbmRleDogLTEsXHJcbiAgICAgIGRpcmVjdGlvbjogXCJkZXNjXCJcclxuICAgIH07XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuY29sX2luZGV4ID0gaGVhZGVySW5kZXg7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuZGlyZWN0aW9uID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmRpcmVjdGlvbiA9PT0gXCJhc2NcIiA/IFwiZGVzY1wiIDogXCJhc2NcIjtcclxuICAgIGNvbnNvbGUubG9nKFwic29ydEJ5SGVhZGVySW5kZXg6IFwiICsgaGVhZGVySW5kZXggKyBcIiBpbiBcIiArIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5kaXJlY3Rpb24pO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGdldFBhdHRlcm5EYXRhKHBhdHRlcm46IElCb29tUGF0dGVybik6IEJvb21QYXR0ZXJuRGF0YXtcclxuICAgIHJldHVybiB0aGlzLmRyaXZlci5nZXRQYXR0ZXJuRGF0YShwYXR0ZXJuLmlkKTtcclxuICB9XHJcbiAgcHVibGljIGdlbkhpZGRlbFN0cigpe1xyXG4gICAgbGV0IHN0ciA9ICcnO1xyXG4gICAgXy5lYWNoKHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scywgaXRlbSA9PiB7XHJcbiAgICAgIHN0ciArPSBpdGVtICsgJywnO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHNfc3RyID0gc3RyO1xyXG4gIH1cclxuICBwdWJsaWMgaGlkZGVuQ29sKGNvbE5hbWU6IHN0cmluZyl7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgfHwgW107XHJcbiAgICBpZiAoIGNvbE5hbWUgPT09IHVuZGVmaW5lZCB8fCBjb2xOYW1lID09PSBcIlwiKXtcclxuICAgICAgY29sTmFtZSA9IHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5faW5wdXQ7XHJcbiAgICB9XHJcbiAgICBpZiAoY29sTmFtZSAhPT0gdW5kZWZpbmVkICYmIGNvbE5hbWUgIT09IFwiXCIgJiYgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzLmluZGV4T2YoY29sTmFtZSkgPCAwKXtcclxuICAgICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzLnB1c2goY29sTmFtZSk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcImhpZGRlbkNvbDogXCIgKyBjb2xOYW1lKTtcclxuICAgIHRoaXMuZ2VuSGlkZGVsU3RyKCk7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2lucHV0ID0gXCJcIjtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyB1bkhpZGRlbkNvbChjb2xOYW1lOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzIHx8IFtdO1xyXG4gICAgaWYgKCBjb2xOYW1lID09PSB1bmRlZmluZWQgfHwgY29sTmFtZSA9PT0gXCJcIil7XHJcbiAgICAgIGNvbE5hbWUgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2lucHV0O1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbE5hbWUgIT09IG51bGwgJiYgY29sTmFtZSAhPT0gXCJcIil7XHJcbiAgICAgIGxldCBpZHggPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMuaW5kZXhPZihjb2xOYW1lKTtcclxuICAgICAgICAgIGlmIChpZHggPiAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKFwidW5IaWRkZW5Db2w6IFwiICsgY29sTmFtZSk7XHJcbiAgICB0aGlzLmdlbkhpZGRlbFN0cigpO1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9pbnB1dCA9IFwiXCI7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgbGltaXRUZXh0KHRleHQ6IHN0cmluZywgbWF4bGVuZ3RoOiBOdW1iZXIpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRleHQuc3BsaXQoJycpLmxlbmd0aCA+IG1heGxlbmd0aCkge1xyXG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgTnVtYmVyKG1heGxlbmd0aCkgLSAzKSArIFwiLi4uXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9XHJcbiAgcHVibGljIGxpbmsoc2NvcGU6IGFueSwgZWxlbTogYW55LCBhdHRyczogYW55LCBjdHJsOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcclxuICAgIHRoaXMuZWxlbSA9IGVsZW07XHJcbiAgICB0aGlzLmF0dHJzID0gYXR0cnM7XHJcbiAgICB0aGlzLmN0cmwgPSBjdHJsO1xyXG4gICAgdGhpcy5wYW5lbCA9IGN0cmwucGFuZWw7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgfHwge1xyXG4gICAgICBjb2xfaW5kZXg6IC0xLFxyXG4gICAgICBkaXJlY3Rpb246IFwiZGVzY1wiLFxyXG4gICAgICBzb3J0X2NvbHVtbjogXCJcIixcclxuICAgIH07XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMgfHwgW107XHJcbiAgfVxyXG59XHJcblxyXG5HcmFmYW5hQm9vbUdyaWRDdHJsLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCF0aGlzLmRhdGFSZWNlaXZlZCl7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHRoaXMuZHJpdmVyID0gbmV3IEJvb21Ecml2ZXIodGhpcyk7XHJcbiAgbGV0IGRyaXZlciA9IHRoaXMuZHJpdmVyO1xyXG5cclxuICBkcml2ZXIuZG9Qcm9jZXNzaW5nKCk7XHJcbiAgY29uc29sZS5sb2cgKCBcImNvc3Q6IFwiLCBkcml2ZXIuY29zdCk7XHJcbiAgY29uc29sZS5sb2cgKCBkcml2ZXIgKTtcclxuXHJcbiAgbGV0IHN0eWxlOiBJQm9vbVRhYmxlU3R5bGVzID0gZHJpdmVyLnRiX3N0eWxlcyE7XHJcbiAgdGhpcy5vdXRkYXRhID0ge1xyXG4gICAgaGVhZGVyX3VuaXRfc3R5bGVzOiBzdHlsZS5oZWFkZXJfZm9udF9zdHlsZSArIHN0eWxlLmhlYWRlcl91bml0X3dpZHRoX3N0eWxlICsgc3R5bGUuaGVhZGVyX3VuaXRfaGVpZ2h0X3N0eWxlICsgc3R5bGUuYm9keV91bml0X3BhZGRpbmdfc3R5bGUsXHJcbiAgICBzaG93X2NvbHM6IGRyaXZlci5nZXRTaG93Q29sdW1ucygpLFxyXG4gICAgdGFibGVfd2lkdGg6IHN0eWxlLndpZHRoX3N0eWxlLFxyXG4gIH07XHJcbiAgdGhpcy5lbGVtLmZpbmQoJyNib29tdGFibGVfb3V0cHV0X2JvZHknKS5odG1sKGBgICsgZHJpdmVyLmJvb21IdG1sIS5ib2R5KTtcclxuICB0aGlzLmVsZW0uZmluZCgnI2Jvb210YWJsZV9vdXRwdXRfYm9keV9kZWJ1ZycpLmh0bWwoZHJpdmVyLmJvb21IdG1sZCEuYm9keSk7XHJcbiAgdGhpcy5lbGVtLmZpbmQoXCJbZGF0YS10b2dnbGU9J3Rvb2x0aXAnXVwiKS50b29sdGlwKHtcclxuICAgIGJvdW5kYXJ5OiBcInNjcm9sbFBhcmVudFwiXHJcbiAgfSk7XHJcblxyXG4gIGxldCByb290RWxlbSA9IHRoaXMuZWxlbS5maW5kKCcudGFibGUtcGFuZWwtc2Nyb2xsJyk7XHJcbiAgbGV0IG9yaWdpbmFsSGVpZ2h0ID0gdGhpcy5jdHJsLmhlaWdodDtcclxuICBpZiAoaXNOYU4ob3JpZ2luYWxIZWlnaHQpKSB7XHJcbiAgICBpZiAodGhpcy5jdHJsICYmIHRoaXMuY3RybC5lbGVtICYmIHRoaXMuY3RybC5lbGVtWzBdICYmIHRoaXMuY3RybC5lbGVtWzBdLmNsaWVudEhlaWdodCkge1xyXG4gICAgICBvcmlnaW5hbEhlaWdodCA9IHRoaXMuY3RybC5lbGVtWzBdLmNsaWVudEhlaWdodDtcclxuICAgIH1cclxuICB9XHJcbiAgbGV0IG1heGhlaWdodG9mcGFuZWwgPSB0aGlzLnBhbmVsLmRlYnVnX21vZGUgPyBvcmlnaW5hbEhlaWdodCAtIDExMSA6IG9yaWdpbmFsSGVpZ2h0IC0gMzE7XHJcbiAgcm9vdEVsZW0uY3NzKHsgJ21heC1oZWlnaHQnOiBtYXhoZWlnaHRvZnBhbmVsICsgXCJweFwiICwgJ2ZvbnQtZmFtaWx5JzogJ+Wui+S9kyd9KTtcclxuXHJcblxyXG4gIGNvbnNvbGUubG9nKCB0aGlzLmN0cmwuaGVpZ2h0LCB0aGlzLmN0cmwud2lkdGgsIHRoaXMub3V0ZGF0YS53aWR0aCApO1xyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICBHcmFmYW5hQm9vbUdyaWRDdHJsIGFzIFBhbmVsQ3RybFxyXG59O1xyXG4iXX0=