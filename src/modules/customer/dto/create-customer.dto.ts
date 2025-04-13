import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
  })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({
    example: 'Johnny',
    description: 'Nickname of the customer',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ example: '12.345.678-9', description: 'RG document' })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiPropertyOptional({
    example: '123.456.789-10',
    description: 'CPF document',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Birth date in ISO 8601 format',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+1 234 567 890',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Single', description: 'Marital status' })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional({
    example: 'Software Developer',
    description: 'Profession of the customer',
  })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional({ example: 0, description: 'Number of children' })
  @IsOptional()
  @IsString()
  numberOfChildren?: string;

  @ApiPropertyOptional({ example: '12345-678', description: 'Postal code' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    example: 'Main Street',
    description: 'Street address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '100', description: 'Address number' })
  @IsOptional()
  @IsString()
  addressNumber?: string;

  @ApiPropertyOptional({ example: 'Downtown', description: 'Neighborhood' })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiPropertyOptional({
    example: 'Apartment 101',
    description: 'Complement information (apartment, suite, etc.)',
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiPropertyOptional({ example: 'CityName', description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'StateName', description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'CountryName', description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: ['Father', 'Mother'],
    description: 'Family members',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  family?: string[];

  @ApiPropertyOptional({
    example: ['Hotel', 'Airbnb'],
    description: 'Accommodation preferences',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accommodationPreference?: string[];

  @ApiPropertyOptional({
    example: ['Delta', 'United'],
    description: 'Airline preferences',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  airPreference?: string[];

  @ApiPropertyOptional({
    example: ['Adventure', 'Relaxation'],
    description: 'Travel style',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  travelStyle?: string[];

  @ApiPropertyOptional({
    example: ['Cultural', 'Adventure'],
    description: 'Experiences of interest',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestedExperiences?: string[];

  @ApiPropertyOptional({
    example: ['Paris', 'Bali'],
    description: 'Dream trips',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dreamTrips?: string[];

  @ApiPropertyOptional({
    example: ['New York', 'Tokyo'],
    description: 'Recent trips',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recentTrips?: string[];

  @ApiPropertyOptional({
    example: ['VIP', 'Frequent'],
    description: 'Tags for customer segmentation',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    example: 'Some additional observations about the customer',
    description: 'Observations',
  })
  @IsOptional()
  @IsString()
  observation?: string;

  @ApiPropertyOptional({
    example: 'Referred by a friend',
    description: 'Referral source',
  })
  @IsOptional()
  @IsString()
  referralSource?: string;
}
