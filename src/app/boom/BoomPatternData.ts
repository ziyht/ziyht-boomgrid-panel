import _ from "lodash";
import { IBoomPatternData } from "./index";
import { BoomSeries } from "./BoomSeries";
import { BoomPattern } from "./BoomPattern";

class BoomPatternData implements IBoomPatternData {
    public series: BoomSeries[] = [];
    public pattern: BoomPattern;
    constructor(pattern: BoomPattern) {
        this.pattern = pattern;
    }

    public addSeries(series: BoomSeries) {
        this.series.push(series);
    }
}

export {
    BoomPatternData,
};
