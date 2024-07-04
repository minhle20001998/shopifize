import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import {
  CreateAddressDto,
  JwtAuthGuard,
  UUIDDto,
  UpdateAddressDto,
  UserParam,
} from '@shopifize/custom-nestjs';
import { SERVER_ERROR, User, generateResponse } from '@shopifize/helpers';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('ping')
  ping() {
    return this.addressService.ping();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserAddressById(@UserParam() user: User, @Param() { id }: UUIDDto) {
    try {
      const address = await this.addressService.getAddressesById(user, id);
      return generateResponse(address, true);
    } catch (e) {
      return generateResponse(null, false, SERVER_ERROR);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserAddress(@UserParam() user: User) {
    try {
      const address = await this.addressService.getAddresses(user);
      return generateResponse(address, true);
    } catch (e) {
      return generateResponse(null, false, SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addAddress(
    @UserParam() user: User,
    @Body() addressDetail: CreateAddressDto,
  ) {
    try {
      await this.addressService.addAddress(user, addressDetail);
      return generateResponse(null, true);
    } catch (e) {
      return generateResponse(null, false, SERVER_ERROR);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @Param() { id }: UUIDDto,
    @UserParam() user: User,
    @Body() addressDetail: UpdateAddressDto,
  ) {
    try {
      const result = await this.addressService.updateAddress(
        id,
        user,
        addressDetail,
      );
      return generateResponse(null, result);
    } catch (e) {
      return generateResponse(null, false, e.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeAddress(@Param() { id }: UUIDDto, @UserParam() user: User) {
    try {
      const result = await this.addressService.deleteAddress(id, user);
      return generateResponse(null, result);
    } catch (e) {
      return generateResponse(null, false, e.message);
    }
  }
}
