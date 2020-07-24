import _ from "lodash";
import { IBoomHTML, IBoomTable, IBoomRenderingOptions, IBoomSeries } from "./index";
import { getActualNameWithoutTokens, boomSortFunc } from "./BoomUtils";
import { IBoomCellDetails } from "./Boom.interface";

export class BoomRender {
  public default_title_for_rows: String;
  public hide_first_column: Boolean;
  public hide_headers: Boolean;
  public text_alignment_firstcolumn: String;
  public text_alignment_values: String;
  public first_column_link: String;
  public table_unit_style: string;
  public getDataAsHTML;
  public getDataAsDebugHTML;
  constructor(options: IBoomRenderingOptions) {
    this.default_title_for_rows = options.default_title_for_rows || "";
    this.hide_first_column = options.hide_first_column;
    this.hide_headers = options.hide_headers;
    this.text_alignment_firstcolumn = options.text_alignment_firstcolumn || "";
    this.text_alignment_values = options.text_alignment_values || "";
    this.first_column_link = options.first_column_link || "#";
    this.table_unit_style  = options.table_styles.body_unit_height_style +
                             options.table_styles.body_unit_width_style  +
                             options.table_styles.body_unit_padding_style+
                             options.table_styles.body_font_style;

    console.log(this.table_unit_style);
  }
}
BoomRender.prototype.getDataAsHTML = function (data: IBoomTable, sorting_props): IBoomHTML {
  let getLinkifiedColumn = function (rowName: string, first_column_link: string, raw_rowName: string): string {
    if (first_column_link !== "#") {
      first_column_link = first_column_link.replace(new RegExp("_row_name_", "g"), getActualNameWithoutTokens(raw_rowName).trim());
      rowName = `<a href="${first_column_link}" target="_blank">${rowName}</a>`;
    }
    return rowName;
  };
  let output: IBoomHTML = {
    body: ""
  };
  if (sorting_props && sorting_props.col_index !== undefined) {
    if (sorting_props.col_index > -1){
      let sortFunction = (a, b, sortMethod) => {
        if (sortMethod === "asc") {
          return a[sorting_props.col_index].value - b[sorting_props.col_index].value;
        } else {
          return b[sorting_props.col_index].value - a[sorting_props.col_index].value;
        }
      };
      data.row_col_cells = data.row_col_cells
        .filter(a => !isNaN(a[sorting_props.col_index].value))
        .concat(data.row_col_cells.filter(a => isNaN(a[sorting_props.col_index].value)))
        .sort((a, b) => sortFunction(a, b, sorting_props.direction));
    } else if (sorting_props.col_index === -1) {
      let sortFunction = (a: IBoomCellDetails[], b: IBoomCellDetails[], sortMethod: string) => {
        return boomSortFunc(a[0].row_name, b[0].row_name, sortMethod);
      };
      data.row_col_cells = data.row_col_cells.sort((a, b) => sortFunction(a, b, sorting_props.direction));
    }
  }
  _.each(data.row_col_cells, o => {
    if (o.map(item => item.hidden.toString()).indexOf("false") > -1) {
      output.body += "<tr>";
      if (this.hide_first_column !== true) {
        let raw_rowName = (_.first(o.map(item => item.row_name_raw)));
        output.body += `
                    <td style="${this.table_unit_style};text-align:${this.text_alignment_firstcolumn}">
                        ${getLinkifiedColumn(_.first(o.map(item => item.row_name)), String(this.first_column_link), raw_rowName)}
                    </td>`;
      }
      _.each(o, item => {
        if ( sorting_props.hidden_cols.indexOf( item.col_name ) === -1 ){
          if (item.display_value === undefined){
            item.display_value = "-";
          }
          let item_style = `${this.table_unit_style};background-color:${item.color_bg};color:${
            item.color_text
            };text-align:${this.text_alignment_values}`;
          let item_display = (item.link === "#") ? item.display_value
              : `<a href="${item.link}" target="_blank" style="color:${item.color_text}">${item.display_value}</a>`;
          let tooltip = (!item.tooltip || item.tooltip === "-") ? undefined
              : ` data-toggle="tooltip" data-html="true" data-placement="top" title="${
                item.tooltip.replace(/\"/g, '&#34;')
              }" style="display:block;width:100%;height:100%;"`;
          output.body += `
                      <td style="${item_style}">
                          ${tooltip ? `<span ${tooltip}>` : ""}
                              ${item_display ? `${item_display}` : ""}
                          ${tooltip ? `</span>` : ""}
                      </td>
                  `;
        }
      });
      output.body += "</tr>";
    }
  });
  // console.log( "html: ", output.body );
  return output;
};
BoomRender.prototype.getDataAsDebugHTML = function (data: IBoomSeries[]): string {
  let debugdata = ``;
  debugdata = _.map(data, d => {
    return `
        <tr>
            <td style="padding:4px;text-align:left;width:30%; title="Series Name" >${d.seriesName}</td>
            <td style="padding:4px;text-align:left;width:10%; title="Matching Pattern Name" >${d.pattern.name || d.pattern.pattern || "Default"}</td>
            <td style="padding:4px;text-align:left;width:10%; title="Value : ${String(d.value_formatted || "null")} / Raw : ${String(d.value || "null")} / Stat : ${d.pattern.valueName}">${d.display_value}</td>
            <td style="padding:4px;text-align:left;width:10%; title="Row name" >${d.row_name}</td>
            <td style="padding:4px;text-align:left;width:10%; title="Col name" >${d.col_name}</td>
            <td style="padding:4px;text-align:left;width:10%; title="Thresholds" >${d.thresholds.join(",")}</td>
            <td style="padding:4px;text-align:left;width:10%; title="BG Color" >${d.color_bg}</td>
            <td style="padding:4px;text-align:left;width:10%; title="Text Color" >${d.color_text}</td>
        </tr>
        `;
  }).join(``);
  return debugdata;
};
