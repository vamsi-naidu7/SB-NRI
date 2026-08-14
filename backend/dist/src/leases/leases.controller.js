"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeasesController = void 0;
const common_1 = require("@nestjs/common");
const leases_service_1 = require("./leases.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let LeasesController = class LeasesController {
    leasesService;
    constructor(leasesService) {
        this.leasesService = leasesService;
    }
    create(body, req) {
        return this.leasesService.requestLease(body.propertyId, req.user.id, body);
    }
    recordPayment(id, body, req) {
        return this.leasesService.recordPayment(id, body.amount, req.user.id, req.user.roles);
    }
    updateStatus(id, body, req) {
        return this.leasesService.updateStatus(id, body.status, req.user.id, req.user.roles);
    }
    findAll(req) {
        return this.leasesService.findAll(req.user.id, req.user.roles);
    }
    findOne(id) {
        return this.leasesService.findOne(id);
    }
};
exports.LeasesController = LeasesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/payment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "findOne", null);
exports.LeasesController = LeasesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/v1/leases'),
    __metadata("design:paramtypes", [leases_service_1.LeasesService])
], LeasesController);
//# sourceMappingURL=leases.controller.js.map