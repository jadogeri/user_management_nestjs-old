import { LocationInterface } from "src/shared/interfaces/location.interface";
import { Column } from "typeorm";

export class Location implements LocationInterface {
    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    zipcode: string;
}
