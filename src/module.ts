///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import _ from "lodash";
import kbn from 'app/core/utils/kbn';
import { loadPluginCss, MetricsPanelCtrl } from "app/plugins/sdk";
import { IBoomRenderingOptions, IBoomTable, IBoomHTML, IBoomTableTransformationOptions } from "./app/boom/index";
import { BoomPattern, BoomSeries, BoomOutput } from "./app/boom/index";
import { plugin_id, value_name_options, textAlignmentOptions, columnSortTypes, multiValueShowPriorities, config } from "./app/config";
import { defaultPattern, seriesToTable, removeHiddenColFromTable, updateSortColIdxForTable } from "./app/app";
import { BoomPatternDatas } from "./app/boom/BoomPatternData";

loadPluginCss({
  dark: `plugins/${plugin_id}/css/default.dark.css`,
  light: `plugins/${plugin_id}/css/default.light.css`
});

class GrafanaBoomTableCtrl extends MetricsPanelCtrl {
  public static templateUrl = "partials/module.html";
  public unitFormats = kbn.getUnitFormats();
  public valueNameOptions = value_name_options;
  public textAlignmentOptions = textAlignmentOptions;
  public columnSortTypes = columnSortTypes;
  public multiValueShowPriorities = multiValueShowPriorities;
  public outdata;
  public dataReceived: any;
  public ctrl: any;
  public elem: any;
  public attrs: any;
  public $sce: any;
  public patternDatas: BoomPatternDatas;
  constructor($scope, $injector, $sce) {
    super($scope, $injector);
    _.defaults(this.panel, config.panelDefaults);
    this.patternDatas = new BoomPatternDatas();
    this.panel.defaultPattern = this.panel.defaultPattern || defaultPattern;
    this.$sce = $sce;
    this.templateSrv = $injector.get("templateSrv");
    this.timeSrv = $injector.get("timeSrv");
    this.updatePrototypes();
    this.events.on("data-received", this.onDataReceived.bind(this));
    this.events.on("data-snapshot-load", this.onDataReceived.bind(this));
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    this.panel.activePatternIndex = this.panel.activePatternIndex === -1 ? this.panel.patterns.length : this.panel.activePatternIndex;
  }
  private updatePrototypes(): void {
    Object.setPrototypeOf(this.panel.defaultPattern, BoomPattern.prototype);
    this.panel.patterns.map(pattern => {
      Object.setPrototypeOf(pattern, BoomPattern.prototype);
      return pattern;
    });
  }
  public onDataReceived(data: any): void {
    this.dataReceived = data;
    this.render();
  }
  public onInitEditMode(): void {
    this.addEditorTab("Patterns", `public/plugins/${plugin_id}/partials/editor.html`, 2);
  }
  public addPattern(): void {
    let newPattern = new BoomPattern({
      row_col_wrapper: this.panel.row_col_wrapper
    });
    this.panel.patterns.push(newPattern);
    this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : (this.panel.patterns.length - 1);
    this.render();
  }
  public removePattern(index: Number): void {
    this.panel.patterns.splice(index, 1);
    this.panel.activePatternIndex = this.panel.activePatternIndex === -2 ? -2 : ((this.panel.patterns && this.panel.patterns.length > 0) ? (this.panel.patterns.length - 1) : -1);
    this.render();
  }
  public movePattern(direction: string, index: Number) {
    let tempElement = this.panel.patterns[Number(index)];
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
  }
  public clonePattern(index: Number): void {
    let copiedPattern = Object.assign({}, this.panel.patterns[Number(index)]);
    Object.setPrototypeOf(copiedPattern, BoomPattern.prototype);
    this.panel.patterns.push(copiedPattern);
    this.render();
  }
  public sortByHeader(headerIndex: number) {
    this.panel.sorting_props = this.panel.sorting_props || {
      col_index: -1,
      direction: "desc"
    };
    this.panel.sorting_props.col_index = headerIndex;
    this.panel.sorting_props.direction = this.panel.sorting_props.direction === "asc" ? "desc" : "asc";
    console.log("sortByHeaderIndex: " + headerIndex + " in " + this.panel.sorting_props.direction);
    this.render();
  }
  public genHiddelStr(){
    let str = '';
    _.each(this.panel.sorting_props.hidden_cols, item => {
      str += item + ',';
    });
    this.panel.sorting_props.hidden_cols_str = str;
  }
  public hiddenCol(colName: string){
    this.panel.sorting_props.hidden_cols = this.panel.sorting_props.hidden_cols || [];
    if ( colName === undefined || colName === ""){
      colName = this.panel.sorting_props.hidden_input;
    }
    if (colName !== undefined && colName !== "" && this.panel.sorting_props.hidden_cols.indexOf(colName) < 0){
      this.panel.sorting_props.hidden_cols.push(colName);
    }
    console.log("hiddenCol: " + colName);
    this.genHiddelStr();
    this.panel.sorting_props.hidden_input = "";
    this.render();
  }
  public unHiddenCol(colName: string){
    this.panel.sorting_props.hidden_cols = this.panel.sorting_props.hidden_cols || [];
    if ( colName === undefined || colName === ""){
      colName = this.panel.sorting_props.hidden_input;
    }
    if (colName !== null && colName !== ""){
      let idx = this.panel.sorting_props.hidden_cols.indexOf(colName);
          if (idx > -1){
            this.panel.sorting_props.hidden_cols.splice(idx, 1);
          }
    }
    console.log("unHiddenCol: " + colName);
    this.genHiddelStr();
    this.panel.sorting_props.hidden_input = "";
    this.render();
  }
  public limitText(text: string, maxlength: Number): string {
    if (text.split('').length > maxlength) {
      text = text.substring(0, Number(maxlength) - 3) + "...";
    }
    return text;
  }
  public link(scope: any, elem: any, attrs: any, ctrl: any): void {
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
  }
}

