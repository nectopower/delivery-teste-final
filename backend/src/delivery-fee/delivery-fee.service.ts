import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryFeeService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    const config = await this.prisma.deliveryFeeConfig.findFirst();
    
    if (!config) {
      return this.prisma.deliveryFeeConfig.create({
        data: {
          basePrice: 5.0,
          pricePerKm: 1.5,
          rushHourMultiplier: 1.5,
          rushHourStart: 17,
          rushHourEnd: 21,
          nightFeeMultiplier: 1.2,
          nightFeeStart: 22,
          nightFeeEnd: 6,
        },
      });
    }
    
    return config;
  }

  async updateConfig(data: {
    basePrice?: number;
    pricePerKm?: number;
    rushHourMultiplier?: number;
    rushHourStart?: number;
    rushHourEnd?: number;
    nightFeeMultiplier?: number;
    nightFeeStart?: number;
    nightFeeEnd?: number;
  }) {
    const config = await this.getConfig();
    
    return this.prisma.deliveryFeeConfig.update({
      where: { id: config.id },
      data,
    });
  }

  async calculateDeliveryFee(distance: number) {
    const config = await this.getConfig();
    
    // Calcular taxa base
    let fee = config.basePrice + (distance * config.pricePerKm);
    
    // Verificar se é horário de pico
    const currentHour = new Date().getHours();
    
    if (
      (config.rushHourStart <= config.rushHourEnd && 
       currentHour >= config.rushHourStart && 
       currentHour < config.rushHourEnd) ||
      (config.rushHourStart > config.rushHourEnd && 
       (currentHour >= config.rushHourStart || 
        currentHour < config.rushHourEnd))
    ) {
      fee *= config.rushHourMultiplier;
    }
    
    // Verificar se é horário noturno
    if (
      (config.nightFeeStart <= config.nightFeeEnd && 
       currentHour >= config.nightFeeStart && 
       currentHour < config.nightFeeEnd) ||
      (config.nightFeeStart > config.nightFeeEnd && 
       (currentHour >= config.nightFeeStart || 
        currentHour < config.nightFeeEnd))
    ) {
      fee *= config.nightFeeMultiplier;
    }
    
    // Arredondar para 2 casas decimais
    return Math.round(fee * 100) / 100;
  }

  async getDeliveryTimeEstimate(distance: number) {
    // Tempo base: 10 minutos de preparo + 5 minutos por km
    const baseTime = 10;
    const timePerKm = 5;
    
    let estimatedTime = baseTime + (distance * timePerKm);
    
    // Verificar se é horário de pico para ajustar o tempo
    const config = await this.getConfig();
    const currentHour = new Date().getHours();
    
    if (
      (config.rushHourStart <= config.rushHourEnd && 
       currentHour >= config.rushHourStart && 
       currentHour < config.rushHourEnd) ||
      (config.rushHourStart > config.rushHourEnd && 
       (currentHour >= config.rushHourStart || 
        currentHour < config.rushHourEnd))
    ) {
      // Adicionar 30% ao tempo em horário de pico
      estimatedTime *= 1.3;
    }
    
    // Arredondar para o inteiro mais próximo
    return Math.round(estimatedTime);
  }
}
