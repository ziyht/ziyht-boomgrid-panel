System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, normalizeColor, parseMathExpression, getColor, replaceTokens, getActualNameWithoutTokens, getDecimalsForValue, getItemBasedOnThreshold, boomSortFunc;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            normalizeColor = function (color) {
                if (color.toLowerCase() === "green") {
                    return "rgba(50, 172, 45, 0.97)";
                }
                else if (color.toLowerCase() === "orange") {
                    return "rgba(237, 129, 40, 0.89)";
                }
                else if (color.toLowerCase() === "red") {
                    return "rgba(245, 54, 54, 0.9)";
                }
                else {
                    return color.toLowerCase();
                }
            };
            exports_1("normalizeColor", normalizeColor);
            parseMathExpression = function (expression, index) {
                var valuestring = expression.replace(/\_/g, "").split(",")[index];
                var returnvalue = 0;
                if (valuestring.indexOf("+") > -1) {
                    returnvalue = +(valuestring.split("+")[0]) + +(valuestring.split("+")[1]);
                }
                else if (valuestring.indexOf("-") > -1) {
                    returnvalue = +(valuestring.split("-")[0]) - +(valuestring.split("-")[1]);
                }
                else if (valuestring.indexOf("*") > -1) {
                    returnvalue = +(valuestring.split("*")[0]) * +(valuestring.split("*")[1]);
                }
                else if (valuestring.indexOf("/") > -1) {
                    returnvalue = +(valuestring.split("/")[0]) / +(valuestring.split("/")[1]);
                }
                else if (valuestring.indexOf("min") > -1) {
                    returnvalue = lodash_1.default.min([+(valuestring.split("min")[0]), +(valuestring.split("min")[1])]) || 0;
                }
                else if (valuestring.indexOf("max") > -1) {
                    returnvalue = lodash_1.default.max([+(valuestring.split("max")[0]), +(valuestring.split("max")[1])]) || 0;
                }
                else if (valuestring.indexOf("mean") > -1) {
                    returnvalue = lodash_1.default.mean([+(valuestring.split("avg")[0]), +(valuestring.split("avg")[1])]) || 0;
                }
                else {
                    returnvalue = +(valuestring);
                }
                return Math.round(+(returnvalue));
            };
            getColor = function (expression, index) {
                var returnValue = (expression || "").split(",").length > index ? " style=\"color:" + normalizeColor(expression.replace(/\_/g, "").split(",")[index]) + "\" " : "";
                return returnValue;
            };
            replaceTokens = function (value) {
                if (!value) {
                    return value;
                }
                value = value + "";
                value = value.split(" ").map(function (a) {
                    if (a.startsWith("_fa-") && a.endsWith("_")) {
                        var returnvalue = "";
                        var icon = a.replace(/\_/g, "").split(",")[0];
                        var color = getColor(a, 1);
                        var repeatCount = a.split(",").length >= 3 ? parseMathExpression(a, 2) : 1;
                        returnvalue = ("<i class=\"fa " + icon + "\" " + color + "></i> ").repeat(repeatCount);
                        if (a.split(",").length >= 4) {
                            var maxColor = getColor(a, 3);
                            var maxLength = a.split(",").length >= 5 ? parseMathExpression(a, 4) : 0;
                            returnvalue += ("<i class=\"fa " + icon + "\" " + maxColor + "></i> ").repeat(lodash_1.default.max([maxLength - repeatCount, 0]) || 0);
                        }
                        return returnvalue;
                    }
                    else if (a.startsWith("_img-") && a.endsWith("_")) {
                        a = a.slice(0, -1);
                        var imgUrl = a.replace("_img-", "").split(",")[0];
                        var imgWidth = a.split(",").length > 1 ? a.replace("_img-", "").split(",")[1] : "20px";
                        var imgHeight = a.split(",").length > 2 ? a.replace("_img-", "").split(",")[2] : "20px";
                        var repeatCount = a.split(",").length > 3 ? +(a.replace("_img-", "").split(",")[3]) : 1;
                        a = ("<img width=\"" + imgWidth + "\" height=\"" + imgHeight + "\" src=\"" + imgUrl + "\"/>").repeat(repeatCount);
                    }
                    return a;
                }).join(" ");
                return value;
            };
            exports_1("replaceTokens", replaceTokens);
            getActualNameWithoutTokens = function (value) {
                if (!value) {
                    return value + "";
                }
                value = value + "";
                return value.split(" ").map(function (a) {
                    if (a.startsWith("_fa-") && a.endsWith("_")) {
                        a = "";
                    }
                    else if (a.startsWith("_img-") && a.endsWith("_")) {
                        a = "";
                    }
                    return a;
                }).join(" ");
            };
            exports_1("getActualNameWithoutTokens", getActualNameWithoutTokens);
            getDecimalsForValue = function (value, _decimals) {
                if (lodash_1.default.isNumber(+_decimals)) {
                    var o = {
                        decimals: _decimals,
                        scaledDecimals: null
                    };
                    return o;
                }
                var delta = value / 2;
                var dec = -Math.floor(Math.log(delta) / Math.LN10);
                var magn = Math.pow(10, -dec), norm = delta / magn, size;
                if (norm < 1.5) {
                    size = 1;
                }
                else if (norm < 3) {
                    size = 2;
                    if (norm > 2.25) {
                        size = 2.5;
                        ++dec;
                    }
                }
                else if (norm < 7.5) {
                    size = 5;
                }
                else {
                    size = 10;
                }
                size *= magn;
                if (Math.floor(value) === value) {
                    dec = 0;
                }
                var result = {
                    decimals: Math.max(0, dec),
                    scaledDecimals: Math.max(0, dec) - Math.floor(Math.log(size) / Math.LN10) + 2
                };
                return result;
            };
            exports_1("getDecimalsForValue", getDecimalsForValue);
            getItemBasedOnThreshold = function (thresholds, ranges, value, defaultValue) {
                var c = {
                    "index": -1,
                    "value": defaultValue,
                };
                if (thresholds && ranges && typeof value === "number" && thresholds.length + 1 <= ranges.length) {
                    ranges = lodash_1.default.dropRight(ranges, ranges.length - thresholds.length - 1);
                    if (ranges[ranges.length - 1] === "") {
                        ranges[ranges.length - 1] = defaultValue;
                    }
                    for (var i = thresholds.length; i > 0; i--) {
                        if (value >= thresholds[i - 1]) {
                            return {
                                "index": i,
                                "value": ranges[i],
                            };
                        }
                    }
                    c.index = 0;
                    c.value = lodash_1.default.first(ranges) || "";
                }
                return c;
            };
            exports_1("getItemBasedOnThreshold", getItemBasedOnThreshold);
            boomSortFunc = function (a, b, sortMethod) {
                var na = Number(a);
                var nb = Number(b);
                var iv = sortMethod === "asc" ? 1 : -1;
                if (isNaN(na)) {
                    if (isNaN(nb)) {
                        return a > b ? iv : -iv;
                    }
                    else {
                        return -iv;
                    }
                }
                else if (isNaN(nb)) {
                    return iv;
                }
                else {
                    return iv * (na - nb);
                }
            };
            exports_1("boomSortFunc", boomSortFunc);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9ib29tL0Jvb21VdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztZQUVNLGNBQWMsR0FBRyxVQUFVLEtBQUs7Z0JBQ2xDLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLE9BQU8sRUFBRTtvQkFDakMsT0FBTyx5QkFBeUIsQ0FBQztpQkFDcEM7cUJBQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxFQUFFO29CQUN6QyxPQUFPLDBCQUEwQixDQUFDO2lCQUNyQztxQkFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLEVBQUU7b0JBQ3RDLE9BQU8sd0JBQXdCLENBQUM7aUJBQ25DO3FCQUFNO29CQUFFLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUFFO1lBQzFDLENBQUMsQ0FBQzs7WUFDSSxtQkFBbUIsR0FBRyxVQUFVLFVBQVUsRUFBRSxLQUFLO2dCQUNuRCxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xFLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUMvQixXQUFXLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM3RTtxQkFBTSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxD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QyxFQUFFOzRCQUM1QixPQUFPO2dDQUNILE9BQU8sRUFBRSxDQUFDO2dDQUNWLE9BQU8sRUFBRyxNQUFNLENBQUMsQ0FBQyxDQUFDOzZCQUN0QixDQUFDO3lCQUNMO3FCQUNKO29CQUNELENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNaLENBQUMsQ0FBQyxLQUFLLEdBQUcsZ0JBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNuQztnQkFDRCxPQUFPLENBQUMsQ0FBQztZQUViLENBQUMsQ0FBQzs7WUFDSSxZQUFZLEdBQUcsVUFBVSxDQUFnQixFQUFFLENBQWdCLEVBQUUsVUFBa0I7Z0JBQ2pGLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLEVBQUUsR0FBRyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDWixJQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRTt3QkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7cUJBQzNCO3lCQUFNO3dCQUNILE9BQU8sQ0FBQyxFQUFFLENBQUM7cUJBQ2Q7aUJBQ0o7cUJBQU0sSUFBSyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ25CLE9BQU8sRUFBRSxDQUFDO2lCQUNiO3FCQUFNO29CQUNILE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUN6QjtZQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PT0gXCJncmVlblwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiYSg1MCwgMTcyLCA0NSwgMC45NylcIjtcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PT0gXCJvcmFuZ2VcIikge1xyXG4gICAgICAgIHJldHVybiBcInJnYmEoMjM3LCAxMjksIDQwLCAwLjg5KVwiO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09PSBcInJlZFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicmdiYSgyNDUsIDU0LCA1NCwgMC45KVwiO1xyXG4gICAgfSBlbHNlIHsgcmV0dXJuIGNvbG9yLnRvTG93ZXJDYXNlKCk7IH1cclxufTtcclxuY29uc3QgcGFyc2VNYXRoRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChleHByZXNzaW9uLCBpbmRleCk6IG51bWJlciB7XHJcbiAgICBsZXQgdmFsdWVzdHJpbmcgPSBleHByZXNzaW9uLnJlcGxhY2UoL1xcXy9nLCBcIlwiKS5zcGxpdChcIixcIilbaW5kZXhdO1xyXG4gICAgbGV0IHJldHVybnZhbHVlID0gMDtcclxuICAgIGlmICh2YWx1ZXN0cmluZy5pbmRleE9mKFwiK1wiKSA+IC0xKSB7XHJcbiAgICAgICAgcmV0dXJudmFsdWUgPSArKHZhbHVlc3RyaW5nLnNwbGl0KFwiK1wiKVswXSkgKyArKHZhbHVlc3RyaW5nLnNwbGl0KFwiK1wiKVsxXSk7XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlc3RyaW5nLmluZGV4T2YoXCItXCIpID4gLTEpIHtcclxuICAgICAgICByZXR1cm52YWx1ZSA9ICsodmFsdWVzdHJpbmcuc3BsaXQoXCItXCIpWzBdKSAtICsodmFsdWVzdHJpbmcuc3BsaXQoXCItXCIpWzFdKTtcclxuICAgIH0gZWxzZSBpZiAodmFsdWVzdHJpbmcuaW5kZXhPZihcIipcIikgPiAtMSkge1xyXG4gICAgICAgIHJldHVybnZhbHVlID0gKyh2YWx1ZXN0cmluZy5zcGxpdChcIipcIilbMF0pICogKyh2YWx1ZXN0cmluZy5zcGxpdChcIipcIilbMV0pO1xyXG4gICAgfSBlbHNlIGlmICh2YWx1ZXN0cmluZy5pbmRleE9mKFwiL1wiKSA+IC0xKSB7XHJcbiAgICAgICAgcmV0dXJudmFsdWUgPSArKHZhbHVlc3RyaW5nLnNwbGl0KFwiL1wiKVswXSkgLyArKHZhbHVlc3RyaW5nLnNwbGl0KFwiL1wiKVsxXSk7XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlc3RyaW5nLmluZGV4T2YoXCJtaW5cIikgPiAtMSkge1xyXG4gICAgICAgIHJldHVybnZhbHVlID0gXy5taW4oWysodmFsdWVzdHJpbmcuc3BsaXQoXCJtaW5cIilbMF0pLCArKHZhbHVlc3RyaW5nLnNwbGl0KFwibWluXCIpWzFdKV0pIHx8IDA7XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlc3RyaW5nLmluZGV4T2YoXCJtYXhcIikgPiAtMSkge1xyXG4gICAgICAgIHJldHVybnZhbHVlID0gXy5tYXgoWysodmFsdWVzdHJpbmcuc3BsaXQoXCJtYXhcIilbMF0pLCArKHZhbHVlc3RyaW5nLnNwbGl0KFwibWF4XCIpWzFdKV0pIHx8IDA7XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlc3RyaW5nLmluZGV4T2YoXCJtZWFuXCIpID4gLTEpIHtcclxuICAgICAgICByZXR1cm52YWx1ZSA9IF8ubWVhbihbKyh2YWx1ZXN0cmluZy5zcGxpdChcImF2Z1wiKVswXSksICsodmFsdWVzdHJpbmcuc3BsaXQoXCJhdmdcIilbMV0pXSkgfHwgMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJudmFsdWUgPSArKHZhbHVlc3RyaW5nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBNYXRoLnJvdW5kKCsocmV0dXJudmFsdWUpKTtcclxufTtcclxuY29uc3QgZ2V0Q29sb3IgPSBmdW5jdGlvbiAoZXhwcmVzc2lvbiwgaW5kZXgpIHtcclxuICAgIGxldCByZXR1cm5WYWx1ZSA9IChleHByZXNzaW9uIHx8IFwiXCIpLnNwbGl0KFwiLFwiKS5sZW5ndGggPiBpbmRleCA/IGAgc3R5bGU9XCJjb2xvcjoke25vcm1hbGl6ZUNvbG9yKGV4cHJlc3Npb24ucmVwbGFjZSgvXFxfL2csIFwiXCIpLnNwbGl0KFwiLFwiKVtpbmRleF0pfVwiIGAgOiBcIlwiO1xyXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG59O1xyXG5jb25zdCByZXBsYWNlVG9rZW5zID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICBpZiAoIXZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfVxyXG4gICAgdmFsdWUgPSB2YWx1ZSArIFwiXCI7XHJcbiAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KFwiIFwiKS5tYXAoYSA9PiB7XHJcbiAgICAgICAgaWYgKGEuc3RhcnRzV2l0aChcIl9mYS1cIikgJiYgYS5lbmRzV2l0aChcIl9cIikpIHtcclxuICAgICAgICAgICAgbGV0IHJldHVybnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGljb24gPSBhLnJlcGxhY2UoL1xcXy9nLCBcIlwiKS5zcGxpdChcIixcIilbMF07XHJcbiAgICAgICAgICAgIGxldCBjb2xvciA9IGdldENvbG9yKGEsIDEpO1xyXG4gICAgICAgICAgICBsZXQgcmVwZWF0Q291bnQgPSBhLnNwbGl0KFwiLFwiKS5sZW5ndGggPj0gMyA/IHBhcnNlTWF0aEV4cHJlc3Npb24oYSwgMikgOiAxO1xyXG4gICAgICAgICAgICByZXR1cm52YWx1ZSA9IGA8aSBjbGFzcz1cImZhICR7aWNvbn1cIiAke2NvbG9yfT48L2k+IGAucmVwZWF0KHJlcGVhdENvdW50KTtcclxuICAgICAgICAgICAgaWYgKGEuc3BsaXQoXCIsXCIpLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF4Q29sb3IgPSBnZXRDb2xvcihhLCAzKTtcclxuICAgICAgICAgICAgICAgIGxldCBtYXhMZW5ndGggPSBhLnNwbGl0KFwiLFwiKS5sZW5ndGggPj0gNSA/IHBhcnNlTWF0aEV4cHJlc3Npb24oYSwgNCkgOiAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJudmFsdWUgKz0gYDxpIGNsYXNzPVwiZmEgJHtpY29ufVwiICR7bWF4Q29sb3J9PjwvaT4gYC5yZXBlYXQoXy5tYXgoW21heExlbmd0aCAtIHJlcGVhdENvdW50LCAwXSkgfHwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldHVybnZhbHVlO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGEuc3RhcnRzV2l0aChcIl9pbWctXCIpICYmIGEuZW5kc1dpdGgoXCJfXCIpKSB7XHJcbiAgICAgICAgICAgIGEgPSBhLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICAgICAgbGV0IGltZ1VybCA9IGEucmVwbGFjZShcIl9pbWctXCIsIFwiXCIpLnNwbGl0KFwiLFwiKVswXTtcclxuICAgICAgICAgICAgbGV0IGltZ1dpZHRoID0gYS5zcGxpdChcIixcIikubGVuZ3RoID4gMSA/IGEucmVwbGFjZShcIl9pbWctXCIsIFwiXCIpLnNwbGl0KFwiLFwiKVsxXSA6IFwiMjBweFwiO1xyXG4gICAgICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gYS5zcGxpdChcIixcIikubGVuZ3RoID4gMiA/IGEucmVwbGFjZShcIl9pbWctXCIsIFwiXCIpLnNwbGl0KFwiLFwiKVsyXSA6IFwiMjBweFwiO1xyXG4gICAgICAgICAgICBsZXQgcmVwZWF0Q291bnQgPSBhLnNwbGl0KFwiLFwiKS5sZW5ndGggPiAzID8gKyhhLnJlcGxhY2UoXCJfaW1nLVwiLCBcIlwiKS5zcGxpdChcIixcIilbM10pIDogMTtcclxuICAgICAgICAgICAgYSA9IGA8aW1nIHdpZHRoPVwiJHtpbWdXaWR0aH1cIiBoZWlnaHQ9XCIke2ltZ0hlaWdodH1cIiBzcmM9XCIke2ltZ1VybH1cIi8+YC5yZXBlYXQocmVwZWF0Q291bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH0pLmpvaW4oXCIgXCIpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59O1xyXG5jb25zdCBnZXRBY3R1YWxOYW1lV2l0aG91dFRva2VucyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgeyByZXR1cm4gdmFsdWUgKyBcIlwiOyB9XHJcbiAgICB2YWx1ZSA9IHZhbHVlICsgXCJcIjtcclxuICAgIHJldHVybiB2YWx1ZS5zcGxpdChcIiBcIikubWFwKGEgPT4ge1xyXG4gICAgICAgIGlmIChhLnN0YXJ0c1dpdGgoXCJfZmEtXCIpICYmIGEuZW5kc1dpdGgoXCJfXCIpKSB7XHJcbiAgICAgICAgICAgIGEgPSBgYDtcclxuICAgICAgICB9IGVsc2UgaWYgKGEuc3RhcnRzV2l0aChcIl9pbWctXCIpICYmIGEuZW5kc1dpdGgoXCJfXCIpKSB7XHJcbiAgICAgICAgICAgIGEgPSBgYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9KS5qb2luKFwiIFwiKTtcclxufTtcclxuY29uc3QgZ2V0RGVjaW1hbHNGb3JWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgX2RlY2ltYWxzKSB7XHJcbiAgICBpZiAoXy5pc051bWJlcigrX2RlY2ltYWxzKSkge1xyXG4gICAgICAgIGxldCBvOiBPYmplY3QgPSB7XHJcbiAgICAgICAgICAgIGRlY2ltYWxzOiBfZGVjaW1hbHMsXHJcbiAgICAgICAgICAgIHNjYWxlZERlY2ltYWxzOiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGVsdGEgPSB2YWx1ZSAvIDI7XHJcbiAgICBsZXQgZGVjID0gLU1hdGguZmxvb3IoTWF0aC5sb2coZGVsdGEpIC8gTWF0aC5MTjEwKTtcclxuXHJcbiAgICBsZXQgbWFnbiA9IE1hdGgucG93KDEwLCAtZGVjKSxcclxuICAgICAgICBub3JtID0gZGVsdGEgLyBtYWduLCAvLyBub3JtIGlzIGJldHdlZW4gMS4wIGFuZCAxMC4wXHJcbiAgICAgICAgc2l6ZTtcclxuXHJcbiAgICBpZiAobm9ybSA8IDEuNSkge1xyXG4gICAgICAgIHNpemUgPSAxO1xyXG4gICAgfSBlbHNlIGlmIChub3JtIDwgMykge1xyXG4gICAgICAgIHNpemUgPSAyO1xyXG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgMi41LCByZXF1aXJlcyBhbiBleHRyYSBkZWNpbWFsXHJcbiAgICAgICAgaWYgKG5vcm0gPiAyLjI1KSB7XHJcbiAgICAgICAgICAgIHNpemUgPSAyLjU7XHJcbiAgICAgICAgICAgICsrZGVjO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobm9ybSA8IDcuNSkge1xyXG4gICAgICAgIHNpemUgPSA1O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzaXplID0gMTA7XHJcbiAgICB9XHJcblxyXG4gICAgc2l6ZSAqPSBtYWduO1xyXG5cclxuICAgIC8vIHJlZHVjZSBzdGFydGluZyBkZWNpbWFscyBpZiBub3QgbmVlZGVkXHJcbiAgICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgZGVjID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0OiBPYmplY3QgPSB7XHJcbiAgICAgICAgZGVjaW1hbHM6IE1hdGgubWF4KDAsIGRlYyksXHJcbiAgICAgICAgc2NhbGVkRGVjaW1hbHM6IE1hdGgubWF4KDAsIGRlYykgLSBNYXRoLmZsb29yKE1hdGgubG9nKHNpemUpIC8gTWF0aC5MTjEwKSArIDJcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuY29uc3QgZ2V0SXRlbUJhc2VkT25UaHJlc2hvbGQgPSBmdW5jdGlvbiAodGhyZXNob2xkcywgcmFuZ2VzLCB2YWx1ZSwgZGVmYXVsdFZhbHVlKToge1trZXk6IHN0cmluZ106IGFueX0ge1xyXG4gICAgbGV0IGMgPSB7XHJcbiAgICAgICAgXCJpbmRleFwiOiAtMSxcclxuICAgICAgICBcInZhbHVlXCI6IGRlZmF1bHRWYWx1ZSxcclxuICAgIH0gO1xyXG4gICAgaWYgKHRocmVzaG9sZHMgJiYgcmFuZ2VzICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiAmJiB0aHJlc2hvbGRzLmxlbmd0aCArIDEgPD0gcmFuZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgIHJhbmdlcyA9IF8uZHJvcFJpZ2h0KHJhbmdlcywgcmFuZ2VzLmxlbmd0aCAtIHRocmVzaG9sZHMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgaWYgKHJhbmdlc1tyYW5nZXMubGVuZ3RoIC0gMV0gPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmFuZ2VzW3Jhbmdlcy5sZW5ndGggLSAxXSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRocmVzaG9sZHMubGVuZ3RoOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA+PSB0aHJlc2hvbGRzW2kgLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBcImluZGV4XCI6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAgcmFuZ2VzW2ldLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjLmluZGV4ID0gMDtcclxuICAgICAgICBjLnZhbHVlID0gXy5maXJzdChyYW5nZXMpIHx8IFwiXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYztcclxuXHJcbn07XHJcbmNvbnN0IGJvb21Tb3J0RnVuYyA9IGZ1bmN0aW9uIChhOiBzdHJpbmd8bnVtYmVyLCBiOiBzdHJpbmd8bnVtYmVyLCBzb3J0TWV0aG9kOiBzdHJpbmcpIHtcclxuICAgIGxldCBuYSA9IE51bWJlcihhKTtcclxuICAgIGxldCBuYiA9IE51bWJlcihiKTtcclxuICAgIGxldCBpdiA9IHNvcnRNZXRob2QgPT09IFwiYXNjXCIgPyAxIDogLTE7XHJcbiAgICBpZiAoIGlzTmFOKG5hKSApe1xyXG4gICAgICAgIGlmICggaXNOYU4obmIpICl7XHJcbiAgICAgICAgICAgIHJldHVybiBhID4gYiA/IGl2IDogLWl2O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtaXY7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICggaXNOYU4obmIpICl7XHJcbiAgICAgICAgcmV0dXJuIGl2O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gaXYgKiAobmEgLSBuYik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IHtcclxuICAgIG5vcm1hbGl6ZUNvbG9yLFxyXG4gICAgcmVwbGFjZVRva2VucyxcclxuICAgIGdldEFjdHVhbE5hbWVXaXRob3V0VG9rZW5zLFxyXG4gICAgZ2V0RGVjaW1hbHNGb3JWYWx1ZSxcclxuICAgIGdldEl0ZW1CYXNlZE9uVGhyZXNob2xkLFxyXG4gICAgYm9vbVNvcnRGdW5jXHJcbn07XHJcbiJdfQ==