GrafanaBoomTableCtrl.prototype.render = function () {
  this.patternDatas = new BoomPatternDatas();
  this.patternDatas.registerPatterns(this.panel.defaultPattern, this.panel.patterns);
  if (this.dataReceived) {
    let outputdata: BoomSeries[] = this.dataReceived.map(seriesData => {
      let seriesOptions = {
        debug_mode:       this.panel.debug_mode,
        row_col_wrapper:  this.panel.row_col_wrapper || "_"
      };
      // console.log( seriesData );
      return new BoomSeries(seriesData, this.panel, this.patternDatas, seriesOptions, this.templateSrv, this.timeSrv);
    });
    console.log ( this.patternDatas );
    let boomTableTransformationOptions: IBoomTableTransformationOptions = {
      cols_sort_type:                 this.panel.cols_sort_type === columnSortTypes[1] ? columnSortTypes[1] : columnSortTypes[0],
      non_matching_cells_color_bg:    this.panel.non_matching_cells_color_bg,
      non_matching_cells_color_text:  this.panel.non_matching_cells_color_text,
      non_matching_cells_text:        this.panel.non_matching_cells_text,
    };
    let boomtabledata: IBoomTable = seriesToTable(outputdata, boomTableTransformationOptions, this.patternDatas);
    updateSortColIdxForTable(boomtabledata, this.panel.sorting_props);
    console.log( boomtabledata );
    removeHiddenColFromTable(boomtabledata, this.panel.sorting_props.hidden_cols);
    let renderingOptions: IBoomRenderingOptions = {
      default_title_for_rows:     this.panel.default_title_for_rows || config.default_title_for_rows,
      first_column_link:          this.panel.first_column_link || "#",
      hide_first_column:          this.panel.hide_first_column,
      hide_headers:               this.panel.hide_headers,
      table_unit_height:          this.panel.table_unit_height,
      table_unit_padding:         this.panel.table_unit_padding,
      table_unit_width:           this.panel.table_unit_width,
      text_alignment_firstcolumn: this.panel.text_alignment_firstcolumn,
      text_alignment_values:      this.panel.text_alignment_values,
    };
    let boom_output = new BoomOutput(renderingOptions);
    this.outdata = {
      cols_found: boomtabledata.cols_found.map(col => { return this.$sce.trustAsHtml(col); })
    };
    let renderingdata: IBoomHTML = boom_output.getDataAsHTML(boomtabledata, this.panel.sorting_props);
    this.elem.find('#boomtable_output_body').html(`` + renderingdata.body);
    this.elem.find('#boomtable_output_body_debug').html(this.panel.debug_mode ? boom_output.getDataAsDebugHTML(outputdata) : ``);
    this.elem.find("[data-toggle='tooltip']").tooltip({
      boundary: "scrollParent"
    });
    let rootElem = this.elem.find('.table-panel-scroll');
    let originalHeight = this.ctrl.height;
    if (isNaN(originalHeight)) {
      if (this.ctrl && this.ctrl.elem && this.ctrl.elem[0] && this.ctrl.elem[0].clientHeight) {
        originalHeight = this.ctrl.elem[0].clientHeight;
      }
    }
    let maxheightofpanel = this.panel.debug_mode ? originalHeight - 111 : originalHeight - 31;
    rootElem.css({ 'max-height': maxheightofpanel + "px" });
  }
};

export {
  GrafanaBoomTableCtrl as PanelCtrl
};
