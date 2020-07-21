System.register(["./index"], function (exports_1, context_1) {
    "use strict";
    var index_1, BoomFixedRow, BoomFixedCol, BoomCustomParsingValue, BoomPattern;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            BoomFixedRow = (function () {
                function BoomFixedRow(name) {
                    this.sort_as = "";
                    this.match = "";
                    this.name = name;
                }
                return BoomFixedRow;
            }());
            exports_1("BoomFixedRow", BoomFixedRow);
            BoomFixedCol = (function () {
                function BoomFixedCol(name) {
                    this.sort_as = "";
                    this.show_as = "";
                    this.name = name;
                }
                return BoomFixedCol;
            }());
            exports_1("BoomFixedCol", BoomFixedCol);
            BoomCustomParsingValue = (function () {
                function BoomCustomParsingValue() {
                    this.label = "";
                    this.get = "";
                }
                return BoomCustomParsingValue;
            }());
            BoomPattern = (function () {
                function BoomPattern(options) {
                    this.row_col_wrapper = "_";
                    if (options && options.row_col_wrapper) {
                        this.row_col_wrapper = options.row_col_wrapper;
                    }
                    this.bgColors = options && options.bgColors ? options.bgColors : "green|orange|red";
                    this.bgColors_overrides = options && options.bgColors_overrides ? options.bgColors_overrides : "0->green|2->red|1->yellow";
                    this.textColors = options && options.textColors ? options.textColors : "red|orange|green";
                    this.textColors_overrides = options && options.textColors_overrides ? options.textColors_overrides : "0->red|2->green|1->yellow";
                    this.clickable_cells_link = options && options.clickable_cells_link ? options.clickable_cells_link : "";
                    this.col_name = options && options.col_name ? options.col_name : this.row_col_wrapper + "1" + this.row_col_wrapper;
                    this.col_name_as_fixed_row = false;
                    this.decimals = options && options.decimals ? options.decimals : 2;
                    this.delimiter = options && options.delimiter ? options.delimiter : ".";
                    this.displayTemplate = options && options.displayTemplate ? options.displayTemplate : "_value_";
                    this.defaultBGColor = options && options.defaultBGColor ? options.defaultBGColor : "";
                    this.defaultTextColor = options && options.defaultTextColor ? options.defaultTextColor : "";
                    this.enable_bgColor = false;
                    this.enable_bgColor_overrides = false;
                    this.enable_textColor = false;
                    this.enable_textColor_overrides = false;
                    this.enable_clickable_cells = false;
                    this.enable_multivalue_cells = false;
                    this.enable_time_based_thresholds = false;
                    this.enable_filtered_thresholds = false;
                    this.enable_transform = false;
                    this.enable_transform_overrides = false;
                    this.id = -2;
                    this.filter = {
                        value_above: "",
                        value_below: "",
                    };
                    this.fixed_rows = [];
                    this.fixed_cols = [];
                    this.custom_parsing_values = [];
                    this.format = options && options.format ? options.format : "none";
                    this.name = options && options.name ? options.name : "New Pattern";
                    this.null_color = options && options.null_color ? options.null_color : "darkred";
                    this.null_textcolor = options && options.null_Textcolor ? options.null_Textcolor : "black";
                    this.null_value = options && options.null_value ? options.null_value : "No data";
                    this.multi_value_show_priority = "Maximum";
                    this.pattern = options && options.pattern ? options.pattern : "^server.*cpu$";
                    this.row_name = options && options.row_name ? options.row_name : this.row_col_wrapper + "0" + this.row_col_wrapper;
                    this.thresholds = options && options.thresholds ? options.thresholds : "70,90";
                    this.filtered_thresholds = [];
                    this.time_based_thresholds = [];
                    this.transform_values = options && options.transform_values ? options.transform_values : "_value_|_value_|_value_";
                    this.transform_values_overrides = options && options.transform_values_overrides ? options.transform_values_overrides : "0->down|1->up";
                    this.tooltipTemplate = options && options.tooltipTemplate ? options.tooltipTemplate : "Series : _series_ <br/>Row Name : _row_name_ <br/>Col Name : _col_name_ <br/>Value : _value_";
                    this.valueName = options && options.valueName ? options.valueName : "avg";
                    this.grid_pattern = this.pattern;
                    this.grid_delimiter = this.delimiter;
                    this.grid_index = 0;
                    this.grid_data_join = "";
                    this.grid_row_cnt = 0;
                }
                return BoomPattern;
            }());
            exports_1("BoomPattern", BoomPattern);
            BoomPattern.prototype.inverseBGColors = function () {
                this.bgColors = this.bgColors ? this.bgColors.split("|").reverse().join("|") : "";
            };
            BoomPattern.prototype.inverseTextColors = function () {
                this.textColors = this.textColors ? this.textColors.split("|").reverse().join("|") : "";
            };
            BoomPattern.prototype.inverseTransformValues = function () {
                this.transform_values = this.transform_values ? this.transform_values.split("|").reverse().join("|") : "";
            };
            BoomPattern.prototype.add_time_based_thresholds = function () {
                var new_time_based_threshold = new index_1.BoomTimeBasedThreshold();
                this.time_based_thresholds = this.time_based_thresholds || [];
                this.time_based_thresholds.push(new_time_based_threshold);
            };
            BoomPattern.prototype.remove_time_based_thresholds = function (index) {
                if (this.time_based_thresholds.length > 0) {
                    this.time_based_thresholds.splice(Number(index), 1);
                }
            };
            BoomPattern.prototype.add_filter_thresholds = function () {
                var new_filter_threshold = new index_1.BoomFilteredThreshold();
                this.filtered_thresholds = this.filtered_thresholds || [];
                this.filtered_thresholds.push(new_filter_threshold);
            };
            BoomPattern.prototype.remove_filter_thresholds = function (index) {
                if (this.filtered_thresholds.length > 0) {
                    this.filtered_thresholds.splice(Number(index), 1);
                }
            };
            BoomPattern.prototype.add_fixed_row = function () {
                this.fixed_rows = this.fixed_rows || [];
                this.fixed_rows.push(new BoomFixedRow(this.fixed_rows.length.toString()));
            };
            BoomPattern.prototype.remove_fixed_row = function (index) {
                if (this.fixed_rows.length > 0) {
                    this.fixed_rows.splice(Number(index), 1);
                }
            };
            BoomPattern.prototype.add_fixed_col = function () {
                this.fixed_cols = this.fixed_cols || [];
                this.fixed_cols.push(new BoomFixedCol(this.fixed_cols.length.toString()));
            };
            BoomPattern.prototype.remove_fixed_col = function (index) {
                if (this.fixed_cols.length > 0) {
                    this.fixed_cols.splice(Number(index), 1);
                }
            };
            BoomPattern.prototype.add_custom_parsing_value = function () {
                this.custom_parsing_values = this.custom_parsing_values || [];
                this.custom_parsing_values.push(new BoomCustomParsingValue());
            };
            BoomPattern.prototype.remove_custom_parsing_value = function (index) {
                if (this.custom_parsing_values.length > 0) {
                    this.custom_parsing_values.splice(Number(index), 1);
                }
            };
            BoomPattern.prototype.setUnitFormat = function (format) {
                this.format = format && format.value ? format.value : "none";
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVBhdHRlcm4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2Jvb20vQm9vbVBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFHQTtnQkFJSSxzQkFBWSxJQUFZO29CQUZqQixZQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNiLFVBQUssR0FBRyxFQUFFLENBQUM7b0JBRWQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0wsbUJBQUM7WUFBRCxDQUFDLEFBUEQsSUFPQzs7WUFFRDtnQkFJSSxzQkFBWSxJQUFZO29CQUZqQixZQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNiLFlBQU8sR0FBRyxFQUFFLENBQUM7b0JBRWhCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixDQUFDO2dCQUNMLG1CQUFDO1lBQUQsQ0FBQyxBQVBELElBT0M7O1lBRUQ7Z0JBQUE7b0JBQ1csVUFBSyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxRQUFHLEdBQUssRUFBRSxDQUFDO2dCQUN0QixDQUFDO2dCQUFELDZCQUFDO1lBQUQsQ0FBQyxBQUhELElBR0M7WUFFRDtnQkFrRUkscUJBQVksT0FBWTtvQkFqRWhCLG9CQUFlLEdBQUcsR0FBRyxDQUFDO29CQWtFMUIsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLGVBQWUsRUFBRTt3QkFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO3FCQUNsRDtvQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDcEYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFB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dGVudCI6WyJpbXBvcnQgeyBJQm9vbVBhdHRlcm4sIElCb29tVGltZUJhc2VkVGhyZXNob2xkLCBCb29tVGltZUJhc2VkVGhyZXNob2xkLCBJQm9vbUZpbHRlcmVkVGhyZXNob2xkLCBCb29tRmlsdGVyZWRUaHJlc2hvbGQgfSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHsgSUJvb21GaXhlZFJvdywgSUJvb21GaXhlZENvbCwgSUJvb21DdXN0b21QYXJzaW5nVmFsdWUgfSBmcm9tIFwiLi9Cb29tLmludGVyZmFjZVwiO1xuXG5jbGFzcyBCb29tRml4ZWRSb3cgaW1wbGVtZW50cyBJQm9vbUZpeGVkUm93IHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBzb3J0X2FzID0gXCJcIjtcbiAgICBwdWJsaWMgbWF0Y2ggPSBcIlwiO1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbn1cblxuY2xhc3MgQm9vbUZpeGVkQ29sIGltcGxlbWVudHMgSUJvb21GaXhlZENvbCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgc29ydF9hcyA9IFwiXCI7XG4gICAgcHVibGljIHNob3dfYXMgPSBcIlwiO1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbn1cblxuY2xhc3MgQm9vbUN1c3RvbVBhcnNpbmdWYWx1ZSBpbXBsZW1lbnRzIElCb29tQ3VzdG9tUGFyc2luZ1ZhbHVle1xuICAgIHB1YmxpYyBsYWJlbCA9IFwiXCI7XG4gICAgcHVibGljIGdldCAgID0gXCJcIjtcbn1cblxuY2xhc3MgQm9vbVBhdHRlcm4gaW1wbGVtZW50cyBJQm9vbVBhdHRlcm4ge1xuICAgIHByaXZhdGUgcm93X2NvbF93cmFwcGVyID0gXCJfXCI7XG4gICAgcHVibGljIGJnQ29sb3JzOiBzdHJpbmc7XG4gICAgcHVibGljIGJnQ29sb3JzX292ZXJyaWRlczogc3RyaW5nO1xuICAgIHB1YmxpYyBjbGlja2FibGVfY2VsbHNfbGluazogc3RyaW5nO1xuICAgIHB1YmxpYyBjb2xfbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBjb2xfbmFtZV9hc19maXhlZF9yb3c6IGJvb2xlYW47XG4gICAgcHVibGljIGRpc3BsYXlUZW1wbGF0ZTogc3RyaW5nO1xuICAgIHB1YmxpYyBkZWZhdWx0QkdDb2xvcjogc3RyaW5nO1xuICAgIHB1YmxpYyBkZWZhdWx0VGV4dENvbG9yOiBzdHJpbmc7XG4gICAgcHVibGljIGRlY2ltYWxzOiBOdW1iZXI7XG4gICAgcHVibGljIGRlbGltaXRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBlbmFibGVfYmdDb2xvcjogQm9vbGVhbjtcbiAgICBwdWJsaWMgZW5hYmxlX2JnQ29sb3Jfb3ZlcnJpZGVzOiBCb29sZWFuO1xuICAgIHB1YmxpYyBlbmFibGVfbXVsdGl2YWx1ZV9jZWxsczogQm9vbGVhbjtcbiAgICBwdWJsaWMgZW5hYmxlX2NsaWNrYWJsZV9jZWxsczogQm9vbGVhbjtcbiAgICBwdWJsaWMgZW5hYmxlX3RleHRDb2xvcjogQm9vbGVhbjtcbiAgICBwdWJsaWMgZW5hYmxlX3RleHRDb2xvcl9vdmVycmlkZXM6IEJvb2xlYW47XG4gICAgcHVibGljIGVuYWJsZV90aW1lX2Jhc2VkX3RocmVzaG9sZHM6IEJvb2xlYW47XG4gICAgcHVibGljIGVuYWJsZV9maWx0ZXJlZF90aHJlc2hvbGRzOiBCb29sZWFuO1xuICAgIHB1YmxpYyBlbmFibGVfdHJhbnNmb3JtOiBCb29sZWFuO1xuICAgIHB1YmxpYyBlbmFibGVfdHJhbnNmb3JtX292ZXJyaWRlczogQm9vbGVhbjtcbiAgICBwdWJsaWMgZmlsdGVyOiB7XG4gICAgICAgIHZhbHVlX2Fib3ZlOiBzdHJpbmc7XG4gICAgICAgIHZhbHVlX2JlbG93OiBzdHJpbmc7XG4gICAgfTtcbiAgICBwdWJsaWMgZml4ZWRfcm93czogSUJvb21GaXhlZFJvd1tdO1xuICAgIHB1YmxpYyBmaXhlZF9jb2xzOiBJQm9vbUZpeGVkQ29sW107XG4gICAgcHVibGljIGN1c3RvbV9wYXJzaW5nX3ZhbHVlczogSUJvb21DdXN0b21QYXJzaW5nVmFsdWVbXTtcbiAgICBwdWJsaWMgZm9ybWF0OiBzdHJpbmc7XG4gICAgcHVibGljIGlkOiBudW1iZXI7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgbnVsbF9jb2xvcjogc3RyaW5nO1xuICAgIHB1YmxpYyBudWxsX3ZhbHVlOiBzdHJpbmc7XG4gICAgcHVibGljIG51bGxfdGV4dGNvbG9yOiBzdHJpbmc7XG4gICAgcHVibGljIG11bHRpX3ZhbHVlX3Nob3dfcHJpb3JpdHk6IHN0cmluZztcbiAgICBwdWJsaWMgcGF0dGVybjogc3RyaW5nO1xuICAgIHB1YmxpYyByb3dfbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB0ZXh0Q29sb3JzOiBzdHJpbmc7XG4gICAgcHVibGljIHRleHRDb2xvcnNfb3ZlcnJpZGVzOiBzdHJpbmc7XG4gICAgcHVibGljIHRocmVzaG9sZHM6IHN0cmluZztcbiAgICBwdWJsaWMgZmlsdGVyZWRfdGhyZXNob2xkczogSUJvb21GaWx0ZXJlZFRocmVzaG9sZFtdO1xuICAgIHB1YmxpYyB0aW1lX2Jhc2VkX3RocmVzaG9sZHM6IElCb29tVGltZUJhc2VkVGhyZXNob2xkW107XG4gICAgcHVibGljIHRyYW5zZm9ybV92YWx1ZXM6IHN0cmluZztcbiAgICBwdWJsaWMgdHJhbnNmb3JtX3ZhbHVlc19vdmVycmlkZXM6IHN0cmluZztcbiAgICBwdWJsaWMgdG9vbHRpcFRlbXBsYXRlOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBpbnZlcnNlQkdDb2xvcnM7XG4gICAgcHVibGljIGludmVyc2VUZXh0Q29sb3JzO1xuICAgIHB1YmxpYyBpbnZlcnNlVHJhbnNmb3JtVmFsdWVzO1xuICAgIHB1YmxpYyBhZGRfdGltZV9iYXNlZF90aHJlc2hvbGRzO1xuICAgIHB1YmxpYyByZW1vdmVfdGltZV9iYXNlZF90aHJlc2hvbGRzO1xuICAgIHB1YmxpYyBhZGRfZmlsdGVyX3RocmVzaG9sZHM7XG4gICAgcHVibGljIHJlbW92ZV9maWx0ZXJfdGhyZXNob2xkcztcbiAgICBwdWJsaWMgYWRkX2ZpeGVkX3JvdztcbiAgICBwdWJsaWMgcmVtb3ZlX2ZpeGVkX3JvdztcbiAgICBwdWJsaWMgYWRkX2ZpeGVkX2NvbDtcbiAgICBwdWJsaWMgcmVtb3ZlX2ZpeGVkX2NvbDtcbiAgICBwdWJsaWMgYWRkX2N1c3RvbV9wYXJzaW5nX3ZhbHVlO1xuICAgIHB1YmxpYyByZW1vdmVfY3VzdG9tX3BhcnNpbmdfdmFsdWU7XG4gICAgcHVibGljIHNldFVuaXRGb3JtYXQ7XG4gICAgcHVibGljIGdyaWRfcGF0dGVybjogc3RyaW5nO1xuICAgIHB1YmxpYyBncmlkX2RlbGltaXRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBncmlkX2luZGV4OiBudW1iZXI7XG4gICAgcHVibGljIGdyaWRfZGF0YV9qb2luOiBzdHJpbmc7XG4gICAgcHVibGljIGdyaWRfcm93X2NudDogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IGFueSkge1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJvd19jb2xfd3JhcHBlcikge1xuICAgICAgICAgICAgdGhpcy5yb3dfY29sX3dyYXBwZXIgPSBvcHRpb25zLnJvd19jb2xfd3JhcHBlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJnQ29sb3JzID0gb3B0aW9ucyAmJiBvcHRpb25zLmJnQ29sb3JzID8gb3B0aW9ucy5iZ0NvbG9ycyA6IFwiZ3JlZW58b3JhbmdlfHJlZFwiO1xuICAgICAgICB0aGlzLmJnQ29sb3JzX292ZXJyaWRlcyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5iZ0NvbG9yc19vdmVycmlkZXMgPyBvcHRpb25zLmJnQ29sb3JzX292ZXJyaWRlcyA6IFwiMC0+Z3JlZW58Mi0+cmVkfDEtPnllbGxvd1wiO1xuICAgICAgICB0aGlzLnRleHRDb2xvcnMgPSBvcHRpb25zICYmIG9wdGlvbnMudGV4dENvbG9ycyA/IG9wdGlvbnMudGV4dENvbG9ycyA6IFwicmVkfG9yYW5nZXxncmVlblwiO1xuICAgICAgICB0aGlzLnRleHRDb2xvcnNfb3ZlcnJpZGVzID0gb3B0aW9ucyAmJiBvcHRpb25zLnRleHRDb2xvcnNfb3ZlcnJpZGVzID8gb3B0aW9ucy50ZXh0Q29sb3JzX292ZXJyaWRlcyA6IFwiMC0+cmVkfDItPmdyZWVufDEtPnllbGxvd1wiO1xuICAgICAgICB0aGlzLmNsaWNrYWJsZV9jZWxsc19saW5rID0gb3B0aW9ucyAmJiBvcHRpb25zLmNsaWNrYWJsZV9jZWxsc19saW5rID8gb3B0aW9ucy5jbGlja2FibGVfY2VsbHNfbGluayA6IFwiXCI7XG4gICAgICAgIHRoaXMuY29sX25hbWUgPSBvcHRpb25zICYmIG9wdGlvbnMuY29sX25hbWUgPyBvcHRpb25zLmNvbF9uYW1lIDogdGhpcy5yb3dfY29sX3dyYXBwZXIgKyBcIjFcIiArIHRoaXMucm93X2NvbF93cmFwcGVyO1xuICAgICAgICB0aGlzLmNvbF9uYW1lX2FzX2ZpeGVkX3JvdyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRlY2ltYWxzID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlY2ltYWxzID8gb3B0aW9ucy5kZWNpbWFscyA6IDI7XG4gICAgICAgIHRoaXMuZGVsaW1pdGVyID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlbGltaXRlciA/IG9wdGlvbnMuZGVsaW1pdGVyIDogXCIuXCI7XG4gICAgICAgIHRoaXMuZGlzcGxheVRlbXBsYXRlID0gb3B0aW9ucyAmJiBvcHRpb25zLmRpc3BsYXlUZW1wbGF0ZSA/IG9wdGlvbnMuZGlzcGxheVRlbXBsYXRlIDogXCJfdmFsdWVfXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdEJHQ29sb3IgPSBvcHRpb25zICYmIG9wdGlvbnMuZGVmYXVsdEJHQ29sb3IgPyBvcHRpb25zLmRlZmF1bHRCR0NvbG9yIDogXCJcIjtcbiAgICAgICAgdGhpcy5kZWZhdWx0VGV4dENvbG9yID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlZmF1bHRUZXh0Q29sb3IgPyBvcHRpb25zLmRlZmF1bHRUZXh0Q29sb3IgOiBcIlwiO1xuICAgICAgICB0aGlzLmVuYWJsZV9iZ0NvbG9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5hYmxlX2JnQ29sb3Jfb3ZlcnJpZGVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5hYmxlX3RleHRDb2xvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV90ZXh0Q29sb3Jfb3ZlcnJpZGVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5hYmxlX2NsaWNrYWJsZV9jZWxscyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV9tdWx0aXZhbHVlX2NlbGxzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5hYmxlX3RpbWVfYmFzZWRfdGhyZXNob2xkcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV9maWx0ZXJlZF90aHJlc2hvbGRzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5hYmxlX3RyYW5zZm9ybSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV90cmFuc2Zvcm1fb3ZlcnJpZGVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaWQgPSAtMjtcbiAgICAgICAgdGhpcy5maWx0ZXIgPSB7XG4gICAgICAgICAgICB2YWx1ZV9hYm92ZTogXCJcIixcbiAgICAgICAgICAgIHZhbHVlX2JlbG93OiBcIlwiLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZpeGVkX3Jvd3MgPSBbXTtcbiAgICAgICAgdGhpcy5maXhlZF9jb2xzID0gW107XG4gICAgICAgIHRoaXMuY3VzdG9tX3BhcnNpbmdfdmFsdWVzID0gW107XG4gICAgICAgIHRoaXMuZm9ybWF0ID0gb3B0aW9ucyAmJiBvcHRpb25zLmZvcm1hdCA/IG9wdGlvbnMuZm9ybWF0IDogXCJub25lXCI7XG4gICAgICAgIHRoaXMubmFtZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5uYW1lID8gb3B0aW9ucy5uYW1lIDogXCJOZXcgUGF0dGVyblwiO1xuICAgICAgICB0aGlzLm51bGxfY29sb3IgPSBvcHRpb25zICYmIG9wdGlvbnMubnVsbF9jb2xvciA/IG9wdGlvbnMubnVsbF9jb2xvciA6IFwiZGFya3JlZFwiO1xuICAgICAgICB0aGlzLm51bGxfdGV4dGNvbG9yID0gb3B0aW9ucyAmJiBvcHRpb25zLm51bGxfVGV4dGNvbG9yID8gb3B0aW9ucy5udWxsX1RleHRjb2xvciA6IFwiYmxhY2tcIjtcbiAgICAgICAgdGhpcy5udWxsX3ZhbHVlID0gb3B0aW9ucyAmJiBvcHRpb25zLm51bGxfdmFsdWUgPyBvcHRpb25zLm51bGxfdmFsdWUgOiBcIk5vIGRhdGFcIjtcbiAgICAgICAgdGhpcy5tdWx0aV92YWx1ZV9zaG93X3ByaW9yaXR5ID0gXCJNYXhpbXVtXCI7XG4gICAgICAgIHRoaXMucGF0dGVybiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wYXR0ZXJuID8gb3B0aW9ucy5wYXR0ZXJuIDogXCJec2VydmVyLipjcHUkXCI7XG4gICAgICAgIHRoaXMucm93X25hbWUgPSBvcHRpb25zICYmIG9wdGlvbnMucm93X25hbWUgPyBvcHRpb25zLnJvd19uYW1lIDogdGhpcy5yb3dfY29sX3dyYXBwZXIgKyBcIjBcIiArIHRoaXMucm93X2NvbF93cmFwcGVyO1xuICAgICAgICB0aGlzLnRocmVzaG9sZHMgPSBvcHRpb25zICYmIG9wdGlvbnMudGhyZXNob2xkcyA/IG9wdGlvbnMudGhyZXNob2xkcyA6IFwiNzAsOTBcIjtcbiAgICAgICAgdGhpcy5maWx0ZXJlZF90aHJlc2hvbGRzID0gW107XG4gICAgICAgIHRoaXMudGltZV9iYXNlZF90aHJlc2hvbGRzID0gW107XG4gICAgICAgIHRoaXMudHJhbnNmb3JtX3ZhbHVlcyA9IG9wdGlvbnMgJiYgb3B0aW9ucy50cmFuc2Zvcm1fdmFsdWVzID8gb3B0aW9ucy50cmFuc2Zvcm1fdmFsdWVzIDogXCJfdmFsdWVffF92YWx1ZV98X3ZhbHVlX1wiO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzID0gb3B0aW9ucyAmJiBvcHRpb25zLnRyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzID8gb3B0aW9ucy50cmFuc2Zvcm1fdmFsdWVzX292ZXJyaWRlcyA6IFwiMC0+ZG93bnwxLT51cFwiO1xuICAgICAgICB0aGlzLnRvb2x0aXBUZW1wbGF0ZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy50b29sdGlwVGVtcGxhdGUgPyBvcHRpb25zLnRvb2x0aXBUZW1wbGF0ZSA6IFwiU2VyaWVzIDogX3Nlcmllc18gPGJyLz5Sb3cgTmFtZSA6IF9yb3dfbmFtZV8gPGJyLz5Db2wgTmFtZSA6IF9jb2xfbmFtZV8gPGJyLz5WYWx1ZSA6IF92YWx1ZV9cIjtcbiAgICAgICAgdGhpcy52YWx1ZU5hbWUgPSBvcHRpb25zICYmIG9wdGlvbnMudmFsdWVOYW1lID8gb3B0aW9ucy52YWx1ZU5hbWUgOiBcImF2Z1wiO1xuICAgICAgICB0aGlzLmdyaWRfcGF0dGVybiA9IHRoaXMucGF0dGVybjtcbiAgICAgICAgdGhpcy5ncmlkX2RlbGltaXRlciA9IHRoaXMuZGVsaW1pdGVyO1xuICAgICAgICB0aGlzLmdyaWRfaW5kZXggPSAwO1xuICAgICAgICB0aGlzLmdyaWRfZGF0YV9qb2luID0gXCJcIjtcbiAgICAgICAgdGhpcy5ncmlkX3Jvd19jbnQgPSAwO1xuICAgIH1cbn1cblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLmludmVyc2VCR0NvbG9ycyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICB0aGlzLmJnQ29sb3JzID0gdGhpcy5iZ0NvbG9ycyA/IHRoaXMuYmdDb2xvcnMuc3BsaXQoXCJ8XCIpLnJldmVyc2UoKS5qb2luKFwifFwiKSA6IFwiXCI7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuaW52ZXJzZVRleHRDb2xvcnMgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgdGhpcy50ZXh0Q29sb3JzID0gdGhpcy50ZXh0Q29sb3JzID8gdGhpcy50ZXh0Q29sb3JzLnNwbGl0KFwifFwiKS5yZXZlcnNlKCkuam9pbihcInxcIikgOiBcIlwiO1xufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLmludmVyc2VUcmFuc2Zvcm1WYWx1ZXMgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgdGhpcy50cmFuc2Zvcm1fdmFsdWVzID0gdGhpcy50cmFuc2Zvcm1fdmFsdWVzID8gdGhpcy50cmFuc2Zvcm1fdmFsdWVzLnNwbGl0KFwifFwiKS5yZXZlcnNlKCkuam9pbihcInxcIikgOiBcIlwiO1xufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLmFkZF90aW1lX2Jhc2VkX3RocmVzaG9sZHMgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgbGV0IG5ld190aW1lX2Jhc2VkX3RocmVzaG9sZDogSUJvb21UaW1lQmFzZWRUaHJlc2hvbGQgPSBuZXcgQm9vbVRpbWVCYXNlZFRocmVzaG9sZCgpO1xuICAgIHRoaXMudGltZV9iYXNlZF90aHJlc2hvbGRzID0gdGhpcy50aW1lX2Jhc2VkX3RocmVzaG9sZHMgfHwgW107XG4gICAgdGhpcy50aW1lX2Jhc2VkX3RocmVzaG9sZHMucHVzaChuZXdfdGltZV9iYXNlZF90aHJlc2hvbGQpO1xufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLnJlbW92ZV90aW1lX2Jhc2VkX3RocmVzaG9sZHMgPSBmdW5jdGlvbiAoaW5kZXg6IE51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnRpbWVfYmFzZWRfdGhyZXNob2xkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMudGltZV9iYXNlZF90aHJlc2hvbGRzLnNwbGljZShOdW1iZXIoaW5kZXgpLCAxKTtcbiAgICB9XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuYWRkX2ZpbHRlcl90aHJlc2hvbGRzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgIGxldCBuZXdfZmlsdGVyX3RocmVzaG9sZDogSUJvb21GaWx0ZXJlZFRocmVzaG9sZCA9IG5ldyBCb29tRmlsdGVyZWRUaHJlc2hvbGQoKTtcbiAgICB0aGlzLmZpbHRlcmVkX3RocmVzaG9sZHMgPSB0aGlzLmZpbHRlcmVkX3RocmVzaG9sZHMgfHwgW107XG4gICAgdGhpcy5maWx0ZXJlZF90aHJlc2hvbGRzLnB1c2gobmV3X2ZpbHRlcl90aHJlc2hvbGQpO1xufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLnJlbW92ZV9maWx0ZXJfdGhyZXNob2xkcyA9IGZ1bmN0aW9uIChpbmRleDogTnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZmlsdGVyZWRfdGhyZXNob2xkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyZWRfdGhyZXNob2xkcy5zcGxpY2UoTnVtYmVyKGluZGV4KSwgMSk7XG4gICAgfVxufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLmFkZF9maXhlZF9yb3cgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgdGhpcy5maXhlZF9yb3dzID0gdGhpcy5maXhlZF9yb3dzIHx8IFtdO1xuICAgIHRoaXMuZml4ZWRfcm93cy5wdXNoKG5ldyBCb29tRml4ZWRSb3codGhpcy5maXhlZF9yb3dzLmxlbmd0aC50b1N0cmluZygpKSk7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUucmVtb3ZlX2ZpeGVkX3JvdyA9IGZ1bmN0aW9uIChpbmRleDogTnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZml4ZWRfcm93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZml4ZWRfcm93cy5zcGxpY2UoTnVtYmVyKGluZGV4KSwgMSk7XG4gICAgfVxufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLmFkZF9maXhlZF9jb2wgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgdGhpcy5maXhlZF9jb2xzID0gdGhpcy5maXhlZF9jb2xzIHx8IFtdO1xuICAgIHRoaXMuZml4ZWRfY29scy5wdXNoKG5ldyBCb29tRml4ZWRDb2wodGhpcy5maXhlZF9jb2xzLmxlbmd0aC50b1N0cmluZygpKSk7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUucmVtb3ZlX2ZpeGVkX2NvbCA9IGZ1bmN0aW9uIChpbmRleDogTnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZml4ZWRfY29scy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZml4ZWRfY29scy5zcGxpY2UoTnVtYmVyKGluZGV4KSwgMSk7XG4gICAgfVxufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLmFkZF9jdXN0b21fcGFyc2luZ192YWx1ZSA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICB0aGlzLmN1c3RvbV9wYXJzaW5nX3ZhbHVlcyA9IHRoaXMuY3VzdG9tX3BhcnNpbmdfdmFsdWVzIHx8IFtdO1xuICAgIHRoaXMuY3VzdG9tX3BhcnNpbmdfdmFsdWVzLnB1c2gobmV3IEJvb21DdXN0b21QYXJzaW5nVmFsdWUoKSk7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUucmVtb3ZlX2N1c3RvbV9wYXJzaW5nX3ZhbHVlID0gZnVuY3Rpb24gKGluZGV4OiBOdW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jdXN0b21fcGFyc2luZ192YWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmN1c3RvbV9wYXJzaW5nX3ZhbHVlcy5zcGxpY2UoTnVtYmVyKGluZGV4KSwgMSk7XG4gICAgfVxufTtcblxuQm9vbVBhdHRlcm4ucHJvdG90eXBlLnNldFVuaXRGb3JtYXQgPSBmdW5jdGlvbiAoZm9ybWF0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm1hdCA9IGZvcm1hdCAmJiBmb3JtYXQudmFsdWUgPyBmb3JtYXQudmFsdWUgOiBcIm5vbmVcIjtcbn07XG5cbmV4cG9ydCB7XG4gICAgQm9vbUZpeGVkQ29sLFxuICAgIEJvb21GaXhlZFJvdyxcbiAgICBCb29tUGF0dGVyblxufTtcbiJdfQ==