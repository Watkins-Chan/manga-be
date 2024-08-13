import { Entity, BeforeInsert, PrimaryColumn, Column } from 'typeorm';

@Entity('manga_list')
export class MangaList {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column()
  cover_image: string;

  @BeforeInsert()
  generateId() {
    this.id = Math.random().toString(36).substring(2, 10);
  }
}
