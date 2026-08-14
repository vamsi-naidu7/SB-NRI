import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyType, PropertySource, RoleName } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async createProperty(data: any, user: { id: string, roles: string[] }) {
    const isAgent = user.roles.includes('AGENT');
    const source = isAgent ? PropertySource.LISTED_PROPERTY : PropertySource.EXTERNAL_PROPERTY;
    
    return this.prisma.property.create({
      data: {
        title: data.title,
        type: data.type as PropertyType,
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

  async findAll(filters: any) {
    // simplified search
    return this.prisma.property.findMany({
      where: {
        type: filters.type ? (filters.type as PropertyType) : undefined,
      }
    });
  }

  async findOne(id: string, user: { id: string, roles: string[] }) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        agent: true,
        rm: true,
      }
    });

    if (!property) throw new NotFoundException('Property not found');

    // Access control logic
    if (user.roles.includes('ADMIN') || user.roles.includes('RELATIONSHIP_MANAGER')) {
      return property; // RM and Admin see all
    }

    if (user.roles.includes('NRI') && property.ownerId === user.id) {
      return property;
    }

    if (user.roles.includes('AGENT') && property.agentId === user.id) {
      return property;
    }

    // Lawyers, Site Inspectors, CAs need assignment check
    const assignment = await this.prisma.verificationAssignment.findFirst({
      where: { propertyId: id, professionalId: user.id }
    });

    if (assignment) {
      return property;
    }

    // Listed properties might be public, assuming public if LISTED_PROPERTY for NRI search
    if (property.source === 'LISTED_PROPERTY' && user.roles.includes('NRI')) {
       return property;
    }

    throw new ForbiddenException('Access denied to this property');
  }
}
