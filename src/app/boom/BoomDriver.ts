import _ from "lodash";
import { BoomPatternData, IBoomTableTransformationOptions, IBoomTable, IBoomCellDetails } from "./index";
import { BoomRender, IBoomHTML, IBoomRenderingOptions, IBoomTableStyles } from "./index";
import { BoomSeries } from "./BoomSeries";
import { BoomPattern } from "./BoomPattern";
import { IBoomFixedRow, IBoomFixedCol } from "./Boom.interface";
import { BoomFixedCol } from "./BoomPattern";
import { PanelCtrl } from "../../module";
import { columnSortTypes, config, multiValueShowPriorities } from "../config";
import { replaceTokens, boomSortFunc } from "./BoomUtils";

class BoomDriver {
    public ctrl:     PanelCtrl;
    public panel:    any;
    public patterns: {[id: number]: BoomPatternData} = {};
    public columns:  {[name: string]: BoomFixedCol } = {};
    public inputs:   any = [];                    // series from input query data
    public boomSeries: BoomSeries[] = [];         // series witch parsed from input series
    public boomTable:  IBoomTable   | undefined;  // data generated from boomSeries
    public boomRender: BoomRender   | undefined;  // render to rend boomTable to boomHtml
    public boomHtml:   IBoomHTML    | undefined;  // the output html result
    public boomHtmld:  IBoomHTML    | undefined;  // the output html result of debug
    public tb_styles: IBoomTableStyles | undefined;
    public cost = "";
    constructor(ctrl: PanelCtrl){
        this.ctrl   = ctrl;
        this.panel  = ctrl.panel;
        this.inputs = ctrl.dataReceived;
    }

    public doProcessing(){
        let start = new Date();

        this._registerPatterns();
        this._parsingInputs();
        this._genTableData();
        this._renderHtml();

        let end = new Date();
        let diffms = end.getTime() - start.getTime();
        this.cost = "" + (diffms / 1000) + "s";
    }

    private _registerPatterns(){
        this.patterns = {};
        this.panel.defaultPattern.id = -1;
        this.registerPattern(this.panel.defaultPattern);
        let id = 0;
        _.each(this.panel.patterns, (pt: BoomPattern) => {
          pt.id = id;
          this.registerPattern(pt);
          id += 1;
        });
        this._resetColumnsFromPatterns();
    }
    public registerPattern(pattern: BoomPattern): BoomPatternData {
        let data = this.patterns[pattern.id];
        if ( data === undefined ){
            data = new BoomPatternData(pattern, this.ctrl);
            this.patterns[pattern.id] = data;
        }
        return data;
    }

    private _parsingInputs(){
        if (!this.inputs){
            return;
        }
        let patterns        = this.panel.patterns;
        let defaultPattern  = this.panel.panelDefaultPattern;
        this.inputs.map(input => {
            let alias: string = input.target;
            let pattern: BoomPattern = _.find(patterns.filter(p => { return p.disabled !== true; }), p => alias.match(p.pattern)) || defaultPattern;
            this.getPatternData(pattern.id).addInput(input);
        });

        let boomSeries: BoomSeries[] = [];
        _.each(this.patterns, (pattern: BoomPatternData) =>{
            pattern.joinData();
            pattern.genBoomSeries();
            boomSeries = boomSeries.concat(pattern.boomSeries);
        });
        this.boomSeries = boomSeries;

        this._addColumnsFromBoomSeries();
    }

    private _genTableData() {
        let options: IBoomTableTransformationOptions = {
            cols_sort_type:                 this.panel.cols_sort_type === columnSortTypes[1] ? columnSortTypes[1] : columnSortTypes[0],
            non_matching_cells_color_bg:    this.panel.non_matching_cells_color_bg,
            non_matching_cells_color_text:  this.panel.non_matching_cells_color_text,
            non_matching_cells_text:        this.panel.non_matching_cells_text,
        };
        this.boomTable = this._boomSeriesToTable(options);
        this._updateSortColIdxForTable();
        this._removeHiddenColFromTable();
    }

