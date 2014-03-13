/**
 * Created by 月飞 on 14-3-7.
 */
var grunt = require('grunt'),
    types = require('../lib/tagTypes');

exports.goCheck = function (fileContent) {
    var customObj = MatchCustom(fileContent);
    if(customObj){
        checkCustom(customObj);
    }else{
        grunt.log.writeln('未找到custom标签');
    }
};

//匹配_tms_custom函数
function MatchCustom(fileContent) {
    var reg = /_tms_custom\(([^)]+)\)/,
        matches = fileContent.match(reg);
    return matches && matches.splice(0, 1) && splitJson(matches[0]);
}

//筛选_tms_custom函数的两个参数
function splitJson(jsons) {
    var reg = /{[^}]+}/g,
        matches = jsons.match(reg),
        customTag={}, rules={};
    try {
        customTag = JSON.parse(matches[0]);
    } catch (e) {
        grunt.log.writeln('custom标签格式不规范');
    }
    try {
        matches[1]&&(rules = JSON.parse(matches[1]));
    } catch (e) {
        grunt.log.writeln('校验规则格式不规范');
    }
    return {customTag: customTag, rules: rules};
}

//校验custom标签
function checkCustom(customObj) {
    var custom = customObj.customTag,
        type = checkCustomType(custom.title);
    grunt.log.ok('开始校验custom标签');
    switch (type) {
        case '店铺':
            grunt.log.ok('坑位类型为:店铺');
            checkCustomFields(customObj, 'Shop');
            break;
        case '商品':
            grunt.log.ok('坑位类型为:商品');
            checkCustomFields(customObj, 'Item');
            break;
        default:
            grunt.log.ok('无法校验坑位类型，不执行fields校验');
            break;
    }
}

//校验custom标签坑位类型
function checkCustomType(title) {
    var reg = /^【([^】]+)】/,
        matches = title.match(reg);
    return matches && matches.splice(0, 1) && matches[0];
}

//校验custom的fields字段
function checkCustomFields(customObj, type) {
    var fields = customObj.customTag.fields,
        fieldArr = fields.split(','),
        reg = /^([^:]+)\:([^:]+)\:([^:]+)$/,
        imgRules = [],
        tag = type;
    grunt.util.recurse(fieldArr, function (item) {
        var isHas = false,
            matches = item.match(reg);
        if (matches) {
            types.Types[tag].forEach(function (i) {
                if (matches[1] === i) {
                    isHas = true;
                }
            });
            if (!isHas) {
                grunt.log.writeln(item + ' 该字段不在约定字段反馈内');
            }
            if (matches[3] === 'img') {
                imgRules.push(matches[1]);
            }
        } else {
            grunt.warn('字段不规范:' + item);
        }
    });
    grunt.log.ok('custom标签校验完成');
    checkRules(customObj.rules, imgRules);
}
//校验custom校验规则
function checkRules(rules, imgRuleKey) {
    var reg = /^([^:]+)\:([^,]+)$/,
        yunpanLinkReg = /^http:\/\/yunpan.alibaba-inc.com/,
        linkReg = /[?&]/;
    grunt.log.ok('开始校验规则配置');
    grunt.util.recurse(rules, function (item) {
        var keys = item.split(',');
        keys.forEach(function (item) {
            var matches = item.match(reg);
            if (matches) {
                if (matches[1] === 'linkUrlPsd' || matches[1] === 'linkUrlPreview') {
                    if (!yunpanLinkReg.test(matches[2])) {
                        grunt.log.writeln(matches[2] + ' 非淘云盘的链接，请确认外网可访问！');
                    } else if (linkReg.test(matches[2])) {
                        grunt.log.writeln(matches[2] + ' 链接包含有tms无法识别的?&字符，请去除！');
                    }
                }
            } else {
                grunt.log.writeln(item + ' 字段语法有问题,请排查');
            }
        });
    });
    imgRuleCheck(rules, imgRuleKey);
    grunt.log.ok('校验规则配置完成');
}
function imgRuleCheck(rules, ruleKey) {
    var reg = /^([^:]+)\:([^,]+)$/;
    ruleKey.forEach(function (key) {
        var keys, hasUrl = false;
        if (!rules[key]) {
            grunt.log.writeln(key + ':该字段未配置校验规则，图片应该有psd和预览图连接，请确认!');
        } else {
            keys = rules[key].split(',');
            keys.forEach(function (item) {
                var matches = item.match(reg);
                if (matches && (matches[1] === 'linkUrlPsd' || matches[1] === 'linkUrlPreview')) {
                    hasUrl = true;
                }
            });
            !hasUrl && grunt.log.writeln(key + ':该字段未配置psd或者预览图连接，请确认!');
        }
    })
}