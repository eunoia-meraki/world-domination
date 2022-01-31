import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AddUserDto } from './dto/add-user.dto';
import { FilterUsersInput } from './dto/filter-users.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(addUserDto: AddUserDto): Promise<User> {
    const createdUser = new this.userModel(addUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async filter(filters: FilterUsersInput) {
    return this.userModel.find({ ...filters }).exec();
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
