import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isuuid } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      await this.productRepository.save(newProduct);
      return newProduct;
    } catch (e) {
      /* handle error */
      this.handleError(e);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const products = this.productRepository.find({
        skip: offset,
        take: limit,
      });
      return products;
    } catch (e) {
      /* handle error */
      this.handleError(e);
    }
  }

  async findOne(term: string) {
    let product: Product;

    if (isuuid(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const query = this.productRepository.createQueryBuilder();
      product = await query
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toUpperCase(),
        })
        .getOne();
    }
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) throw new NotFoundException('product not Found');

    try {
      await this.productRepository.save(product);
      return product;
    } catch (e) {
      /* handle error */
      this.handleError(e);
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.productRepository.delete(id);

    return {
      ok: true,
      msg: 'product deleted',
    };
  }

  private handleError(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
