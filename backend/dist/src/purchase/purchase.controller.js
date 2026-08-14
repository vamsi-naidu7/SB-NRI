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
exports.PurchaseController = void 0;
const common_1 = require("@nestjs/common");
const purchase_service_1 = require("./purchase.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let PurchaseController = class PurchaseController {
    purchaseService;
    constructor(purchaseService) {
        this.purchaseService = purchaseService;
    }
    submitDecision(body, req) {
        return this.purchaseService.submitPurchaseDecision(body.propertyId, body.decision, req.user.id);
    }
    assignCA(id, body, req) {
        return this.purchaseService.assignCA(id, body.caId, req.user.id, req.user.roles);
    }
    submitCAFindings(id, body, req) {
        return this.purchaseService.submitCAFindings(id, req.user.id, body.findings);
    }
};
exports.PurchaseController = PurchaseController;
__decorate([
    (0, common_1.Post)('decision'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseController.prototype, "submitDecision", null);
__decorate([
    (0, common_1.Post)(':id/assign-ca'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseController.prototype, "assignCA", null);
__decorate([
    (0, common_1.Post)(':id/ca-findings'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseController.prototype, "submitCAFindings", null);
exports.PurchaseController = PurchaseController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/v1/purchase'),
    __metadata("design:paramtypes", [purchase_service_1.PurchaseService])
], PurchaseController);
//# sourceMappingURL=purchase.controller.js.map