import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/groups.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsFilter } from './filters/groups.filter';
import { GroupDto } from './dto/group.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectRepository(Group) private readonly groupRepository: Repository<Group>) {}

  findOne(filter: GroupsFilter): Promise<Group> {
    // Fix issues with null prototype objects which do not work as filters
    filter = JSON.parse(JSON.stringify(filter));
    return this.groupRepository.findOne(filter, { relations: ['users'] });
  }

  findAll(filter: GroupsFilter): Promise<GroupDto[]> {
    const query = this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'users')
      .addOrderBy('group.name');

    if (filter.id) {
      query.where('group.id = :id', { id: filter.id });
    }
    if (filter.name) {
      query.where('LOWER(group.name) LIKE :name', { name: `%${filter.name}%` });
    }

    return query.getMany();
  }

  createMany(groups: CreateGroupDto[]): Promise<Group[]> {
    return Promise.all(
      groups.map(async (group: Group) => {
        const filter = { name: group.name };
        const foundGroup = await this.groupRepository.findOne(filter);
        if (!foundGroup) {
          return this.groupRepository.save(
            this.groupRepository.create({
              name: group.name,
            }),
          );
        }
        return foundGroup;
      }),
    );
  }

  async delete(group: GroupDto): Promise<GroupDto> {
    const result = await this.groupRepository.delete({ id: group.id });
    if (result.affected < 1) {
      throw new InternalServerErrorException('An error occurred while deleting the group.');
    }

    return group;
  }
}
