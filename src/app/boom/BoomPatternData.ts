import _ from "lodash";
import TimeSeries from "app/core/time_series2";
import { IBoomPatternData } from "./index";
import { BoomSeries } from "./BoomSeries";
import { BoomPattern } from "./BoomPattern";
import { IBoomJoinMeta, IBoomJoinSeries } from "./Boom.interface";


class BoomPatternData implements IBoomPatternData {
    public boomSeries: BoomSeries[] = [];
    public joinSeries: IBoomJoinSeries[] = [];
    public joinMetas: IBoomJoinMeta[] = [];
    public joinMetasDiscarded: IBoomJoinMeta[] = [];
    public joinMetasMains:     IBoomJoinMeta[] = [];
    public joinMetasToJoins: {[key: string]: IBoomJoinMeta} = {};
    public joinbyOptions: {}[] = [{'value': '-1', 'text': '-1'}];
    public joinSampleValues = "";
    public inputs: any[] = [];
    public pattern: BoomPattern;
    public ctrl: any;
    public panel: any;
    constructor(pattern: BoomPattern, ctrl: any) {
        this.pattern = pattern;
        this.ctrl    = ctrl;
        this.panel   = ctrl.panel;
    }

    public addInput(input: any){
        this.inputs.push(input);
    }

    public joinData(){

        // prepare join metas
        let joinMetas: IBoomJoinMeta[] = [];
        let mincnt = 100;
        let minmeta: IBoomJoinMeta | undefined;
        _.each(this.inputs, input => {
            let series     = new TimeSeries({
                alias: input.target,
                datapoints: input.datapoints || []
            });
            series.flotpairs        = series.getFlotPairs("connected");

            let jmeta: IBoomJoinMeta = {
                alias: series.alias,
                dataPoints: series.dataPoints,
                err: "",
                key: "",
                splits: series.alias.split(this.pattern.delimiter || "."),
                stats: series.stats,
                value: this._getValueForMeta(series),
            };
            jmeta.splits.push(jmeta.value);
            joinMetas.push(jmeta);
            if (mincnt > jmeta.splits.length){
                mincnt = jmeta.splits.length;
                minmeta = jmeta;
            }
            // console.log(jmeta);
        });
        this.joinMetas = joinMetas;
        this.joinbyOptions.splice(0, this.joinbyOptions.length, {'value': '-1', 'text': 'off'});
        if (minmeta !== undefined){
            for (let i = 0; i < mincnt; i++){
                this.joinbyOptions.push({ 'value': '' + i, 'text': ''+ i + '(' + minmeta!.splits[i] + ')'});
            }
        }

        // validate config
        let main = "";
        let join = "";
        let joinby = -1;
        if (this.pattern.data_joins !== undefined){
            main = this.pattern.data_joins.main;
            join = this.pattern.data_joins.join;
            joinby = Number(this.pattern.data_joins.joinby);
        }
        if (isNaN(joinby)){
            joinby = -1;
        }
        if (joinby >= mincnt){
            console.log("joinby '" + joinby + "' exceeded min cnt '" + mincnt + "' of all metrics splits");
            joinby = -1;
        }

        // classify now
        let mains: IBoomJoinMeta[] = [];
        let tojoins: {[key: string]: IBoomJoinMeta} = {};
        let discarded: IBoomJoinMeta[] = [];
        let joinArrs: IBoomJoinMeta[][] = [];
        if (main === "" || join === "" || joinby < 0) {
            _.each(this.joinMetas, meta => {
                joinArrs.push([meta]);
            });
        } else {
            _.each(this.joinMetas, (meta: IBoomJoinMeta) => {
                meta.key = meta.splits[joinby];
                if (meta.alias.match(main)){
                    mains.push(meta);
                } else if (meta.alias.match(join)){
                    if ( tojoins[meta.key] !== undefined ) {
                        meta.err = "key " + meta.key + "already exist in tojoins";
                    } else {
                        tojoins[meta.key] = meta;
                    }
                } else {
                    meta.err = "alias not match '" + main + "' and '" + join + "'";
                }

                if (meta.err !== ""){
                    discarded.push(meta);
                }
            });

            _.each(mains, (meta1: IBoomJoinMeta) => {
                let meta2: IBoomJoinMeta = tojoins[meta1.key];

                if (meta2 === undefined){
                    meta1.err = "can not found match metric for key '" + meta1.key + "' in tojoins";
                    discarded.push(meta1);
                    return;
                }

                joinArrs.push([meta1, meta2]);
            });
        }
        this.joinMetasMains = mains;
        this.joinMetasToJoins = tojoins;
        this.joinMetasDiscarded = discarded;

        // join data
        _.each(joinArrs, (arr: IBoomJoinMeta[]) => {
            if (arr.length === 1){
                let jmeta = arr[0];
                let jseries: IBoomJoinSeries = {
                    alias: jmeta.alias,
                    metas: arr,
                    splits: jmeta.splits,
                };
                this.joinSeries.push(jseries);
                // console.log(jseries);
            } else {
                let jmeta = arr[0];
                let jseries: IBoomJoinSeries = {
                    alias: jmeta.alias,
                    metas: arr,
                    splits: arr[0].splits.concat(arr[1].splits),
                };
                this.joinSeries.push(jseries);
                // console.log(jseries);
            }
        });

        if (this.joinSeries.length > 0){
            this.joinSampleValues.slice(0, this.joinSampleValues.length);
            let wrapper = this.panel.row_col_wrapper || '_';
            let splits: string[] = this.joinSeries[0].splits;
            let vals: string[] = [];
            for (let i = 0; i < splits.length; i++){
                vals.push(wrapper + i + wrapper + ":" + splits[i]);
            }
            this.joinSampleValues = vals.join(", ");
        }
    }

    public genBoomSeries(){
        // tslint:disable-next-line: no-shadowed-variable
        this.boomSeries = this.joinSeries.map(input => {
            let seriesOptions = {
              debug_mode:       this.panel.debug_mode,
              row_col_wrapper:  this.panel.row_col_wrapper || "_"
            };
            return new BoomSeries(input, this.panel, this.pattern, seriesOptions, this.ctrl.templateSrv, this.ctrl.timeSrv);
        });
    }

    private _getValueForMeta(tSeries: any): any{
        let value = null;
        if (tSeries.stats) {
            if (this.pattern.valueName === "last_time") {
                if (_.last(tSeries.datapoints)) {
                    value = _.last(tSeries.datapoints)[1];
                }
            } else if (this.pattern.valueName === "last_time_nonnull") {
                let non_null_data = tSeries.datapoints.filter(s => s[0]);
                if (_.last(non_null_data) && _.last(non_null_data)[1]) {
                    value = _.last(non_null_data)[1];
                }
            } else {
                value = tSeries.stats[this.pattern.valueName];
            }
        }
        return value;
    }
}

export {
    BoomPatternData,
};
