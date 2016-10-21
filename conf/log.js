var path = require("path");
var log4js = require("log4js");


/**
 * 日志配置
 */
exports.configure = function() {
    log4js.configure(path.join(__dirname, "./log4js.json"));    
}

/**
 * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *              如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 */
exports.logger = function(name) {
    var dateFileLog = log4js.getLogger(name);
    //log4js共有6种日志级别，分别为：trace、debug、info、warn、error、fatal。权值从小到大，其初始化代码为：
    dateFileLog.setLevel(log4js.levels.INFO);
    return dateFileLog;
}

/**
 * 用于express中间件，调用该方法前必须确保已经configure过
 * @returns {Function|*}
 */
exports.useLog = function() {
    return log4js.connectLogger(log4js.getLogger("app"), {level: log4js.levels.ERROR});
} 