    private _validateTableStyles() {
        let huh: number    = Number(this.panel.header_unit_height);
        let huw: number    = Number(this.panel.header_unit_width);
        let hup: number    = Number(this.panel.header_unit_padding);
        let buh: number    = Number(this.panel.body_unit_height);
        let buw: number    = Number(this.panel.body_unit_width);
        let bup: number    = Number(this.panel.body_unit_padding);
        let huf_sz: string = this.panel.header_font_size || "1rem";
        let huf_sc: number = Number(this.panel.header_font_scale);
        let buf_sz: string = this.panel.body_font_size   || "1rem";
        let buf_sc: number = Number(this.panel.body_font_scale);
        let cols: number = this.boomTable!.cols_found.length;
        let rows: number = this.boomTable!.rows_found.length;
        let huf_block = "";
        let buf_block = "";
        let huf_overflow = "";
        let buf_overflow = "";

        if ( isNaN(huh) ) { huh = -1; }
        if ( isNaN(huw) ) { huw = -1; }
        if ( isNaN(hup) ) { hup = -1; }
        if ( isNaN(buh) ) { buh = -1; }
        if ( isNaN(buw) ) { buw = -1; }
        if ( isNaN(bup) ) { bup = -1; }
        if ( isNaN(huf_sc) ) { huf_sc = -1; }
        if ( isNaN(buf_sc) ) { buf_sc = -1; }

        // validate width and height
        let tw = 0;
        let th = 0;
        {
            if (bup > 0) {
                if (buh < (bup*2)) { buh = bup*2; }
                if (buw < (bup*2)) { buw = bup*2; }
            }
            if (buh > -1){ th = buh; th = (th + 1) * cols - 1; }
            if (buw > -1){ tw = buw; tw = (tw + 1) * cols - 1; }
            if (hup > 0){
                if (huh < (hup*2)) { huh = hup*2; }
                if (huw < (hup*2)) { huw = hup*2; }
            }
            if (huh > -1){ th = huh; th = (th + 1) * cols - 1; }
            if (huw > -1){ tw = huw; tw = (tw + 1) * cols - 1; }
        }
        // validata font styles
        let huf_style = "";
        let buf_style = "";
        {
            if (huf_sz === "" || undefined) { huf_sz = "1rem"; }
            if (buf_sz === "" || undefined) { buf_sz = "1rem"; }

            huf_style = `font-size:${huf_sz};`;
            buf_style = `font-size:${buf_sz};`;

            if ( !isNaN(huf_sc) && huf_sc > 0){
                huf_style   += `transform:scale(${huf_sc}) !important;`;
                huf_block    = "display:block;";
                huf_overflow = "overflow: hidden;";
            }
            if ( !isNaN(buf_sc) && buf_sc > 0) {
                buf_style   += `transform:scale(${buf_sc}) !important;`;
                buf_block    = "display:block;";
                buf_overflow = "overflow: hidden;";
            }
        }
        this.tb_styles = {
            // tslint:disable-next-line: object-literal-sort-keys
            columns            : cols,
            rows               : rows,
            // tslint:disable-next-line: object-literal-sort-keys
            height             : th,
            width              : tw,
            height_style       : th < 1 ? "" : "height:"  + th + "px",
            width_style        : tw < 1 ? "" : "width:"   + (tw / 0.89) + "px",
            // tslint:disable-next-line: object-literal-sort-keys
            header_unit_width  : huw,
            header_unit_height : huh,
            header_unit_padding: hup,
            body_unit_width    : buw,
            body_unit_height   : buh,
            body_unit_padding  : bup,
            // tslint:disable-next-line: object-literal-sort-keys
            head_font_size     : huf_sz,
            head_font_scale    : huf_sc,
            body_font_size     : buf_sz,
            body_font_scale    : buf_sc,
            // tslint:disable-next-line: object-literal-sort-keys
            header_unit_width_style  : huw < 0 ? "" : "width:"   + (huw) + "px;",
            header_unit_height_style : huh < 0 ? "" : "height:"  + (huh) + "px;",
            header_unit_padding_style: hup < 0 ? "" : "padding:" + (hup) + "px;",
            body_unit_width_style    : buw < 0 ? "" : "width:"   + (buw) + "px;",
            body_unit_height_style   : buh < 0 ? "" : "height:"  + (buh) + "px;",
            body_unit_padding_style  : bup < 0 ? "" : "padding:" + (bup) + "px;",
            header_font_style        : huf_style + huf_block + huf_overflow,
            body_font_style          : buf_style + buf_block + buf_overflow,
        };
    }

