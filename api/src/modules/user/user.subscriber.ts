import { UserRole } from "src/shared/enums/user-role.enum";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { Role } from "../role/entities/role.entity";
import { User } from "./entities/user.entity";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
 listenTo() { return User; }

  async beforeInsert(event: InsertEvent<User>) {
    const { entity, manager } = event;
    if (!entity.roles || entity.roles.length === 0) {
      const roleRepo = manager.getRepository(Role);
      const defaultRole = await roleRepo.findOneBy({ name: UserRole.USER });
      if (defaultRole) {
        entity.roles = [defaultRole];
      }
    }
  }
}
