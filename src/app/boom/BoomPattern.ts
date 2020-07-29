import { IBoomPattern, IBoomTimeBasedThreshold, BoomTimeBasedThreshold, IBoomFilteredThreshold, BoomFilteredThreshold } from "./index";
import { IBoomFixedRow, IBoomFixedCol, IBoomCustomParsingValue, IBoomJoin } from "./Boom.interface";

class BoomFixedRow implements IBoomFixedRow {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class BoomFixedCol implements IBoomFixedCol {
    public name: string;
    public order      = "";
    public show       = "";
    public from       = "";
    public bg_color   = "";
    public text_color = "";
    constructor(name: string) {
        this.name  = name;
    }
}

class BoomCustomParsingValue implements IBoomCustomParsingValue{
    public label = "";
    public get   = "";
}

class BoomPattern implements IBoomPattern {
    private row_col_wrapper = "_";
    public bgColors: string;
    public bgColors_overrides: string;
    public clickable_cells_link: string;
    public col_name: string;
    public displayTemplate: string;
    public defaultBGColor: string;
    public defaultTextColor: string;
    public decimals: Number;
    public delimiter: string;
    public enable_bgColor: Boolean;
    public enable_bgColor_overrides: Boolean;
    public enable_multivalue_cells: Boolean;
    public enable_clickable_cells: Boolean;
    public enable_textColor: Boolean;
    public enable_textColor_overrides: Boolean;
    public enable_time_based_thresholds: Boolean;
    public enable_filtered_thresholds: Boolean;
    public enable_transform: Boolean;
    public enable_transform_overrides: Boolean;
    public filter: {
        value_above: string;
        value_below: string;
    };
    public fixed_rows: IBoomFixedRow[];
    public fixed_cols: IBoomFixedCol[];
    public custom_parsing_values: IBoomCustomParsingValue[];
    public format: string;
    public id: number;
    public data_joins: IBoomJoin;
    public name: string;
    public null_color: string;
    public null_value: string;
    public null_textcolor: string;
    public multi_value_show_priority: string;
    public pattern: string;
    public row_name: string;
    public textColors: string;
    public textColors_overrides: string;
    public thresholds: string;
    public filtered_thresholds: IBoomFilteredThreshold[];
    public time_based_thresholds: IBoomTimeBasedThreshold[];
    public transform_values: string;
    public transform_values_overrides: string;
    public tooltipTemplate: string;
    public valueName: string;
    public inverseBGColors;
    public inverseTextColors;
    public inverseTransformValues;
    public add_time_based_thresholds;
    public remove_time_based_thresholds;
    public add_filter_thresholds;
    public remove_filter_thresholds;
    public add_fixed_row;
    public remove_fixed_row;
    public add_fixed_col;
    public remove_fixed_col;
    public add_custom_parsing_value;
    public remove_custom_parsing_value;
    public setUnitFormat;
    public grid_pattern: string;
    public grid_delimiter: string;
    public grid_index: number;
    public grid_data_join: string;
    public grid_row_cnt: number;
    constructor(options: any) {
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
}

BoomPattern.prototype.inverseBGColors = function (): void {
    this.bgColors = this.bgColors ? this.bgColors.split("|").reverse().join("|") : "";
};

BoomPattern.prototype.inverseTextColors = function (): void {
    this.textColors = this.textColors ? this.textColors.split("|").reverse().join("|") : "";
};

BoomPattern.prototype.inverseTransformValues = function (): void {
    this.transform_values = this.transform_values ? this.transform_values.split("|").reverse().join("|") : "";
};

BoomPattern.prototype.add_time_based_thresholds = function (): void {
    let new_time_based_threshold: IBoomTimeBasedThreshold = new BoomTimeBasedThreshold();
    this.time_based_thresholds = this.time_based_thresholds || [];
    this.time_based_thresholds.push(new_time_based_threshold);
};

BoomPattern.prototype.remove_time_based_thresholds = function (index: Number): void {
    if (this.time_based_thresholds.length > 0) {
        this.time_based_thresholds.splice(Number(index), 1);
    }
};

BoomPattern.prototype.add_filter_thresholds = function (): void {
    let new_filter_threshold: IBoomFilteredThreshold = new BoomFilteredThreshold();
    this.filtered_thresholds = this.filtered_thresholds || [];
    this.filtered_thresholds.push(new_filter_threshold);
};

BoomPattern.prototype.remove_filter_thresholds = function (index: Number): void {
    if (this.filtered_thresholds.length > 0) {
        this.filtered_thresholds.splice(Number(index), 1);
    }
};

BoomPattern.prototype.add_fixed_row = function (): void {
    this.fixed_rows = this.fixed_rows || [];
    this.fixed_rows.push(new BoomFixedRow(this.fixed_rows.length.toString()));
};

BoomPattern.prototype.remove_fixed_row = function (index: Number): void {
    if (this.fixed_rows.length > 0) {
        this.fixed_rows.splice(Number(index), 1);
    }
};

BoomPattern.prototype.add_fixed_col = function (): void {
    this.fixed_cols = this.fixed_cols || [];
    this.fixed_cols.push(new BoomFixedCol(this.fixed_cols.length.toString()));
};

BoomPattern.prototype.remove_fixed_col = function (index: Number): void {
    if (this.fixed_cols.length > 0) {
        this.fixed_cols.splice(Number(index), 1);
    }
};

BoomPattern.prototype.add_custom_parsing_value = function (): void {
    this.custom_parsing_values = this.custom_parsing_values || [];
    this.custom_parsing_values.push(new BoomCustomParsingValue());
};

BoomPattern.prototype.remove_custom_parsing_value = function (index: Number): void {
    if (this.custom_parsing_values.length > 0) {
        this.custom_parsing_values.splice(Number(index), 1);
    }
};

BoomPattern.prototype.setUnitFormat = function (format: any): void {
    this.format = format && format.value ? format.value : "none";
};

export {
    BoomFixedCol,
    BoomFixedRow,
    BoomPattern
};
