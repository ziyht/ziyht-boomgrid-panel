import _ from "lodash";
import { BoomSeries, IBoomCellDetails, IBoomTable, IBoomTableTransformationOptions } from "./boom/index";
import { BoomPattern, replaceTokens } from './boom/index';
import { multiValueShowPriorities, columnSortTypes } from './config';
import { BoomPatternDatas } from './boom/BoomPatternData';

const defaultPattern = new BoomPattern({
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

const seriesToTable = function (inputdata: BoomSeries[], options: IBoomTableTransformationOptions, patternDatas: BoomPatternDatas): IBoomTable {
    let rows_found = _.uniq(_.uniq(_.map(inputdata, (d: { row_name: any; }) => d.row_name)).concat(patternDatas.getFixedRows()));
    let rows_without_token = _.uniq(_.map(inputdata, (d: { row_name_raw: any; }) => d.row_name_raw));
    let cols_found: string[] = _.uniq(_.uniq(_.map(inputdata, (d: { col_name: any; }) => d.col_name)).concat(patternDatas.getFixedCols()));
    let row_col_cells: IBoomCellDetails[][] = [];
    cols_found = cols_found.sort();
    if (options.cols_sort_type === columnSortTypes[1]){
        cols_found = cols_found.reverse();
    }
    _.each(rows_found, (row_name: any) => {
        let cols: IBoomCellDetails[] = [];
        _.each(cols_found, (col_name: any) => {
            let matched_items: BoomSeries[] = _.filter(inputdata, (o: { row_name: any; col_name: any; hidden: any }) => {
                return o.row_name === row_name && o.col_name === col_name && o.hidden === false;
            });
            if (!matched_items || matched_items.length === 0) {
                let cell = {
                    "col_name": col_name,
                    "color_bg": options.non_matching_cells_color_bg,
                    "color_text": options.non_matching_cells_color_text,
                    "display_value": replaceTokens(options.non_matching_cells_text),
                    "hidden": false,
                    "items": [],
                    "link": "-",
                    "row_name": row_name,
                    "tooltip": "-",
                    "value": NaN,
                };
                cols.push(cell);
            } else if (matched_items && matched_items.length === 1) {
                cols.push(matched_items[0].toBoomCellDetails());
            } else if (matched_items && matched_items.length > 1) {
                let item = matched_items[0];
                let cell: IBoomCellDetails = {
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
                let pattern = patternDatas.getPattern(item.pattern_id.valueOf());
                let classify = {};
                let min_id = item.color_bg_id;
                let max_id = item.color_bg_id;
                let choosen: BoomSeries = item;
                if (pattern.enable_multivalue_cells) {
                    // tslint:disable-next-line: no-shadowed-variable
                    _.each(matched_items, (item: BoomSeries) => {
                        cell.items.push(item.toBoomCellDetails());
                        cell.tooltip += item.tooltip + '<br>';
                        if (min_id > item.color_bg_id) {
                            min_id = item.color_bg_id;
                        }
                        if (max_id < item.color_bg_id){
                            max_id = item.color_bg_id;
                        }
                        if ( classify[item.color_bg_id.toString()] === undefined ){
                            classify[item.color_bg_id.toString()] = [];
                        }
                        classify[item.color_bg_id.toString()].push(item);
                    });
                    if (pattern.multi_value_show_priority === multiValueShowPriorities[0]){
                        let items: BoomSeries[] = classify[min_id.toString()];
                        let value = items[0].value;
                        choosen   = items[0];
                        // tslint:disable-next-line: no-shadowed-variable
                        _.each(classify[max_id.toString()], (item: BoomSeries) => {
                            if (value > item.value){
                                choosen = item;
                                value = item.value;
                            }
                        });
                    } else {
                        let items: BoomSeries[] = classify[max_id.toString()];
                        let value = items[0].value;
                        choosen   = items[0];
                        // tslint:disable-next-line: no-shadowed-variable
                        _.each(classify[max_id.toString()], (item: BoomSeries) => {
                            if (value < item.value){
                                choosen = item;
                                value = item.value;
                            }
                        });
                    }
                    cell.color_bg      = choosen.color_bg;
                    cell.color_text    = choosen.color_text;
                    cell.display_value = choosen.display_value;
                    cell.link          = choosen.link;
                    cell.value         = choosen.value;
                    cell.hidden        = choosen.hidden;
                } else {
                    let values: number[] = [];
                    // tslint:disable-next-line: no-shadowed-variable
                    _.each(matched_items, (item: BoomSeries) => {
                        cell.items.push(item.toBoomCellDetails());
                        cell.tooltip += item.tooltip + '<br>';
                        values.push(item.value);
                    });
                    cell.display_value += ": " + values.join('|');
                }
                cols.push(cell);
            }
        });
        row_col_cells.push(cols);
    });
    return {
        cols_found,
        row_col_cells,
        rows_found,
        rows_without_token,
    };
};

const removeHiddenColFromTable = function(boomtabledata: IBoomTable, need_hiddens: string[]){
    let cols_found = boomtabledata.cols_found;
    for (let col of need_hiddens) {
        let idx = cols_found.indexOf(col);
        if (idx !== -1 ){
            cols_found.splice(idx, 1);
        }
    }
    boomtabledata.cols_found = cols_found;
};

const updateSortColIdxForTable = function(boomtabledata: IBoomTable, sorting_props: any){
    // console.log(boomtabledata.cols_found + "|" + sorting_props.sort_column);
    if (sorting_props.sort_column !== undefined && sorting_props.sort_column !== ""){
        let idx = boomtabledata.cols_found.indexOf(sorting_props.sort_column);
        if (idx !== -1){
            sorting_props.col_index = idx;
            console.log("set sort col idx to " + idx);
        }
    }
    if (sorting_props.col_index >= boomtabledata.cols_found.length ){
        sorting_props.col_index = -1;
    }
};

export {
    defaultPattern,
    seriesToTable,
    removeHiddenColFromTable,
    updateSortColIdxForTable,
};
