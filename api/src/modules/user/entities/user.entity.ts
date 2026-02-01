import { faker } from '@faker-js/faker';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPositive, IsString, Length, Max, Min } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Added import
import { Profile } from 'src/modules/profile/entities/profile.entity';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The unique email of the user' })
  @Column({ unique: true, type: 'varchar', length: 150 })
  @IsString()
  @IsNotEmpty()
  @Length(5, 150)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 25, description: 'The age of the user' })
  @Column({ type: 'int' })
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @Max(150)
  age: number;

  // Virtual Property
  @ApiProperty({ example: 'John Doe', description: 'The combined first and last name' })
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

   @OneToOne(() => Profile, (profile) => profile.user)
   profile: Profile;

//   @ApiProperty({ example: '000-00-0000', description: 'Social Security Number (Auto-generated)' })
//   @Column()
//   @IsString()
//   ssn: string;

//   @BeforeInsert()
//   generateSSN() {
//     this.ssn = faker.string.numeric('###-##-####');
//   }
}
