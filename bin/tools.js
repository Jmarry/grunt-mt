/**
 * Created by 月飞 on 14-3-7.
 */
exports.checkFileType=function(filename){
    var reg=/[^.]*[.]([^\s]+)/,
        matches=filename.match(reg);
    return matches&&matches[1];
};