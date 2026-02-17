import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  /**
   * Find all users with optional filters
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    isActive?: boolean;
  }): Promise<User[]> {
    const where: FindOptionsWhere<User> = {};

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    return this.repository.find({
      where,
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Find a user by userName
   */
  async findByUserName(userName: string): Promise<User | null> {
    return this.repository.findOne({ where: { userName } });
  }

  /**
   * Find a user by userName with password (for authentication)
   */
  async findByUserNameWithPassword(userName: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.userName = :userName', { userName })
      .addSelect('user.password')
      .getOne();
  }

  /**
   * Update a user
   */
  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, userData);
    return this.findById(id);
  }

  /**
   * Soft delete a user (set isActive to false)
   */
  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: false });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Hard delete a user (remove from database)
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Check if userName exists
   */
  async userNameExists(userName: string): Promise<boolean> {
    const count = await this.repository.count({ where: { userName } });
    return count > 0;
  }

  /**
   * Count total users
   */
  async count(options?: { isActive?: boolean }): Promise<number> {
    const where: FindOptionsWhere<User> = {};

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    return this.repository.count({ where });
  }

  /**
   * Find users with pagination
   */
  async findWithPagination(options: {
    page: number;
    limit: number;
    isActive?: boolean;
  }): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { page, limit, isActive } = options;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User> = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, total] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Search users by name or userName
   */
  async search(searchTerm: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.userName ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }
}
