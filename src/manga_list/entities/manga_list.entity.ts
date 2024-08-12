import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('manga_list')
export class MangaList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column()
  cover_image: string;
}
