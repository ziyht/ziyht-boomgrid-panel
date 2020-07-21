import _ from "lodash";
import { IBoomPatternData } from "./index";
import { BoomSeries } from "./BoomSeries";
import { BoomPattern } from "./BoomPattern";
import { IBoomFixedRow, IBoomFixedCol } from "./Boom.interface";

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

class BoomPatternDatas {
    public patterns: {[key: number]: BoomPatternData} = {};
    public registerPatterns(default_: BoomPattern, customs: BoomPattern[]){
        this.patterns = {};
        default_.id = -1;
        this.registerPattern(default_);
        let id = 0;
        _.each(customs, (pt: BoomPattern) => {
          pt.id = id;
          this.registerPattern(pt);
          id += 1;
        });
    }
    public registerPattern(pattern: BoomPattern): BoomPatternData {
        let data = this.patterns[pattern.id];
        if ( data === undefined ){
            data = new BoomPatternData(pattern);
            this.patterns[pattern.id] = data;
        }
        return data;
    }
    public getPattern(idx: number): BoomPattern{
        return this.patterns[idx].pattern;
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
            let pattern = data.pattern;
            if (pattern.col_name_as_fixed_row === true){
                if (pattern.col_name !== ""){
                    ret.push(pattern.col_name);
                }
            }
            _.each(pattern.fixed_cols, (col: IBoomFixedCol) => {
                if (col.name !== ""){
                    ret.push(col.name);
                }
            });
        });
        ret = _.uniq(ret, item => item);
        return ret;
    }
}

export {
    BoomPatternData,
    BoomPatternDatas
};
