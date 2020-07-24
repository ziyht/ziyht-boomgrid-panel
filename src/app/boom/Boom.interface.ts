interface IBoomPattern {
    bgColors: string;
    bgColors_overrides: string;
    clickable_cells_link: string;
    col_name: string;
    decimals: Number;
    delimiter: string;
    enable_bgColor: Boolean;
    enable_bgColor_overrides: Boolean;
    enable_clickable_cells: Boolean;
    enable_multivalue_cells: Boolean;
    enable_textColor: Boolean;
    enable_textColor_overrides: Boolean;
    enable_time_based_thresholds: Boolean;
    enable_filtered_thresholds: Boolean;
    enable_transform: Boolean;
    enable_transform_overrides: Boolean;
    displayTemplate: string;
    defaultBGColor: string;
    defaultTextColor: string;
    filter: {
        value_above: string;
        value_below: string;
    };
    fixed_rows: IBoomFixedRow[];
    fixed_cols: IBoomFixedCol[];
    custom_parsing_values: IBoomCustomParsingValue[];
    format: string;
    id: number;
    name: string;
    null_color: string;
    null_value: string;
    null_textcolor: string;
    multi_value_show_priority: string;
    pattern: string;
    row_name: string;
    textColors: string;
    textColors_overrides: string;
    thresholds: string;
    filtered_thresholds: IBoomFilteredThreshold[];
    time_based_thresholds: IBoomTimeBasedThreshold[];
    transform_values: string;
    transform_values_overrides: string;
    tooltipTemplate: string;
    valueName: string;
}
interface IBoomTableStyles{
    // styles
    header_unit_width_style: string;
    header_unit_height_style: string;
    header_unit_padding_style: string;
    body_unit_width_style: string;
    body_unit_height_style: string;
    body_unit_padding_style: string;
    width_style: string;
    height_style: string;
    header_font_style: string;
    body_font_style: string;
    // datas
    header_unit_width: number;
    header_unit_height: number;
    header_unit_padding: number;
    body_unit_width: number;
    body_unit_height: number;
    body_unit_padding: number;
    width: number;
    height: number;
    columns: number;
    rows: number;
    head_font_size: string;
    head_font_scale: number;
    body_font_size: string;
    body_font_scale: number;
}
interface IBoomPatternData {
    series:  IBoomSeries[];
    pattern: IBoomPattern;
}
interface IBoomFixedRow {
    name: string;
}
interface IBoomFixedCol {
    name:  string;
    order: string;
    show:  string;
    bg_color: string;
    text_color: string;
}
interface IBoomCustomParsingValue {
    label: string;
    get: string;
}
// interface IBoomJoin {
//     match: string;
// }
// interface IBoomJoiner {
//     joinby: string;
//     joins: IBoomJoin[];
// }
interface IBoomSeries {
    col_name: string;
    color_bg: string;
    color_text: string;
    display_value: string;
    hidden: Boolean;
    link: string;
    pattern_id: Number;
    row_name: string;
    row_name_raw: string;
    tooltip: string;
    value_formatted: string;
}
interface IBoomFilteredThreshold {
    match: string;
    threshold: string;
}
interface IBoomTimeBasedThreshold {
    enabledDays: string;
    from: string;
    name: string;
    threshold: string;
    to: string;
}
interface IBoomTableTransformationOptions {
    non_matching_cells_color_bg: string;
    non_matching_cells_color_text: string;
    non_matching_cells_text: string;
    cols_sort_type: string;
}
interface IBoomRenderingOptions {
    default_title_for_rows: String;
    hide_first_column: Boolean;
    hide_headers: Boolean;
    text_alignment_firstcolumn: String;
    text_alignment_values: String;
    first_column_link: String;
    table_styles: IBoomTableStyles;
}
interface IBoomCellDetails {
    col_name: string;
    color_bg: string;
    color_text: string;
    display_value: string;
    hidden: Boolean;
    items: IBoomCellDetails[];  // store multi series for one cell
    link: string;
    row_name: string;
    tooltip: string;
    value: number;
}
interface IBoomTable {
    rows_without_token: string[];
    rows_found: string[];
    cols_found: string[];
    row_col_cells: IBoomCellDetails[][];     // [ [co1, col2, ...], [col1, col2,...], ... ]
}
interface IBoomHTML {
    body: string;
}

export {
    IBoomTableTransformationOptions,
    IBoomRenderingOptions,
    IBoomCustomParsingValue,
    IBoomTableStyles,
    IBoomFixedCol,
    IBoomFixedRow,
    IBoomPattern,
    IBoomPatternData,
    IBoomSeries,
    IBoomFilteredThreshold,
    IBoomTimeBasedThreshold,
    IBoomHTML,
    IBoomTable,
    IBoomCellDetails,
};
