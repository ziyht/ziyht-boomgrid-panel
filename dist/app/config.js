System.register([], function (exports_1, context_1) {
    "use strict";
    var plugin_id, value_name_options, textAlignmentOptions, multiValueShowPriorities, columnSortTypes, config;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            plugin_id = "ziyht-boomgrid-panel";
            exports_1("plugin_id", plugin_id);
            value_name_options = [
                { text: "Min", value: "min" },
                { text: "Max", value: "max" },
                { text: "Average", value: "avg" },
                { text: "Current", value: "current" },
                { value: 'last_time', text: 'Time of last data point' },
                { value: 'last_time_nonnull', text: 'Time of last non null data point' },
                { text: "Total", value: "total" }
            ];
            exports_1("value_name_options", value_name_options);
            textAlignmentOptions = ["left", "right", "center"];
            exports_1("textAlignmentOptions", textAlignmentOptions);
            multiValueShowPriorities = ["Minimum", "Maximum"];
            exports_1("multiValueShowPriorities", multiValueShowPriorities);
            columnSortTypes = ["asc", "desc"];
            exports_1("columnSortTypes", columnSortTypes);
            config = {
                debug_mode: false,
                error: undefined,
                groupedData: undefined,
                hide_first_column: false,
                hide_headers: false,
                panelDefaults: {
                    activePatternIndex: -1,
                    default_title_for_rows: "Metric",
                    patterns: [],
                    row_col_wrapper: "_",
                }
            };
            exports_1("config", config);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQUFNLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQzs7WUFDbkMsa0JBQWtCLEdBQUc7Z0JBQ3ZCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUM3QixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtnQkFDN0IsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7Z0JBQ2pDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO2dCQUNyQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLHlCQUF5QixFQUFFO2dCQUN2RCxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsa0NBQWtDLEVBQUU7Z0JBQ3hFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2FBQ3BDLENBQUM7O1lBQ0ksb0JBQW9CLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDOztZQUNuRCx3QkFBd0IsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7WUFDbEQsZUFBZSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztZQUNsQyxNQUFNLEdBQVE7Z0JBQ2hCLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixLQUFLLEVBQUUsU0FBUztnQkFDaEIsV0FBVyxFQUFFLFNBQVM7Z0JBQ3RCLGlCQUFpQixFQUFFLEtBQUs7Z0JBQ3hCLFlBQVksRUFBRSxLQUFLO2dCQUNuQixhQUFhLEVBQUU7b0JBQ1gsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO29CQUN0QixzQkFBc0IsRUFBRSxRQUFRO29CQUNoQyxRQUFRLEVBQUUsRUFBRTtvQkFDWixlQUFlLEVBQUUsR0FBRztpQkFDdkI7YUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGx1Z2luX2lkID0gXCJ6aXlodC1ib29tZ3JpZC1wYW5lbFwiO1xyXG5jb25zdCB2YWx1ZV9uYW1lX29wdGlvbnMgPSBbXHJcbiAgICB7IHRleHQ6IFwiTWluXCIsIHZhbHVlOiBcIm1pblwiIH0sXHJcbiAgICB7IHRleHQ6IFwiTWF4XCIsIHZhbHVlOiBcIm1heFwiIH0sXHJcbiAgICB7IHRleHQ6IFwiQXZlcmFnZVwiLCB2YWx1ZTogXCJhdmdcIiB9LFxyXG4gICAgeyB0ZXh0OiBcIkN1cnJlbnRcIiwgdmFsdWU6IFwiY3VycmVudFwiIH0sXHJcbiAgICB7IHZhbHVlOiAnbGFzdF90aW1lJywgdGV4dDogJ1RpbWUgb2YgbGFzdCBkYXRhIHBvaW50JyB9LFxyXG4gICAgeyB2YWx1ZTogJ2xhc3RfdGltZV9ub25udWxsJywgdGV4dDogJ1RpbWUgb2YgbGFzdCBub24gbnVsbCBkYXRhIHBvaW50JyB9LFxyXG4gICAgeyB0ZXh0OiBcIlRvdGFsXCIsIHZhbHVlOiBcInRvdGFsXCIgfVxyXG5dO1xyXG5jb25zdCB0ZXh0QWxpZ25tZW50T3B0aW9ucyA9IFtcImxlZnRcIiwgXCJyaWdodFwiLCBcImNlbnRlclwiXTtcclxuY29uc3QgbXVsdGlWYWx1ZVNob3dQcmlvcml0aWVzID0gW1wiTWluaW11bVwiLCBcIk1heGltdW1cIl07XHJcbmNvbnN0IGNvbHVtblNvcnRUeXBlcyA9IFtcImFzY1wiLCBcImRlc2NcIl07XHJcbmNvbnN0IGNvbmZpZzogYW55ID0ge1xyXG4gICAgZGVidWdfbW9kZTogZmFsc2UsXHJcbiAgICBlcnJvcjogdW5kZWZpbmVkLFxyXG4gICAgZ3JvdXBlZERhdGE6IHVuZGVmaW5lZCxcclxuICAgIGhpZGVfZmlyc3RfY29sdW1uOiBmYWxzZSxcclxuICAgIGhpZGVfaGVhZGVyczogZmFsc2UsXHJcbiAgICBwYW5lbERlZmF1bHRzOiB7XHJcbiAgICAgICAgYWN0aXZlUGF0dGVybkluZGV4OiAtMSxcclxuICAgICAgICBkZWZhdWx0X3RpdGxlX2Zvcl9yb3dzOiBcIk1ldHJpY1wiLFxyXG4gICAgICAgIHBhdHRlcm5zOiBbXSxcclxuICAgICAgICByb3dfY29sX3dyYXBwZXI6IFwiX1wiLFxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIHBsdWdpbl9pZCxcclxuICAgIHZhbHVlX25hbWVfb3B0aW9ucyxcclxuICAgIHRleHRBbGlnbm1lbnRPcHRpb25zLFxyXG4gICAgY29sdW1uU29ydFR5cGVzLFxyXG4gICAgbXVsdGlWYWx1ZVNob3dQcmlvcml0aWVzLFxyXG4gICAgY29uZmlnXHJcbn07XHJcbiJdfQ==