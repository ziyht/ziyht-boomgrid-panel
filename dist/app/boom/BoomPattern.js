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
                    this.name = name;
                }
                return BoomFixedRow;
            }());
            exports_1("BoomFixedRow", BoomFixedRow);
            BoomFixedCol = (function () {
                function BoomFixedCol(name) {
                    this.order = "";
                    this.show = "";
                    this.from = "";
                    this.bg_color = "";
                    this.text_color = "";
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
                    this.data_joins = {
                        join: "",
                        joinby: "",
                        main: "",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVBhdHRlcm4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2Jvb20vQm9vbVBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFHQTtnQkFFSSxzQkFBWSxJQUFZO29CQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQztnQkFDTCxtQkFBQztZQUFELENBQUMsQUFMRCxJQUtDOztZQUVEO2dCQU9JLHNCQUFZLElBQVk7b0JBTGpCLFVBQUssR0FBUSxFQUFFLENBQUM7b0JBQ2hCLFNBQUksR0FBUyxFQUFFLENBQUM7b0JBQ2hCLFNBQUksR0FBUyxFQUFFLENBQUM7b0JBQ2hCLGFBQVEsR0FBSyxFQUFFLENBQUM7b0JBQ2hCLGVBQVUsR0FBRyxFQUFFLENBQUM7b0JBRW5CLElBQUksQ0FBQyxJQUFJLEdBQUksSUFBSSxDQUFDO2dCQUN0QixDQUFDO2dCQUNMLG1CQUFDO1lBQUQsQ0FBQyxBQVZELElBVUM7O1lBRUQ7Z0JBQUE7b0JBQ1csVUFBSyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxRQUFHLEdBQUssRUFBRSxDQUFDO2dCQUN0QixDQUFDO2dCQUFELDZCQUFDO1lBQUQsQ0FBQyxBQUhELElBR0M7WUFFRDtnQkFrRUkscUJBQVksT0FBWTtvQkFqRWhCLG9CQUFlLEdBQUcsR0FBRyxDQUFDO29CQWtFMUIsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLGVBQWUsRUFBRTt3QkFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO3FCQUNsRDtvQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDcEYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsMkJBQTJCLENBQUM7b0JBQzNILElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO29CQUMxRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQztvQkFDakksSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUN4RyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO29CQUNuSCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25FLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFDeEUsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUNoRyxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ3RGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDNUYsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7b0JBQzVCLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7b0JBQzlCLElBQUksQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUM7b0JBQ3BDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUM7b0JBQ3JDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUM7b0JBQzFDLElBQUksQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7b0JBQzlCLElBQUksQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRzt3QkFDVixXQUFXLEVBQUUsRUFBRTt3QkFDZixXQUFXLEVBQUUsRUFBRTtxQkFDbEIsQ0FBQztvQkFDRixJQUFJLENBQUMsVUFBVSxHQUFHO3dCQUNkLElBQUksRUFBRSxFQUFFO3dCQUNSLE1BQU0sRUFBRSxFQUFFO3dCQUNWLElBQUksRUFBRSxFQUFFO3FCQUNYLENBQUM7b0JBQ0YsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUNyQixJQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO29CQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQ2xFLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztvQkFDbkUsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUNqRixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNGLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFDakYsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFNBQVMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO29CQUM5RSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO29CQUNuSCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQy9FLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7b0JBQzlCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxFQUFFLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDO29CQUNuSCxJQUFJLENBQUMsMEJBQTBCLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUM7b0JBQ3ZJLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLDhGQUE4RixDQUFDO29CQUNyTCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQzFFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO29CQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixDQUFDO2dCQUNMLGtCQUFDO1lBQUQsQ0FBQyxBQTdIRCxJQTZIQzs7WUFFRCxXQUFXLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRztnQkFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN0RixDQUFDLENBQUM7WUFFRixXQUFXLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHO2dCQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVGLENBQUMsQ0FBQztZQUVGLFdBQVcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEdBQUc7Z0JBQzNDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUcsQ0FBQyxDQUFDO1lBRUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsR0FBRztnQkFDOUMsSUFBSSx3QkFBd0IsR0FBNEIsSUFBSSw4QkFBc0IsRUFBRSxDQUFDO2dCQUNyRixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixJQUFJLEVBQUUsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQztZQUVGLFdBQVcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEdBQUcsVUFBVSxLQUFhO2dCQUN4RSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN2QyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDdkQ7WUFDTCxDQUFDLENBQUM7WUFFRixXQUFXLENBQUMsU0FBUyxDQUFDLHFCQUFxQixHQUFHO2dCQUMxQyxJQUFJLG9CQUFvQixHQUEyQixJQUFJLDZCQUFxQixFQUFFLENBQUM7Z0JBQy9FLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLElBQUksRUFBRSxDQUFDO2dCQUMxRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDO1lBRUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsR0FBRyxVQUFVLEtBQWE7Z0JBQ3BFLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNyRDtZQUNMLENBQUMsQ0FBQztZQUVGLFdBQVcsQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHO2dCQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUUsQ0FBQyxDQUFDO1lBRUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLEtBQWE7Z0JBQzVELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO1lBQ0wsQ0FBQyxDQUFDO1lBRUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUc7Z0JBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5RSxDQUFDLENBQUM7WUFFRixXQUFXLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFVBQVUsS0FBYTtnQkFDNUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDNUM7WUFDTCxDQUFDLENBQUM7WUFFRixXQUFXLENBQUMsU0FBUyxDQUFDLHdCQUF3QixHQUFHO2dCQUM3QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixJQUFJLEVBQUUsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixFQUFFLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUM7WUFFRixXQUFXLENBQUMsU0FBUyxDQUFDLDJCQUEyQixHQUFHLFVBQVUsS0FBYTtnQkFDdkUsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDdkMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZEO1lBQ0wsQ0FBQyxDQUFDO1lBRUYsV0FBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBVSxNQUFXO2dCQUN2RCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDakUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJvb21QYXR0ZXJuLCBJQm9vbVRpbWVCYXNlZFRocmVzaG9sZCwgQm9vbVRpbWVCYXNlZFRocmVzaG9sZCwgSUJvb21GaWx0ZXJlZFRocmVzaG9sZCwgQm9vbUZpbHRlcmVkVGhyZXNob2xkIH0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7IElCb29tRml4ZWRSb3csIElCb29tRml4ZWRDb2wsIElCb29tQ3VzdG9tUGFyc2luZ1ZhbHVlLCBJQm9vbUpvaW4gfSBmcm9tIFwiLi9Cb29tLmludGVyZmFjZVwiO1xuXG5jbGFzcyBCb29tRml4ZWRSb3cgaW1wbGVtZW50cyBJQm9vbUZpeGVkUm93IHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbn1cblxuY2xhc3MgQm9vbUZpeGVkQ29sIGltcGxlbWVudHMgSUJvb21GaXhlZENvbCB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgb3JkZXIgICAgICA9IFwiXCI7XG4gICAgcHVibGljIHNob3cgICAgICAgPSBcIlwiO1xuICAgIHB1YmxpYyBmcm9tICAgICAgID0gXCJcIjtcbiAgICBwdWJsaWMgYmdfY29sb3IgICA9IFwiXCI7XG4gICAgcHVibGljIHRleHRfY29sb3IgPSBcIlwiO1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgID0gbmFtZTtcbiAgICB9XG59XG5cbmNsYXNzIEJvb21DdXN0b21QYXJzaW5nVmFsdWUgaW1wbGVtZW50cyBJQm9vbUN1c3RvbVBhcnNpbmdWYWx1ZXtcbiAgICBwdWJsaWMgbGFiZWwgPSBcIlwiO1xuICAgIHB1YmxpYyBnZXQgICA9IFwiXCI7XG59XG5cbmNsYXNzIEJvb21QYXR0ZXJuIGltcGxlbWVudHMgSUJvb21QYXR0ZXJuIHtcbiAgICBwcml2YXRlIHJvd19jb2xfd3JhcHBlciA9IFwiX1wiO1xuICAgIHB1YmxpYyBiZ0NvbG9yczogc3RyaW5nO1xuICAgIHB1YmxpYyBiZ0NvbG9yc19vdmVycmlkZXM6IHN0cmluZztcbiAgICBwdWJsaWMgY2xpY2thYmxlX2NlbGxzX2xpbms6IHN0cmluZztcbiAgICBwdWJsaWMgY29sX25hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgZGlzcGxheVRlbXBsYXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGRlZmF1bHRCR0NvbG9yOiBzdHJpbmc7XG4gICAgcHVibGljIGRlZmF1bHRUZXh0Q29sb3I6IHN0cmluZztcbiAgICBwdWJsaWMgZGVjaW1hbHM6IE51bWJlcjtcbiAgICBwdWJsaWMgZGVsaW1pdGVyOiBzdHJpbmc7XG4gICAgcHVibGljIGVuYWJsZV9iZ0NvbG9yOiBCb29sZWFuO1xuICAgIHB1YmxpYyBlbmFibGVfYmdDb2xvcl9vdmVycmlkZXM6IEJvb2xlYW47XG4gICAgcHVibGljIGVuYWJsZV9tdWx0aXZhbHVlX2NlbGxzOiBCb29sZWFuO1xuICAgIHB1YmxpYyBlbmFibGVfY2xpY2thYmxlX2NlbGxzOiBCb29sZWFuO1xuICAgIHB1YmxpYyBlbmFibGVfdGV4dENvbG9yOiBCb29sZWFuO1xuICAgIHB1YmxpYyBlbmFibGVfdGV4dENvbG9yX292ZXJyaWRlczogQm9vbGVhbjtcbiAgICBwdWJsaWMgZW5hYmxlX3RpbWVfYmFzZWRfdGhyZXNob2xkczogQm9vbGVhbjtcbiAgICBwdWJsaWMgZW5hYmxlX2ZpbHRlcmVkX3RocmVzaG9sZHM6IEJvb2xlYW47XG4gICAgcHVibGljIGVuYWJsZV90cmFuc2Zvcm06IEJvb2xlYW47XG4gICAgcHVibGljIGVuYWJsZV90cmFuc2Zvcm1fb3ZlcnJpZGVzOiBCb29sZWFuO1xuICAgIHB1YmxpYyBmaWx0ZXI6IHtcbiAgICAgICAgdmFsdWVfYWJvdmU6IHN0cmluZztcbiAgICAgICAgdmFsdWVfYmVsb3c6IHN0cmluZztcbiAgICB9O1xuICAgIHB1YmxpYyBmaXhlZF9yb3dzOiBJQm9vbUZpeGVkUm93W107XG4gICAgcHVibGljIGZpeGVkX2NvbHM6IElCb29tRml4ZWRDb2xbXTtcbiAgICBwdWJsaWMgY3VzdG9tX3BhcnNpbmdfdmFsdWVzOiBJQm9vbUN1c3RvbVBhcnNpbmdWYWx1ZVtdO1xuICAgIHB1YmxpYyBmb3JtYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcbiAgICBwdWJsaWMgZGF0YV9qb2luczogSUJvb21Kb2luO1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIG51bGxfY29sb3I6IHN0cmluZztcbiAgICBwdWJsaWMgbnVsbF92YWx1ZTogc3RyaW5nO1xuICAgIHB1YmxpYyBudWxsX3RleHRjb2xvcjogc3RyaW5nO1xuICAgIHB1YmxpYyBtdWx0aV92YWx1ZV9zaG93X3ByaW9yaXR5OiBzdHJpbmc7XG4gICAgcHVibGljIHBhdHRlcm46IHN0cmluZztcbiAgICBwdWJsaWMgcm93X25hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdGV4dENvbG9yczogc3RyaW5nO1xuICAgIHB1YmxpYyB0ZXh0Q29sb3JzX292ZXJyaWRlczogc3RyaW5nO1xuICAgIHB1YmxpYyB0aHJlc2hvbGRzOiBzdHJpbmc7XG4gICAgcHVibGljIGZpbHRlcmVkX3RocmVzaG9sZHM6IElCb29tRmlsdGVyZWRUaHJlc2hvbGRbXTtcbiAgICBwdWJsaWMgdGltZV9iYXNlZF90aHJlc2hvbGRzOiBJQm9vbVRpbWVCYXNlZFRocmVzaG9sZFtdO1xuICAgIHB1YmxpYyB0cmFuc2Zvcm1fdmFsdWVzOiBzdHJpbmc7XG4gICAgcHVibGljIHRyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzOiBzdHJpbmc7XG4gICAgcHVibGljIHRvb2x0aXBUZW1wbGF0ZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZU5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgaW52ZXJzZUJHQ29sb3JzO1xuICAgIHB1YmxpYyBpbnZlcnNlVGV4dENvbG9ycztcbiAgICBwdWJsaWMgaW52ZXJzZVRyYW5zZm9ybVZhbHVlcztcbiAgICBwdWJsaWMgYWRkX3RpbWVfYmFzZWRfdGhyZXNob2xkcztcbiAgICBwdWJsaWMgcmVtb3ZlX3RpbWVfYmFzZWRfdGhyZXNob2xkcztcbiAgICBwdWJsaWMgYWRkX2ZpbHRlcl90aHJlc2hvbGRzO1xuICAgIHB1YmxpYyByZW1vdmVfZmlsdGVyX3RocmVzaG9sZHM7XG4gICAgcHVibGljIGFkZF9maXhlZF9yb3c7XG4gICAgcHVibGljIHJlbW92ZV9maXhlZF9yb3c7XG4gICAgcHVibGljIGFkZF9maXhlZF9jb2w7XG4gICAgcHVibGljIHJlbW92ZV9maXhlZF9jb2w7XG4gICAgcHVibGljIGFkZF9jdXN0b21fcGFyc2luZ192YWx1ZTtcbiAgICBwdWJsaWMgcmVtb3ZlX2N1c3RvbV9wYXJzaW5nX3ZhbHVlO1xuICAgIHB1YmxpYyBzZXRVbml0Rm9ybWF0O1xuICAgIHB1YmxpYyBncmlkX3BhdHRlcm46IHN0cmluZztcbiAgICBwdWJsaWMgZ3JpZF9kZWxpbWl0ZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZ3JpZF9pbmRleDogbnVtYmVyO1xuICAgIHB1YmxpYyBncmlkX2RhdGFfam9pbjogc3RyaW5nO1xuICAgIHB1YmxpYyBncmlkX3Jvd19jbnQ6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBhbnkpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yb3dfY29sX3dyYXBwZXIpIHtcbiAgICAgICAgICAgIHRoaXMucm93X2NvbF93cmFwcGVyID0gb3B0aW9ucy5yb3dfY29sX3dyYXBwZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5iZ0NvbG9ycyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5iZ0NvbG9ycyA/IG9wdGlvbnMuYmdDb2xvcnMgOiBcImdyZWVufG9yYW5nZXxyZWRcIjtcbiAgICAgICAgdGhpcy5iZ0NvbG9yc19vdmVycmlkZXMgPSBvcHRpb25zICYmIG9wdGlvbnMuYmdDb2xvcnNfb3ZlcnJpZGVzID8gb3B0aW9ucy5iZ0NvbG9yc19vdmVycmlkZXMgOiBcIjAtPmdyZWVufDItPnJlZHwxLT55ZWxsb3dcIjtcbiAgICAgICAgdGhpcy50ZXh0Q29sb3JzID0gb3B0aW9ucyAmJiBvcHRpb25zLnRleHRDb2xvcnMgPyBvcHRpb25zLnRleHRDb2xvcnMgOiBcInJlZHxvcmFuZ2V8Z3JlZW5cIjtcbiAgICAgICAgdGhpcy50ZXh0Q29sb3JzX292ZXJyaWRlcyA9IG9wdGlvbnMgJiYgb3B0aW9ucy50ZXh0Q29sb3JzX292ZXJyaWRlcyA/IG9wdGlvbnMudGV4dENvbG9yc19vdmVycmlkZXMgOiBcIjAtPnJlZHwyLT5ncmVlbnwxLT55ZWxsb3dcIjtcbiAgICAgICAgdGhpcy5jbGlja2FibGVfY2VsbHNfbGluayA9IG9wdGlvbnMgJiYgb3B0aW9ucy5jbGlja2FibGVfY2VsbHNfbGluayA/IG9wdGlvbnMuY2xpY2thYmxlX2NlbGxzX2xpbmsgOiBcIlwiO1xuICAgICAgICB0aGlzLmNvbF9uYW1lID0gb3B0aW9ucyAmJiBvcHRpb25zLmNvbF9uYW1lID8gb3B0aW9ucy5jb2xfbmFtZSA6IHRoaXMucm93X2NvbF93cmFwcGVyICsgXCIxXCIgKyB0aGlzLnJvd19jb2xfd3JhcHBlcjtcbiAgICAgICAgdGhpcy5kZWNpbWFscyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5kZWNpbWFscyA/IG9wdGlvbnMuZGVjaW1hbHMgOiAyO1xuICAgICAgICB0aGlzLmRlbGltaXRlciA9IG9wdGlvbnMgJiYgb3B0aW9ucy5kZWxpbWl0ZXIgPyBvcHRpb25zLmRlbGltaXRlciA6IFwiLlwiO1xuICAgICAgICB0aGlzLmRpc3BsYXlUZW1wbGF0ZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5kaXNwbGF5VGVtcGxhdGUgPyBvcHRpb25zLmRpc3BsYXlUZW1wbGF0ZSA6IFwiX3ZhbHVlX1wiO1xuICAgICAgICB0aGlzLmRlZmF1bHRCR0NvbG9yID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlZmF1bHRCR0NvbG9yID8gb3B0aW9ucy5kZWZhdWx0QkdDb2xvciA6IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFRleHRDb2xvciA9IG9wdGlvbnMgJiYgb3B0aW9ucy5kZWZhdWx0VGV4dENvbG9yID8gb3B0aW9ucy5kZWZhdWx0VGV4dENvbG9yIDogXCJcIjtcbiAgICAgICAgdGhpcy5lbmFibGVfYmdDb2xvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV9iZ0NvbG9yX292ZXJyaWRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV90ZXh0Q29sb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbmFibGVfdGV4dENvbG9yX292ZXJyaWRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV9jbGlja2FibGVfY2VsbHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbmFibGVfbXVsdGl2YWx1ZV9jZWxscyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV90aW1lX2Jhc2VkX3RocmVzaG9sZHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbmFibGVfZmlsdGVyZWRfdGhyZXNob2xkcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVuYWJsZV90cmFuc2Zvcm0gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbmFibGVfdHJhbnNmb3JtX292ZXJyaWRlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlkID0gLTI7XG4gICAgICAgIHRoaXMuZmlsdGVyID0ge1xuICAgICAgICAgICAgdmFsdWVfYWJvdmU6IFwiXCIsXG4gICAgICAgICAgICB2YWx1ZV9iZWxvdzogXCJcIixcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kYXRhX2pvaW5zID0ge1xuICAgICAgICAgICAgam9pbjogXCJcIixcbiAgICAgICAgICAgIGpvaW5ieTogXCJcIixcbiAgICAgICAgICAgIG1haW46IFwiXCIsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZml4ZWRfcm93cyA9IFtdO1xuICAgICAgICB0aGlzLmZpeGVkX2NvbHMgPSBbXTtcbiAgICAgICAgdGhpcy5jdXN0b21fcGFyc2luZ192YWx1ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5mb3JtYXQgPSBvcHRpb25zICYmIG9wdGlvbnMuZm9ybWF0ID8gb3B0aW9ucy5mb3JtYXQgOiBcIm5vbmVcIjtcbiAgICAgICAgdGhpcy5uYW1lID0gb3B0aW9ucyAmJiBvcHRpb25zLm5hbWUgPyBvcHRpb25zLm5hbWUgOiBcIk5ldyBQYXR0ZXJuXCI7XG4gICAgICAgIHRoaXMubnVsbF9jb2xvciA9IG9wdGlvbnMgJiYgb3B0aW9ucy5udWxsX2NvbG9yID8gb3B0aW9ucy5udWxsX2NvbG9yIDogXCJkYXJrcmVkXCI7XG4gICAgICAgIHRoaXMubnVsbF90ZXh0Y29sb3IgPSBvcHRpb25zICYmIG9wdGlvbnMubnVsbF9UZXh0Y29sb3IgPyBvcHRpb25zLm51bGxfVGV4dGNvbG9yIDogXCJibGFja1wiO1xuICAgICAgICB0aGlzLm51bGxfdmFsdWUgPSBvcHRpb25zICYmIG9wdGlvbnMubnVsbF92YWx1ZSA/IG9wdGlvbnMubnVsbF92YWx1ZSA6IFwiTm8gZGF0YVwiO1xuICAgICAgICB0aGlzLm11bHRpX3ZhbHVlX3Nob3dfcHJpb3JpdHkgPSBcIk1heGltdW1cIjtcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gb3B0aW9ucyAmJiBvcHRpb25zLnBhdHRlcm4gPyBvcHRpb25zLnBhdHRlcm4gOiBcIl5zZXJ2ZXIuKmNwdSRcIjtcbiAgICAgICAgdGhpcy5yb3dfbmFtZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5yb3dfbmFtZSA/IG9wdGlvbnMucm93X25hbWUgOiB0aGlzLnJvd19jb2xfd3JhcHBlciArIFwiMFwiICsgdGhpcy5yb3dfY29sX3dyYXBwZXI7XG4gICAgICAgIHRoaXMudGhyZXNob2xkcyA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aHJlc2hvbGRzID8gb3B0aW9ucy50aHJlc2hvbGRzIDogXCI3MCw5MFwiO1xuICAgICAgICB0aGlzLmZpbHRlcmVkX3RocmVzaG9sZHMgPSBbXTtcbiAgICAgICAgdGhpcy50aW1lX2Jhc2VkX3RocmVzaG9sZHMgPSBbXTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1fdmFsdWVzID0gb3B0aW9ucyAmJiBvcHRpb25zLnRyYW5zZm9ybV92YWx1ZXMgPyBvcHRpb25zLnRyYW5zZm9ybV92YWx1ZXMgOiBcIl92YWx1ZV98X3ZhbHVlX3xfdmFsdWVfXCI7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtX3ZhbHVlc19vdmVycmlkZXMgPSBvcHRpb25zICYmIG9wdGlvbnMudHJhbnNmb3JtX3ZhbHVlc19vdmVycmlkZXMgPyBvcHRpb25zLnRyYW5zZm9ybV92YWx1ZXNfb3ZlcnJpZGVzIDogXCIwLT5kb3dufDEtPnVwXCI7XG4gICAgICAgIHRoaXMudG9vbHRpcFRlbXBsYXRlID0gb3B0aW9ucyAmJiBvcHRpb25zLnRvb2x0aXBUZW1wbGF0ZSA/IG9wdGlvbnMudG9vbHRpcFRlbXBsYXRlIDogXCJTZXJpZXMgOiBfc2VyaWVzXyA8YnIvPlJvdyBOYW1lIDogX3Jvd19uYW1lXyA8YnIvPkNvbCBOYW1lIDogX2NvbF9uYW1lXyA8YnIvPlZhbHVlIDogX3ZhbHVlX1wiO1xuICAgICAgICB0aGlzLnZhbHVlTmFtZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy52YWx1ZU5hbWUgPyBvcHRpb25zLnZhbHVlTmFtZSA6IFwiYXZnXCI7XG4gICAgICAgIHRoaXMuZ3JpZF9wYXR0ZXJuID0gdGhpcy5wYXR0ZXJuO1xuICAgICAgICB0aGlzLmdyaWRfZGVsaW1pdGVyID0gdGhpcy5kZWxpbWl0ZXI7XG4gICAgICAgIHRoaXMuZ3JpZF9pbmRleCA9IDA7XG4gICAgICAgIHRoaXMuZ3JpZF9kYXRhX2pvaW4gPSBcIlwiO1xuICAgICAgICB0aGlzLmdyaWRfcm93X2NudCA9IDA7XG4gICAgfVxufVxuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuaW52ZXJzZUJHQ29sb3JzID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgIHRoaXMuYmdDb2xvcnMgPSB0aGlzLmJnQ29sb3JzID8gdGhpcy5iZ0NvbG9ycy5zcGxpdChcInxcIikucmV2ZXJzZSgpLmpvaW4oXCJ8XCIpIDogXCJcIjtcbn07XG5cbkJvb21QYXR0ZXJuLnByb3RvdHlwZS5pbnZlcnNlVGV4dENvbG9ycyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICB0aGlzLnRleHRDb2xvcnMgPSB0aGlzLnRleHRDb2xvcnMgPyB0aGlzLnRleHRDb2xvcnMuc3BsaXQoXCJ8XCIpLnJldmVyc2UoKS5qb2luKFwifFwiKSA6IFwiXCI7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybVZhbHVlcyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICB0aGlzLnRyYW5zZm9ybV92YWx1ZXMgPSB0aGlzLnRyYW5zZm9ybV92YWx1ZXMgPyB0aGlzLnRyYW5zZm9ybV92YWx1ZXMuc3BsaXQoXCJ8XCIpLnJldmVyc2UoKS5qb2luKFwifFwiKSA6IFwiXCI7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuYWRkX3RpbWVfYmFzZWRfdGhyZXNob2xkcyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICBsZXQgbmV3X3RpbWVfYmFzZWRfdGhyZXNob2xkOiBJQm9vbVRpbWVCYXNlZFRocmVzaG9sZCA9IG5ldyBCb29tVGltZUJhc2VkVGhyZXNob2xkKCk7XG4gICAgdGhpcy50aW1lX2Jhc2VkX3RocmVzaG9sZHMgPSB0aGlzLnRpbWVfYmFzZWRfdGhyZXNob2xkcyB8fCBbXTtcbiAgICB0aGlzLnRpbWVfYmFzZWRfdGhyZXNob2xkcy5wdXNoKG5ld190aW1lX2Jhc2VkX3RocmVzaG9sZCk7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUucmVtb3ZlX3RpbWVfYmFzZWRfdGhyZXNob2xkcyA9IGZ1bmN0aW9uIChpbmRleDogTnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGltZV9iYXNlZF90aHJlc2hvbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy50aW1lX2Jhc2VkX3RocmVzaG9sZHMuc3BsaWNlKE51bWJlcihpbmRleCksIDEpO1xuICAgIH1cbn07XG5cbkJvb21QYXR0ZXJuLnByb3RvdHlwZS5hZGRfZmlsdGVyX3RocmVzaG9sZHMgPSBmdW5jdGlvbiAoKTogdm9pZCB7XG4gICAgbGV0IG5ld19maWx0ZXJfdGhyZXNob2xkOiBJQm9vbUZpbHRlcmVkVGhyZXNob2xkID0gbmV3IEJvb21GaWx0ZXJlZFRocmVzaG9sZCgpO1xuICAgIHRoaXMuZmlsdGVyZWRfdGhyZXNob2xkcyA9IHRoaXMuZmlsdGVyZWRfdGhyZXNob2xkcyB8fCBbXTtcbiAgICB0aGlzLmZpbHRlcmVkX3RocmVzaG9sZHMucHVzaChuZXdfZmlsdGVyX3RocmVzaG9sZCk7XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUucmVtb3ZlX2ZpbHRlcl90aHJlc2hvbGRzID0gZnVuY3Rpb24gKGluZGV4OiBOdW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5maWx0ZXJlZF90aHJlc2hvbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5maWx0ZXJlZF90aHJlc2hvbGRzLnNwbGljZShOdW1iZXIoaW5kZXgpLCAxKTtcbiAgICB9XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuYWRkX2ZpeGVkX3JvdyA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICB0aGlzLmZpeGVkX3Jvd3MgPSB0aGlzLmZpeGVkX3Jvd3MgfHwgW107XG4gICAgdGhpcy5maXhlZF9yb3dzLnB1c2gobmV3IEJvb21GaXhlZFJvdyh0aGlzLmZpeGVkX3Jvd3MubGVuZ3RoLnRvU3RyaW5nKCkpKTtcbn07XG5cbkJvb21QYXR0ZXJuLnByb3RvdHlwZS5yZW1vdmVfZml4ZWRfcm93ID0gZnVuY3Rpb24gKGluZGV4OiBOdW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5maXhlZF9yb3dzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5maXhlZF9yb3dzLnNwbGljZShOdW1iZXIoaW5kZXgpLCAxKTtcbiAgICB9XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuYWRkX2ZpeGVkX2NvbCA9IGZ1bmN0aW9uICgpOiB2b2lkIHtcbiAgICB0aGlzLmZpeGVkX2NvbHMgPSB0aGlzLmZpeGVkX2NvbHMgfHwgW107XG4gICAgdGhpcy5maXhlZF9jb2xzLnB1c2gobmV3IEJvb21GaXhlZENvbCh0aGlzLmZpeGVkX2NvbHMubGVuZ3RoLnRvU3RyaW5nKCkpKTtcbn07XG5cbkJvb21QYXR0ZXJuLnByb3RvdHlwZS5yZW1vdmVfZml4ZWRfY29sID0gZnVuY3Rpb24gKGluZGV4OiBOdW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5maXhlZF9jb2xzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5maXhlZF9jb2xzLnNwbGljZShOdW1iZXIoaW5kZXgpLCAxKTtcbiAgICB9XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuYWRkX2N1c3RvbV9wYXJzaW5nX3ZhbHVlID0gZnVuY3Rpb24gKCk6IHZvaWQge1xuICAgIHRoaXMuY3VzdG9tX3BhcnNpbmdfdmFsdWVzID0gdGhpcy5jdXN0b21fcGFyc2luZ192YWx1ZXMgfHwgW107XG4gICAgdGhpcy5jdXN0b21fcGFyc2luZ192YWx1ZXMucHVzaChuZXcgQm9vbUN1c3RvbVBhcnNpbmdWYWx1ZSgpKTtcbn07XG5cbkJvb21QYXR0ZXJuLnByb3RvdHlwZS5yZW1vdmVfY3VzdG9tX3BhcnNpbmdfdmFsdWUgPSBmdW5jdGlvbiAoaW5kZXg6IE51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmN1c3RvbV9wYXJzaW5nX3ZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuY3VzdG9tX3BhcnNpbmdfdmFsdWVzLnNwbGljZShOdW1iZXIoaW5kZXgpLCAxKTtcbiAgICB9XG59O1xuXG5Cb29tUGF0dGVybi5wcm90b3R5cGUuc2V0VW5pdEZvcm1hdCA9IGZ1bmN0aW9uIChmb3JtYXQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0ICYmIGZvcm1hdC52YWx1ZSA/IGZvcm1hdC52YWx1ZSA6IFwibm9uZVwiO1xufTtcblxuZXhwb3J0IHtcbiAgICBCb29tRml4ZWRDb2wsXG4gICAgQm9vbUZpeGVkUm93LFxuICAgIEJvb21QYXR0ZXJuXG59O1xuIl19