    private _renderHtml() {
        this._validateTableStyles();
        let options: IBoomRenderingOptions = {
            default_title_for_rows:     this.panel.default_title_for_rows || config.default_title_for_rows,
            first_column_link:          this.panel.first_column_link || "#",
            hide_first_column:          this.panel.hide_first_column,
            hide_headers:               this.panel.hide_headers,
            text_alignment_firstcolumn: this.panel.text_alignment_firstcolumn,
            text_alignment_values:      this.panel.text_alignment_values,
            // tslint:disable-next-line: object-literal-sort-keys
            table_styles:               this.tb_styles!,
        };

        this.boomRender = new BoomRender(options);
        this.boomHtml   = this.boomRender.getDataAsHTML(this.boomTable, this.panel.sorting_props);
        this.boomHtmld  = {body: ""};
        if (this.panel.debug_mode){
            this.boomHtmld = this.boomRender.getDataAsDebugHTML(this.boomTable);
        }
    }

    public getPatternData(idx: number): BoomPatternData {
        return this.patterns[idx];
    }
    public getPattern(idx: number): BoomPattern{
        return this.getPatternData(idx).pattern;
    }

    public getShowColumns(): string[]{
        if (this.boomTable === undefined){
            return [];
        }
        return this.boomTable.cols_found.map((col: string) => {
            col = this.columns[col].show;
            return this.ctrl.$sce.trustAsHtml(col);
        });
    }

    public getFixedRows(): string[] {
        let ret: string[] = [];
        _.each(this.patterns, (data: BoomPatternData) => {
            _.each(data.pattern.fixed_rows, (row: IBoomFixedRow) => {
                if (row.name !== ""){
                    ret.push(row.name);
                }
            });
        });
        ret = _.uniq(ret, item => item);
        return ret;
    }

    public getFixedCols(): string[] {
        let ret: string[] = [];
        _.each(this.patterns, (data: BoomPatternData) => {
            _.each(data.pattern.fixed_cols, (col: IBoomFixedCol) => {
                if (col.name !== ""){
                    ret.push(col.name);
                }
            });
        });
        ret = _.uniq(ret, item => item);
        return ret;
    }

    public getTableWidth(): number {
        let pd: number = Number(this.panel.table_unit_padding);
        let uw: number = Number(this.panel.table_unit_width);
        if (isNaN(pd)) {pd = 0;}
        if (isNaN(uw)) {uw = 0;}
        if (uw < (pd * 2)) { uw = pd * 2;}
        if (pd < 1 && uw < 1){ return 0;}
        uw += 2;
        let col_num = this.boomTable!.cols_found.length;
        console.log(col_num, pd, uw);
        return uw * col_num - col_num + 1;
    }
    public getTableHeight(): number {
        let pd: number = Number(this.panel.table_unit_padding);
        let uh: number = Number(this.panel.table_unit_height);
        if (isNaN(pd)) {pd = 0;}
        if (isNaN(uh)) {uh = 0;}
        if (pd < 1 && uh < 1){ return 0;}
        if (pd < 0          ){ pd = 0;}
        if (uh < 0          ){ uh = 0;}
        let col_num = this.boomTable!.rows_found.length;
        return (col_num - 1) + (col_num * (pd + uh));
    }

    public getTableWidthStyle(): string {
        let w = this.getTableWidth();
        return w > 0 ? "width:" + w + "px" : "";
    }
    public getTableHeightStyle(): string {
        let h = this.getTableHeight();
        return h > 0 ? "width:" + h + "px" : "";
    }

    private _resetColumnsFromPatterns() {
        // search from pattern fixed columns
        let cols: {[name: string]: BoomFixedCol} = {};
        _.each(this.patterns, (ptdata: BoomPatternData) => {
            _.each(ptdata.pattern.fixed_cols, (fcol: IBoomFixedCol) => {
                if (fcol.name !== "" && cols[fcol.name] === undefined){
                    let new_col = new BoomFixedCol(fcol.name);
                    new_col.order = fcol.order !== "" ? fcol.order : fcol.name;
                    new_col.show  = fcol.show  !== "" ? fcol.show  : fcol.name;
                    new_col.bg_color = fcol.bg_color;
                    new_col.text_color = fcol.text_color;
                    new_col.from  = "pattern:" + ptdata.pattern.id;
                    cols[fcol.name] = new_col;
                }
            });
        });
        this.columns = cols;
    }
    private _addColumnsFromBoomSeries() {
        // search from series
        let cols: {[name: string]: BoomFixedCol} = this.columns;
        let cols_found: string[] = _.uniq(_.map(this.boomSeries, (d: { col_name: any; }) => d.col_name));
        _.each(cols_found, (name: string) => {
            if (cols[name] === undefined){
                let new_col = new BoomFixedCol(name);
                new_col.order = name;
                new_col.show  = name;
                cols[name] = new_col;
            }
        });
    }

