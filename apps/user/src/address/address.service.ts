import { Inject, Injectable } from '@nestjs/common';
import {
  ADDRESS_REPOSITORY,
  CreateAddressDto,
  UpdateAddressDto,
} from '@shopifize/custom-nestjs';
import { Repository } from '@shopifize/database';
import { Address, ShopifizedError, User } from '@shopifize/helpers';

@Injectable()
export class AddressService {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private AddressDatabase: Repository<Address>,
  ) {}

  ping() {
    return 'ping address';
  }

  async getAddresses(user: User) {
    const addresses = await this.AddressDatabase.find({
      where: { profile: user.profile },
    });

    return addresses;
  }

  async getAddressesById(user: User, id: string) {
    const address = await this.AddressDatabase.findOne({
      where: { profile: user.profile, id },
    });

    return address;
  }

  async addAddress(user: User, addressDetail: CreateAddressDto) {
    const addressInstance = this.AddressDatabase.create({
      address: addressDetail.address,
      fullName: addressDetail.fullName,
      phoneNumber: addressDetail.phoneNumber,
      longitude: addressDetail.longitude,
      latitude: addressDetail.latitude,
      profile: user.profile,
    });

    await this.AddressDatabase.save(addressInstance);

    return true;
  }

  async updateAddress(id: string, user: User, addressDetail: UpdateAddressDto) {
    const address = await this.AddressDatabase.findOne({
      where: {
        id: id,
      },
      relations: { profile: { user: true } },
    });

    if (!address) {
      throw new ShopifizedError('Address not found');
    }

    const isSameUser = address.profile.user.id === user.id;

    if (!isSameUser) {
      throw new ShopifizedError('Not same user');
    }

    const updatedAddressInstance = { ...address, ...addressDetail };

    await this.AddressDatabase.save(updatedAddressInstance);
    return true;
  }

  async deleteAddress(id: string, user: User) {
    const address = await this.AddressDatabase.findOne({
      where: { id: id },
      relations: { profile: { user: true } },
    });

    const isSameUser = address.profile.user.id === user.id;

    if (!isSameUser) {
      throw new ShopifizedError('Not same user');
    }

    await this.AddressDatabase.remove(address);

    return true;
  }
}
