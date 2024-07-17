"use strict";
var catchAsync = function (fn) { return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(function (err) { return next(err); });
}; };
module.exports = catchAsync;
//# sourceMappingURL=catchAsync.js.map