    private _getSortedColumns(sort_type: string): BoomFixedCol[]{
        return _.map(this.columns, col => col).sort((a: BoomFixedCol, b: BoomFixedCol) => {
            return boomSortFunc(a.order, b.order, sort_type);
        });
    }

    private _boomSeriesToTable(options: IBoomTableTransformationOptions) {
        let rows_found = _.uniq(_.uniq(_.map(this.boomSeries, (d: { row_name: any; }) => d.row_name)).concat(this.getFixedRows()));
        let rows_without_token = _.uniq(_.map(this.boomSeries, (d: { row_name_raw: any; }) => d.row_name_raw));
        let cols_found: BoomFixedCol[] = this._getSortedColumns(options.cols_sort_type);
        let row_col_cells: IBoomCellDetails[][] = [];
        _.each(rows_found, (row_name: any) => {
            let cols: IBoomCellDetails[] = [];
            _.each(cols_found, (col: BoomFixedCol) => {
                let col_name = col.name;
                let matched_items: BoomSeries[] = _.filter(this.boomSeries, (o: { row_name: any; col_name: any; hidden: any }) => {
                    return o.row_name === row_name && o.col_name === col_name && o.hidden === false;
                });
                if (!matched_items || matched_items.length === 0) {
                    let cell = {
                        "col_name": col_name,
                        "color_bg": col.bg_color || options.non_matching_cells_color_bg,
                        "color_text": col.text_color || options.non_matching_cells_color_text,
                        "display_value": replaceTokens(options.non_matching_cells_text),
                        "hidden": false,
                        "items": [],
                        "link": "-",
                        "row_name": row_name,
                        "tooltip": "-",
                        "value": NaN,
                    };
                    cell.tooltip = `<div style="font-size:12px;color:${cell.color_bg};text-align:left">` + cell.tooltip + '</div>';
                    cols.push(cell);
                } else if (matched_items && matched_items.length === 1) {
                    let cell = matched_items[0].toBoomCellDetails();
                    cell.tooltip = `<div style="font-size:12px;color:${cell.color_bg};text-align:left">` + cell.tooltip + '</div>';
                    cols.push(cell);
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
                    let pattern = this.getPattern(item.pattern_id.valueOf());
                    let classify = {};
                    let min_id = item.color_bg_id;
                    let max_id = item.color_bg_id;
                    let choosen: BoomSeries = item;
                    if (pattern.enable_multivalue_cells) {
                        // tslint:disable-next-line: no-shadowed-variable
                        _.each(matched_items, (item: BoomSeries) => {
                            cell.items.push(item.toBoomCellDetails());
                            cell.tooltip += `<div style="font-size:12px;color:${item.color_bg};text-align:left">` + item.tooltip + '</div>';
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
                            cell.tooltip += `<div style="font-size:12px;color:${item.color_bg};text-align:left">` + item.tooltip + '</div>';
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
            cols_found: _.map(cols_found, (col: BoomFixedCol) => col.name),
            row_col_cells,
            rows_found,
            rows_without_token,
        };
    }

    private _removeHiddenColFromTable() {
        if (this.boomTable === undefined){
            return;
        }
        let cols_found = this.boomTable.cols_found;
        for (let col of this.panel.sorting_props) {
            let idx = cols_found.indexOf(col);
            if (idx !== -1 ){
                cols_found.splice(idx, 1);
            }
        }
        this.boomTable.cols_found = cols_found;
    }

    private _updateSortColIdxForTable() {
        if (this.boomTable === undefined){
            return;
        }
        let sorting_props = this.panel.sorting_props;
        if (sorting_props.sort_column !== undefined && sorting_props.sort_column !== ""){
            let idx = this.boomTable.cols_found.indexOf(sorting_props.sort_column);
            if (idx !== -1){
                sorting_props.col_index = idx;
                console.log("set sort col idx to " + idx);
            }
        }
        if (sorting_props.col_index >= this.boomTable.cols_found.length ){
            sorting_props.col_index = -1;
        }
    }
}

export {
    BoomDriver
};
