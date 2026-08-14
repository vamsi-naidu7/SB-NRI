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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PropertiesService = class PropertiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProperty(data, user) {
        const isAgent = user.roles.includes('AGENT');
        const source = isAgent ? client_1.PropertySource.LISTED_PROPERTY : client_1.PropertySource.EXTERNAL_PROPERTY;
        return this.prisma.property.create({
            data: {
                title: data.title,
                type: data.type,
                source,
                price: data.price,
                address: data.address,
                area: data.area,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                description: data.description,
                agentId: isAgent ? user.id : null,
                ownerId: !isAgent && user.roles.includes('NRI') ? user.id : null,
            }
        });
    }
    async findAll(filters) {
        return this.prisma.property.findMany({
            where: {
                type: filters.type ? filters.type : undefined,
            }
        });
    }
    async findOne(id, user) {
        const property = await this.prisma.property.findUnique({
            where: { id },
            include: {
                owner: true,
                agent: true,
                rm: true,
            }
        });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        if (user.roles.includes('ADMIN') || user.roles.includes('RELATIONSHIP_MANAGER')) {
            return property;
        }
        if (user.roles.includes('NRI') && property.ownerId === user.id) {
            return property;
        }
        if (user.roles.includes('AGENT') && property.agentId === user.id) {
            return property;
        }
        const assignment = await this.prisma.verificationAssignment.findFirst({
            where: { propertyId: id, professionalId: user.id }
        });
        if (assignment) {
            return property;
        }
        if (property.source === 'LISTED_PROPERTY' && user.roles.includes('NRI')) {
            return property;
        }
        throw new common_1.ForbiddenException('Access denied to this property');
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map