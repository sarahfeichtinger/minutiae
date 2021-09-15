"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const finger_entity_1 = require("./entities/finger.entity");
const fingers_service_1 = require("./fingers.service");
const fingers_controller_1 = require("./fingers.controller");
const user_entity_1 = require("../users/entities/user.entity");
let FingersModule = class FingersModule {
};
FingersModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([finger_entity_1.Finger, user_entity_1.User])],
        providers: [fingers_service_1.FingersService],
        controllers: [fingers_controller_1.FingersController],
        exports: [fingers_service_1.FingersService],
    })
], FingersModule);
exports.FingersModule = FingersModule;
//# sourceMappingURL=fingers.module.js.map