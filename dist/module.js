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
                    _this.driver = new BoomDriver_1.BoomDriver(_this.panel);
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
                driver.registerPatterns();
                driver.feedSeries(this.dataReceived);
                driver.genTableData();
                driver.renderHtml();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVQSxtQkFBYSxDQUFDO2dCQUNaLElBQUksRUFBRSxhQUFXLGtCQUFTLDBCQUF1QjtnQkFDakQsS0FBSyxFQUFFLGFBQVcsa0JBQVMsMkJBQXdCO2FBQ3BELENBQUMsQ0FBQzs7Z0JBRStCLHVDQUFnQjtnQkFjaEQsNkJBQVksTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJO29CQUFuQyxZQUNFLGtCQUFNLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FZekI7b0JBekJNLGlCQUFXLEdBQUcsYUFBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNuQyxzQkFBZ0IsR0FBRywyQkFBa0IsQ0FBQztvQkFDdEMsMEJBQW9CLEdBQUcsNkJBQW9CLENBQUM7b0JBQzVDLHFCQUFlLEdBQUcsd0JBQWUsQ0FBQztvQkFDbEMsOEJBQXdCLEdBQUcsaUNBQXdCLENBQUM7b0JBVXpELGdCQUFDLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsZUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM3QyxLQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsSUFBSSxvQkFBYyxDQUFDO29CQUN4RSxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksdUJBQVUsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pDLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNqQixLQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ2hELEtBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDeEMsS0FBSSxD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LElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUU7d0JBQ3RGLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7cUJBQ2pEO2lCQUNGO2dCQUNELElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7Z0JBQzFGLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEdBQUcsSUFBSSxFQUFHLGFBQWEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO2dCQUc3RSxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFFLENBQUM7WUFDdkUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2dyYWZhbmEtc2RrLW1vY2tzL2FwcC9oZWFkZXJzL2NvbW1vbi5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcclxuaW1wb3J0IGtibiBmcm9tICdhcHAvY29yZS91dGlscy9rYm4nO1xyXG5pbXBvcnQgeyBsb2FkUGx1Z2luQ3NzLCBNZXRyaWNzUGFuZWxDdHJsIH0gZnJvbSBcImFwcC9wbHVnaW5zL3Nka1wiO1xyXG5pbXBvcnQgeyBCb29tUGF0dGVybiwgSUJvb21UYWJsZVN0eWxlcyB9IGZyb20gXCIuL2FwcC9ib29tL2luZGV4XCI7XHJcbmltcG9ydCB7IHBsdWdpbl9pZCwgdmFsdWVfbmFtZV9vcHRpb25zLCB0ZXh0QWxpZ25tZW50T3B0aW9ucywgY29sdW1uU29ydFR5cGVzLCBtdWx0aVZhbHVlU2hvd1ByaW9yaXRpZXMsIGNvbmZpZyB9IGZyb20gXCIuL2FwcC9jb25maWdcIjtcclxuaW1wb3J0IHsgZGVmYXVsdFBhdHRlcm4gfSBmcm9tIFwiLi9hcHAvYXBwXCI7XHJcbmltcG9ydCB7IEJvb21Ecml2ZXIgfSBmcm9tIFwiLi9hcHAvYm9vbS9Cb29tRHJpdmVyXCI7XHJcblxyXG5sb2FkUGx1Z2luQ3NzKHtcclxuICBkYXJrOiBgcGx1Z2lucy8ke3BsdWdpbl9pZH0vY3NzL2RlZmF1bHQuZGFyay5jc3NgLFxyXG4gIGxpZ2h0OiBgcGx1Z2lucy8ke3BsdWdpbl9pZH0vY3NzL2RlZmF1bHQubGlnaHQuY3NzYFxyXG59KTtcclxuXHJcbmNsYXNzIEdyYWZhbmFCb29tR3JpZEN0cmwgZXh0ZW5kcyBNZXRyaWNzUGFuZWxDdHJsIHtcclxuICBwdWJsaWMgc3RhdGljIHRlbXBsYXRlVXJsID0gXCJwYXJ0aWFscy9tb2R1bGUuaHRtbFwiO1xyXG4gIHB1YmxpYyB1bml0Rm9ybWF0cyA9IGtibi5nZXRVbml0Rm9ybWF0cygpO1xyXG4gIHB1YmxpYyB2YWx1ZU5hbWVPcHRpb25zID0gdmFsdWVfbmFtZV9vcHRpb25zO1xyXG4gIHB1YmxpYyB0ZXh0QWxpZ25tZW50T3B0aW9ucyA9IHRleHRBbGlnbm1lbnRPcHRpb25zO1xyXG4gIHB1YmxpYyBjb2x1bW5Tb3J0VHlwZXMgPSBjb2x1bW5Tb3J0VHlwZXM7XHJcbiAgcHVibGljIG11bHRpVmFsdWVTaG93UHJpb3JpdGllcyA9IG11bHRpVmFsdWVTaG93UHJpb3JpdGllcztcclxuICBwdWJsaWMgb3V0ZGF0YTtcclxuICBwdWJsaWMgZGF0YVJlY2VpdmVkOiBhbnk7XHJcbiAgcHVibGljIGN0cmw6IGFueTtcclxuICBwdWJsaWMgZWxlbTogYW55O1xyXG4gIHB1YmxpYyBhdHRyczogYW55O1xyXG4gIHB1YmxpYyAkc2NlOiBhbnk7XHJcbiAgcHVibGljIGRyaXZlcjogQm9vbURyaXZlcjtcclxuICBjb25zdHJ1Y3Rvcigkc2NvcGUsICRpbmplY3RvciwgJHNjZSkge1xyXG4gICAgc3VwZXIoJHNjb3BlLCAkaW5qZWN0b3IpO1xyXG4gICAgXy5kZWZhdWx0cyh0aGlzLnBhbmVsLCBjb25maWcucGFuZWxEZWZhdWx0cyk7XHJcbiAgICB0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuID0gdGhpcy5wYW5lbC5kZWZhdWx0UGF0dGVybiB8fCBkZWZhdWx0UGF0dGVybjtcclxuICAgIHRoaXMuZHJpdmVyID0gbmV3IEJvb21Ecml2ZXIodGhpcy5wYW5lbCk7XHJcbiAgICB0aGlzLiRzY2UgPSAkc2NlO1xyXG4gICAgdGhpcy50ZW1wbGF0ZVNydiA9ICRpbmplY3Rvci5nZXQoXCJ0ZW1wbGF0ZVNydlwiKTtcclxuICAgIHRoaXMudGltZVNydiA9ICRpbmplY3Rvci5nZXQoXCJ0aW1lU3J2XCIpO1xyXG4gICAgdGhpcy51cGRhdGVQcm90b3R5cGVzKCk7XHJcbiAgICB0aGlzLmV2ZW50cy5vbihcImRhdGEtcmVjZWl2ZWRcIiwgdGhpcy5vbkRhdGFSZWNlaXZlZC5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuZXZlbnRzLm9uKFwiZGF0YS1zbmFwc2hvdC1sb2FkXCIsIHRoaXMub25EYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmV2ZW50cy5vbihcImluaXQtZWRpdC1tb2RlXCIsIHRoaXMub25Jbml0RWRpdE1vZGUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMSA/IHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoIDogdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXg7XHJcbiAgfVxyXG4gIHByaXZhdGUgdXBkYXRlUHJvdG90eXBlcygpOiB2b2lkIHtcclxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLnBhbmVsLmRlZmF1bHRQYXR0ZXJuLCBCb29tUGF0dGVybi5wcm90b3R5cGUpO1xyXG4gICAgdGhpcy5wYW5lbC5wYXR0ZXJucy5tYXAocGF0dGVybiA9PiB7XHJcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihwYXR0ZXJuLCBCb29tUGF0dGVybi5wcm90b3R5cGUpO1xyXG4gICAgICByZXR1cm4gcGF0dGVybjtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwdWJsaWMgb25EYXRhUmVjZWl2ZWQoZGF0YTogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmRhdGFSZWNlaXZlZCA9IGRhdGE7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgb25Jbml0RWRpdE1vZGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFkZEVkaXRvclRhYihcIlBhdHRlcm5zXCIsIGBwdWJsaWMvcGx1Z2lucy8ke3BsdWdpbl9pZH0vcGFydGlhbHMvZWRpdG9yLmh0bWxgLCAyKTtcclxuICB9XHJcbiAgcHVibGljIGFkZFBhdHRlcm4oKTogdm9pZCB7XHJcbiAgICBsZXQgbmV3UGF0dGVybiA9IG5ldyBCb29tUGF0dGVybih7XHJcbiAgICAgIHJvd19jb2xfd3JhcHBlcjogdGhpcy5wYW5lbC5yb3dfY29sX3dyYXBwZXJcclxuICAgIH0pO1xyXG4gICAgdGhpcy5wYW5lbC5wYXR0ZXJucy5wdXNoKG5ld1BhdHRlcm4pO1xyXG4gICAgdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPSB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9PT0gLTIgPyAtMiA6ICh0aGlzLnBhbmVsLnBhdHRlcm5zLmxlbmd0aCAtIDEpO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIHJlbW92ZVBhdHRlcm4oaW5kZXg6IE51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5wYW5lbC5wYXR0ZXJucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPSB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9PT0gLTIgPyAtMiA6ICgodGhpcy5wYW5lbC5wYXR0ZXJucyAmJiB0aGlzLnBhbmVsLnBhdHRlcm5zLmxlbmd0aCA+IDApID8gKHRoaXMucGFuZWwucGF0dGVybnMubGVuZ3RoIC0gMSkgOiAtMSk7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgbW92ZVBhdHRlcm4oZGlyZWN0aW9uOiBzdHJpbmcsIGluZGV4OiBOdW1iZXIpIHtcclxuICAgIGxldCB0ZW1wRWxlbWVudCA9IHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KV07XHJcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcIlVQXCIpIHtcclxuICAgICAgdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpXSA9IHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KSAtIDFdO1xyXG4gICAgICB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCkgLSAxXSA9IHRlbXBFbGVtZW50O1xyXG4gICAgICB0aGlzLnBhbmVsLmFjdGl2ZVBhdHRlcm5JbmRleCA9IHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID09PSAtMiA/IC0yIDogTnVtYmVyKGluZGV4KSAtIDE7XHJcbiAgICB9XHJcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcIkRPV05cIikge1xyXG4gICAgICB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCldID0gdGhpcy5wYW5lbC5wYXR0ZXJuc1tOdW1iZXIoaW5kZXgpICsgMV07XHJcbiAgICAgIHRoaXMucGFuZWwucGF0dGVybnNbTnVtYmVyKGluZGV4KSArIDFdID0gdGVtcEVsZW1lbnQ7XHJcbiAgICAgIHRoaXMucGFuZWwuYWN0aXZlUGF0dGVybkluZGV4ID0gdGhpcy5wYW5lbC5hY3RpdmVQYXR0ZXJuSW5kZXggPT09IC0yID8gLTIgOiBOdW1iZXIoaW5kZXgpICsgMTtcclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBjbG9uZVBhdHRlcm4oaW5kZXg6IE51bWJlcik6IHZvaWQge1xyXG4gICAgbGV0IGNvcGllZFBhdHRlcm4gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnBhbmVsLnBhdHRlcm5zW051bWJlcihpbmRleCldKTtcclxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihjb3BpZWRQYXR0ZXJuLCBCb29tUGF0dGVybi5wcm90b3R5cGUpO1xyXG4gICAgdGhpcy5wYW5lbC5wYXR0ZXJucy5wdXNoKGNvcGllZFBhdHRlcm4pO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIHNvcnRCeUhlYWRlcihoZWFkZXJJbmRleDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMgfHwge1xyXG4gICAgICBjb2xfaW5kZXg6IC0xLFxyXG4gICAgICBkaXJlY3Rpb246IFwiZGVzY1wiXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmNvbF9pbmRleCA9IGhlYWRlckluZGV4O1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmRpcmVjdGlvbiA9IHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5kaXJlY3Rpb24gPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XHJcbiAgICBjb25zb2xlLmxvZyhcInNvcnRCeUhlYWRlckluZGV4OiBcIiArIGhlYWRlckluZGV4ICsgXCIgaW4gXCIgKyB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuZGlyZWN0aW9uKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBnZW5IaWRkZWxTdHIoKXtcclxuICAgIGxldCBzdHIgPSAnJztcclxuICAgIF8uZWFjaCh0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMsIGl0ZW0gPT4ge1xyXG4gICAgICBzdHIgKz0gaXRlbSArICcsJztcclxuICAgIH0pO1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzX3N0ciA9IHN0cjtcclxuICB9XHJcbiAgcHVibGljIGhpZGRlbkNvbChjb2xOYW1lOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzIHx8IFtdO1xyXG4gICAgaWYgKCBjb2xOYW1lID09PSB1bmRlZmluZWQgfHwgY29sTmFtZSA9PT0gXCJcIil7XHJcbiAgICAgIGNvbE5hbWUgPSB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2lucHV0O1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbE5hbWUgIT09IHVuZGVmaW5lZCAmJiBjb2xOYW1lICE9PSBcIlwiICYmIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scy5pbmRleE9mKGNvbE5hbWUpIDwgMCl7XHJcbiAgICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scy5wdXNoKGNvbE5hbWUpO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coXCJoaWRkZW5Db2w6IFwiICsgY29sTmFtZSk7XHJcbiAgICB0aGlzLmdlbkhpZGRlbFN0cigpO1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9pbnB1dCA9IFwiXCI7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuICBwdWJsaWMgdW5IaWRkZW5Db2woY29sTmFtZTogc3RyaW5nKXtcclxuICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scyA9IHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5fY29scyB8fCBbXTtcclxuICAgIGlmICggY29sTmFtZSA9PT0gdW5kZWZpbmVkIHx8IGNvbE5hbWUgPT09IFwiXCIpe1xyXG4gICAgICBjb2xOYW1lID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9pbnB1dDtcclxuICAgIH1cclxuICAgIGlmIChjb2xOYW1lICE9PSBudWxsICYmIGNvbE5hbWUgIT09IFwiXCIpe1xyXG4gICAgICBsZXQgaWR4ID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzLmluZGV4T2YoY29sTmFtZSk7XHJcbiAgICAgICAgICBpZiAoaWR4ID4gLTEpe1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsLnNvcnRpbmdfcHJvcHMuaGlkZGVuX2NvbHMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcInVuSGlkZGVuQ29sOiBcIiArIGNvbE5hbWUpO1xyXG4gICAgdGhpcy5nZW5IaWRkZWxTdHIoKTtcclxuICAgIHRoaXMucGFuZWwuc29ydGluZ19wcm9wcy5oaWRkZW5faW5wdXQgPSBcIlwiO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxuICB9XHJcbiAgcHVibGljIGxpbWl0VGV4dCh0ZXh0OiBzdHJpbmcsIG1heGxlbmd0aDogTnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGlmICh0ZXh0LnNwbGl0KCcnKS5sZW5ndGggPiBtYXhsZW5ndGgpIHtcclxuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIE51bWJlcihtYXhsZW5ndGgpIC0gMykgKyBcIi4uLlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfVxyXG4gIHB1YmxpYyBsaW5rKHNjb3BlOiBhbnksIGVsZW06IGFueSwgYXR0cnM6IGFueSwgY3RybDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnNjb3BlID0gc2NvcGU7XHJcbiAgICB0aGlzLmVsZW0gPSBlbGVtO1xyXG4gICAgdGhpcy5hdHRycyA9IGF0dHJzO1xyXG4gICAgdGhpcy5jdHJsID0gY3RybDtcclxuICAgIHRoaXMucGFuZWwgPSBjdHJsLnBhbmVsO1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzIHx8IHtcclxuICAgICAgY29sX2luZGV4OiAtMSxcclxuICAgICAgZGlyZWN0aW9uOiBcImRlc2NcIixcclxuICAgICAgc29ydF9jb2x1bW46IFwiXCIsXHJcbiAgICB9O1xyXG4gICAgdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzID0gdGhpcy5wYW5lbC5zb3J0aW5nX3Byb3BzLmhpZGRlbl9jb2xzIHx8IFtdO1xyXG4gIH1cclxufVxyXG5cclxuR3JhZmFuYUJvb21HcmlkQ3RybC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy5kYXRhUmVjZWl2ZWQpe1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB0aGlzLmRyaXZlciA9IG5ldyBCb29tRHJpdmVyKHRoaXMpO1xyXG4gIGxldCBkcml2ZXIgPSB0aGlzLmRyaXZlcjtcclxuXHJcbiAgLy8gcHJlcGFyZSBkYXRhc1xyXG4gIGRyaXZlci5yZWdpc3RlclBhdHRlcm5zKCk7XHJcbiAgZHJpdmVyLmZlZWRTZXJpZXModGhpcy5kYXRhUmVjZWl2ZWQpO1xyXG4gIGRyaXZlci5nZW5UYWJsZURhdGEoKTtcclxuICBkcml2ZXIucmVuZGVySHRtbCgpO1xyXG4gIGNvbnNvbGUubG9nICggZHJpdmVyICk7XHJcblxyXG4gIGxldCBzdHlsZTogSUJvb21UYWJsZVN0eWxlcyA9IGRyaXZlci50Yl9zdHlsZXMhO1xyXG4gIHRoaXMub3V0ZGF0YSA9IHtcclxuICAgIGhlYWRlcl91bml0X3N0eWxlczogc3R5bGUuaGVhZGVyX2ZvbnRfc3R5bGUgKyBzdHlsZS5oZWFkZXJfdW5pdF93aWR0aF9zdHlsZSArIHN0eWxlLmhlYWRlcl91bml0X2hlaWdodF9zdHlsZSArIHN0eWxlLmJvZHlfdW5pdF9wYWRkaW5nX3N0eWxlLFxyXG4gICAgc2hvd19jb2xzOiBkcml2ZXIuZ2V0U2hvd0NvbHVtbnMoKSxcclxuICAgIHRhYmxlX3dpZHRoOiBzdHlsZS53aWR0aF9zdHlsZSxcclxuICB9O1xyXG4gIHRoaXMuZWxlbS5maW5kKCcjYm9vbXRhYmxlX291dHB1dF9ib2R5JykuaHRtbChgYCArIGRyaXZlci5ib29tSHRtbCEuYm9keSk7XHJcbiAgdGhpcy5lbGVtLmZpbmQoJyNib29tdGFibGVfb3V0cHV0X2JvZHlfZGVidWcnKS5odG1sKGRyaXZlci5ib29tSHRtbGQhLmJvZHkpO1xyXG4gIHRoaXMuZWxlbS5maW5kKFwiW2RhdGEtdG9nZ2xlPSd0b29sdGlwJ11cIikudG9vbHRpcCh7XHJcbiAgICBib3VuZGFyeTogXCJzY3JvbGxQYXJlbnRcIlxyXG4gIH0pO1xyXG5cclxuICBsZXQgcm9vdEVsZW0gPSB0aGlzLmVsZW0uZmluZCgnLnRhYmxlLXBhbmVsLXNjcm9sbCcpO1xyXG4gIGxldCBvcmlnaW5hbEhlaWdodCA9IHRoaXMuY3RybC5oZWlnaHQ7XHJcbiAgaWYgKGlzTmFOKG9yaWdpbmFsSGVpZ2h0KSkge1xyXG4gICAgaWYgKHRoaXMuY3RybCAmJiB0aGlzLmN0cmwuZWxlbSAmJiB0aGlzLmN0cmwuZWxlbVswXSAmJiB0aGlzLmN0cmwuZWxlbVswXS5jbGllbnRIZWlnaHQpIHtcclxuICAgICAgb3JpZ2luYWxIZWlnaHQgPSB0aGlzLmN0cmwuZWxlbVswXS5jbGllbnRIZWlnaHQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxldCBtYXhoZWlnaHRvZnBhbmVsID0gdGhpcy5wYW5lbC5kZWJ1Z19tb2RlID8gb3JpZ2luYWxIZWlnaHQgLSAxMTEgOiBvcmlnaW5hbEhlaWdodCAtIDMxO1xyXG4gIHJvb3RFbGVtLmNzcyh7ICdtYXgtaGVpZ2h0JzogbWF4aGVpZ2h0b2ZwYW5lbCArIFwicHhcIiAsICdmb250LWZhbWlseSc6ICflrovkvZMnfSk7XHJcblxyXG5cclxuICBjb25zb2xlLmxvZyggdGhpcy5jdHJsLmhlaWdodCwgdGhpcy5jdHJsLndpZHRoLCB0aGlzLm91dGRhdGEud2lkdGggKTtcclxufTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgR3JhZmFuYUJvb21HcmlkQ3RybCBhcyBQYW5lbEN0cmxcclxufTtcclxuIl19